import { Post } from "@/src/atoms/postsAtom";
import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from "react-icons/io5";
import { BsChat, BsDot } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment";
import PostItemThumbnail from "@/src/components/Posts/PostItem/PostItemThumbnail";
import usePosts from "@/src/hooks/usePosts";
import { useRouter } from "next/router";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  onVote: usePosts.onVote;
  onDeletePost: (post: Post) => Promise<boolean>;
  userVoteValue?: number;
  onSelectPost?: usePosts.onSelectPost;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const router = useRouter();
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const isSinglePostPage: boolean = !onSelectPost;

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        throw new Error("Failed to delete post");
      }

      console.log("Post was successfully deleted");
      if (isSinglePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    setLoadingDelete(false);
  };

  return (
    <Flex
      border={"1px solid"}
      bg={"white"}
      borderColor={isSinglePostPage ? "white" : "gray.300"}
      borderRadius={isSinglePostPage ? "4px 4px 0px 0px" : 4}
      _hover={{ borderColor: isSinglePostPage ? "none" : "gray.500" }}
      cursor={isSinglePostPage ? "unset" : "pointer"}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction={"column"}
        align={"center"}
        bg={isSinglePostPage ? "none" : "gray.100"}
        p={2}
        width={"40px"}
        borderRadius={isSinglePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          cursor={"pointer"}
          onClick={(event) => onVote(event, 1, post, post.communityId)}
        />
        <Text fontSize={"9pt"}>{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === 1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize={22}
          cursor={"pointer"}
          onClick={(event) => onVote(event, -1, post, post.communityId)}
        />
      </Flex>
      <Flex direction={"column"} width={"100%"}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <Stack spacing={1} p={"10px"}>
          <Stack
            direction={"row"}
            spacing={0.6}
            fontSize={"9pt"}
            align={"center"}
          >
            {homePage && (
              <>
                {post.communityImageUrl ? (
                  <Image
                    src={post.communityImageUrl}
                    borderRadius={"full"}
                    boxSize={"18px"}
                    mr={2}
                  />
                ) : (
                  <Icon
                    as={FaReddit}
                    fontSize={"18pt"}
                    color={"blue.500"}
                    mr={1}
                  />
                )}
                <Link href={`/r/${post.communityId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(event) => event.stopPropagation()}
                  >{`/r/${post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color={"gray.500"} fontSize={8} />
              </>
            )}
            <Text>
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize={"12pt"} fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize={"10pt"}>{post.body}</Text>
          {post.imageURL && (
            <Flex justify={"center"} align={"center"} p={2}>
              {loadingImage && (
                <Skeleton height={"200px"} width={"100%"} borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight={"460px"}
                alt={"Post Image"}
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color={"gray.500"}>
          <PostItemThumbnail icon={BsChat} text={post.numberOfComments} />
          {userIsCreator && (
            <PostItemThumbnail
              icon={AiOutlineDelete}
              text={"Delete"}
              loading={loadingDelete}
              onClick={handleDelete}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
