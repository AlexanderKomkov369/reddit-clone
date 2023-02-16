import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import PageContent from "@/src/components/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import usePosts from "@/src/hooks/usePosts";
import { Post, PostVote } from "@/src/atoms/postsAtom";
import PostLoader from "@/src/components/Posts/PostLoader";
import { Stack } from "@chakra-ui/react";
import PostItem from "@/src/components/Posts/PostItem/PostItem";
import CreatePostLink from "@/src/components/Communities/CreatePostLink";
import useCommunityData from "@/src/hooks/useCommunityData";
import Recommendations from "@/src/components/Navbar/Directory/Communities/Recommendations";
import Premium from "@/src/components/Communities/Premium";
import PersonalHome from "@/src/components/Communities/PersonalHome";

const Home: NextPage = () => {
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue: { postVotes, posts },
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();
  const {
    communityState: { mySnippets, snippetsFetched },
  } = useCommunityData();

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (mySnippets.length) {
        // get community Id for query
        const communityIds = mySnippets.map(({ communityId }) => communityId);
        // create posts query
        const postsDocQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", communityIds),
          limit(10),
          orderBy("createdAt", "desc")
        );
        // get posts
        const postsDocs = await getDocs(postsDocQuery);
        const posts = postsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts,
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("buildUserHomeFeed error: ", error);
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      // create posts query (10 max)
      const postsQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      // get posts docs
      const postsDocs = await getDocs(postsQuery);
      const posts = postsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.warn("buildNoUserHomeFeed error: ", error);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    try {
      // get posts id
      const postsIds = posts.map((post) => post.id);
      // create postVotes query
      const postsVotesQuery = query(
        collection(firestore, `users/${user?.uid!}/postVotes`),
        where("postId", "in", postsIds)
      );
      // get postVotes
      const postVotesDocs = await getDocs(postsVotesQuery);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostVote[];
      // update recoil
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes,
      }));
    } catch (error) {
      console.log("getUserPostVotes error: ", error);
    }
  };

  useEffect(() => {
    if (snippetsFetched) buildUserHomeFeed();
  }, [snippetsFetched]);

  useEffect(() => {
    if (!user && !userLoading) buildNoUserHomeFeed();
  }, [user, userLoading]);

  useEffect(() => {
    if (user && posts.length) getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, posts]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                userIsCreator={user?.uid === post.creatorId}
                onVote={onVote}
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
                userVoteValue={
                  postVotes.find((postVote) => postVote.postId === post.id)
                    ?.voteStatus
                }
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
};

export default Home;
