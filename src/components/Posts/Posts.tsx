import React, { useEffect, useState } from "react";
import { Community } from "@/src/atoms/communitiesAtom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { auth, firestore } from "@/src/firebase/clientApp";
import communityId from "@/src/pages/r/[communityId]";
import usePosts from "@/src/hooks/usePosts";
import { Post } from "@/src/atoms/postsAtom";
import PostItem from "@/src/components/Posts/PostItem/PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "@/src/components/Posts/PostLoader";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();

  const getPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);

      // store in post state

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log("posts: ", posts);
    } catch (error) {
      if (error instanceof Error) {
        console.log("getPosts error: ", error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === communityData.creatorId}
              userVoteValue={
                postStateValue.postVotes.find(
                  (postVote) => postVote.postId === post.id
                )?.voteStatus
              }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
