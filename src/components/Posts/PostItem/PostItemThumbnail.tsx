import React from "react";
import { IconType } from "react-icons";
import { Icon } from "@chakra-ui/icons";
import { Flex, FlexProps, Spinner, Text } from "@chakra-ui/react";

type PostItemThumbnailProps = {
  icon: IconType;
  text: string | number;
  loading?: boolean;
} & FlexProps;

const PostItemThumbnail: React.FC<PostItemThumbnailProps> = ({
  icon,
  text,
  loading = false,
  ...props
}) => {
  return (
    <Flex
      align={"center"}
      p={"8px 10px"}
      cursor={"pointer"}
      borderRadius={4}
      _hover={{ bg: "gray.200" }}
      {...props}
    >
      {loading ? (
        <Spinner size={"sm"} />
      ) : (
        <>
          <Icon as={icon} mr={2} />
          <Text fontSize={"9pt"}>{text}</Text>
        </>
      )}
    </Flex>
  );
};

export default PostItemThumbnail;
