import React from "react";
import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import {
  TextInputsName,
  TextInputsState,
} from "@/src/components/Posts/PostForm/NewPostForm/NewPostForm.types";

type TextInputsProps = {
  textInputs: TextInputsState;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  handleCreatePost,
  loading,
  onChange,
}) => {
  return (
    <Stack spacing={3} width={"100%"}>
      <Input
        name={TextInputsName.Title}
        onChange={onChange}
        value={textInputs.title}
        fontSize={"10pt"}
        borderRadius={4}
        placeholder={"Title"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          boxShadow: "none",
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Textarea
        name={TextInputsName.Body}
        onChange={onChange}
        value={textInputs.body}
        fontSize={"10pt"}
        borderRadius={4}
        height={"100px"}
        placeholder={"Text (optional)"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          boxShadow: "none",
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex justifyContent={"flex-end"}>
        <Button
          height={"34px"}
          padding={"0px 30px"}
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInputs;
