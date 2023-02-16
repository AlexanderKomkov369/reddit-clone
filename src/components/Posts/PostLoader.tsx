import React from "react";
import { Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

const PostLoader: React.FC = () => {
  return (
    <Stack spacing={6}>
      <Box padding={"10px"} boxShadow={"lg"} bg={"white"} borderRadius={4}>
        <SkeletonText mt={4} noOfLines={1} spacing={"4"} width={"40%"} />
        <SkeletonText mt={4} noOfLines={4} spacing={"4"} />
        <Skeleton mt={4} height={"200px"} />
      </Box>
      <Box padding={"10px"} boxShadow={"lg"} bg={"white"} borderRadius={4}>
        <SkeletonText mt={4} noOfLines={1} spacing={"4"} width={"40%"} />
        <SkeletonText mt={4} noOfLines={4} spacing={"4"} />
        <Skeleton mt={4} height={"200px"} />
      </Box>
    </Stack>
  );
};

export default PostLoader;
