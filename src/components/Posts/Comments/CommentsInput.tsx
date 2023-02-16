import React, { Dispatch, SetStateAction } from "react";
import { User } from "@firebase/auth";
import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import AuthButtons from "@/src/components/Navbar/RightContent/AuthButtons";
import Comments from "@/src/components/Posts/Comments/Comments";
import { nulldefined } from "@/src/types/types";

type CommentsInputProps = {
  user: User | nulldefined;
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  createLoading: boolean;
  onCreateComment: Comments.onCreateComment;
};

const CommentsInput: React.FC<CommentsInputProps> = ({
  user,
  commentText,
  setCommentText,
  createLoading,
  onCreateComment,
}) => {
  return (
    <Flex direction={"column"} position={"relative"}>
      {user ? (
        <>
          <Text mb={1}>
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder={"What are your thoughts??"}
            fontSize={"10pt"}
            minHeight={"160px"}
            borderRadius={4}
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              boxShadow: "none",
              outline: "none",
              bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position={"absolute"}
            left={"1px"}
            right={"0.5px"}
            bottom={"1px"}
            justify={"flex-end"}
            bg={"gray.100"}
            p={"6px 8px"}
            borderRadius={"0px 0px 4px 4px"}
            zIndex={99}
          >
            <Button
              height={"26px"}
              isDisabled={!commentText.length}
              isLoading={createLoading}
              onClick={() => onCreateComment(commentText)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align={"center"}
          justify={"space-between"}
          p={4}
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};

export default CommentsInput;
