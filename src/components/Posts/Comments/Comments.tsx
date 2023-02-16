import React, { useEffect, useState } from "react";
import { atomPostState, Post } from "@/src/atoms/postsAtom";
import { User } from "@firebase/auth";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import CommentsInput from "@/src/components/Posts/Comments/CommentsInput";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "@firebase/firestore";
import { firestore } from "@/src/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import CommentsItem, { Comment } from "../Comments/CommentsItem";
import { nulldefined } from "@/src/types/types";

declare namespace Comments {
  export type onCreateComment = (commentText: string) => Promise<void>;
  export type onDeleteComment = (comment: Comment) => Promise<void>;
}

type CommentsProps = {
  user: User | nulldefined;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  selectedPost,
  user,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>();
  const setPostState = useSetRecoilState(atomPostState);

  const onCreateComment: Comments.onCreateComment = async (commentText) => {
    if (!commentText?.length) return;

    setCreateLoading(true);

    try {
      // create batch
      const batch = writeBatch(firestore);

      // create commentDocRef
      const commentDocRef = doc(collection(firestore, "comments"));

      // create new Comment
      const newComment: Comment = {
        id: commentDocRef.id,
        text: commentText,
        creatorId: user!.uid,
        creatorDisplayText: user!.email!.split("@")[0],
        communityId,
        postId: selectedPost.id!,
        postTitle: selectedPost.title,
        createdAt: serverTimestamp() as Timestamp,
      };

      // set new comment into doc
      batch.set(commentDocRef, newComment);

      // manually set createdAt property for correct working | serverTimestamp calling on server,
      // so createdAt now incorrect
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post doc
      const postDocRef = doc(firestore, "posts", selectedPost.id!);
      batch.update<Post | DocumentData>(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update recoil state
      setCommentText("");
      setComments((prev) => [...prev, newComment]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error: ", error);
    }

    setCreateLoading(false);
  };

  const onDeleteComment: Comments.onDeleteComment = async (comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // delete comment doc
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update posts doc
      const postDocRef = doc(firestore, "posts", selectedPost.id!);
      batch.update<Post | DocumentData>(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setComments((prev) => prev.filter(({ id }) => id !== comment.id));
    } catch (error) {
      console.error("onDeleteComment error: ", error);
    }
    setLoadingDeleteId(null);
  };

  const getPostComments = async () => {
    try {
      // get comments query
      const commentsDocsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );
      // get comments
      const commentsDocs = await getDocs(commentsDocsQuery);
      const comments = commentsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(comments);
    } catch (error) {
      console.log("getPostComments error: ", error);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box bg={"white"} borderRadius={"0px 0px 4px 4px"} p={2}>
      <Flex
        direction={"column"}
        pl={10}
        pr={4}
        mb={6}
        fontSize={"10pt"}
        width={"100%"}
      >
        {!fetchLoading && (
          <CommentsInput
            user={user}
            commentText={commentText}
            onCreateComment={onCreateComment}
            createLoading={createLoading}
            setCommentText={setCommentText}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((i) => (
              <Box key={i} padding={"6px"} bg={"white"}>
                <SkeletonCircle size={"10"} />
                <SkeletonText mt={4} spacing={4} noOfLines={2} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction={"column"}
                justify={"center"}
                align={"center"}
                borderTop={"1px solid"}
                borderColor={"gray.200"}
                p={2}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No comments yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentsItem
                    key={comment.id}
                    comment={comment}
                    userId={user?.uid}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
