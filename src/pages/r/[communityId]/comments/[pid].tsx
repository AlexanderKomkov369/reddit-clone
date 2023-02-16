import React, { useEffect } from "react";
import PageContent from "@/src/components/Layout/PageContent";
import PostItem from "@/src/components/Posts/PostItem/PostItem";
import usePosts from "@/src/hooks/usePosts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/src/firebase/clientApp";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import { Post } from "@/src/atoms/postsAtom";
import About from "@/src/components/Communities/About";
import useCommunityData from "@/src/hooks/useCommunityData";
import Comments from "@/src/components/Posts/Comments/Comments";
import { NextPage } from "next";

const PostPage: NextPage = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const {
    postStateValue: { selectedPost, postVotes },
    setPostStateValue,
    onVote,
    onDeletePost,
  } = usePosts();
  const {
    communityState: { currentCommunity },
  } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.error("fetchPost error: ", error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, selectedPost]);

  return (
    <PageContent>
      <>
        {selectedPost && (
          <PostItem
            post={selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userIsCreator={selectedPost.creatorId === user?.uid}
            userVoteValue={
              postVotes.find((postVote) => postVote.postId === selectedPost?.id)
                ?.voteStatus
            }
          />
        )}
        {selectedPost && (
          <Comments
            user={user}
            selectedPost={selectedPost}
            communityId={selectedPost?.communityId}
          />
        )}
      </>
      <>{currentCommunity && <About community={currentCommunity} />}</>
    </PageContent>
  );
};

export default PostPage;
