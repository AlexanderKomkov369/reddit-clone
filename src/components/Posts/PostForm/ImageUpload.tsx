import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import { TypeItemTitle } from "./NewPostForm/NewPostForm.types";

type ImageUploadProps = {
  selectedFile: string | null;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: Dispatch<SetStateAction<TypeItemTitle>>;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  setSelectedTab,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex
      direction={"column"}
      justify={"center"}
      align={"center"}
      width={"100%"}
    >
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth={"400px"} maxHeight={"400px"} />
          <Stack direction={"row"} mt={4}>
            <Button height={"28px"} onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant={"outline"}
              height={"28px"}
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify={"center"}
          align={"center"}
          p={20}
          width={"100%"}
          border={"1px dashed"}
          borderColor={"gray.200"}
          borderRadius={4}
        >
          <Button
            variant={"outline"}
            height={"28px"}
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type={"file"}
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
