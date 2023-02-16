import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { atomPostState, Post, PostVote } from "@/src/atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { deleteObject, ref } from "@firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  where,
  writeBatch,
} from "@firebase/firestore";
import { atomCommunityState } from "@/src/atoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { atomAuthModalState } from "@/src/atoms/authModalAtom";
import { useRouter } from "next/router";

declare namespace usePosts {
  export type onVote = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    vote: PostVote["voteStatus"],
    post: Post,
    communityId: string
  ) => Promise<void>;
  export type onSelectPost = (post: Post) => void;
}

const usePosts = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(atomPostState);
  const currentCommunity = useRecoilValue(atomCommunityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(atomAuthModalState);

  const onVote: usePosts.onVote = async (event, vote, post, communityId) => {
    event.stopPropagation();
    // check for user -> if not -> open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (postVote) => postVote.postId === post.id
      );

      const batch = writeBatch(firestore);
      // copying data to avoid mutation
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange: number = vote;

      if (!existingVote) {
        // get doc ref
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        // create new vote
        const newVote: PostVote = {
          id: postVoteRef.id,
          communityId: communityId,
          postId: post.id!,
          voteStatus: vote,
        };
        // update doc
        batch.set(postVoteRef, newVote);
        // update updated data
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        // create ref
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        // if the vote is directional
        if (existingVote.voteStatus === vote) {
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (postVote) => postVote.id !== existingVote.id
          );
          // delete postVote from firestore
          batch.delete(postVoteRef);

          voteChange *= -1;
        }
        // if user flippin vote
        else {
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const postVoteIndex = updatedPostVotes.findIndex(
            (postVote) => postVote.id === existingVote.id
          );
          updatedPostVotes[postVoteIndex] = {
            ...existingVote,
            voteStatus: vote,
          };

          batch.update<PostVote | DocumentData>(postVoteRef, {
            voteStatus: vote,
          });

          voteChange = 2 * vote;
        }
      }

      // update post document
      const postRef = doc(firestore, "posts", post.id!);
      batch.update<Post | DocumentData>(postRef, {
        voteStatus: voteStatus + voteChange,
      });

      await batch.commit();

      // update global state
      const postIndex = postStateValue.posts.findIndex(
        (post) => post.id === updatedPost.id
      );
      updatedPosts[postIndex] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
    } catch (error) {
      console.log("onVote error: ", error);
    }
  };

  const onSelectPost: usePosts.onSelectPost = (post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));

    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // if post has image -> delete image from storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete firestore doc
      const docRef = doc(firestore, `posts`, post.id!);
      await deleteDoc(docRef);

      // update atom state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter(({ id }) => id !== post.id),
      }));

      return true;
    } catch {
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVotesDocs = await getDocs(postVotesQuery);
    const postVotes = postVotesDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostVote[];

    setPostStateValue((prev) => ({
      ...prev,
      postVotes,
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity) return;

    getCommunityPostVotes(currentCommunity.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
