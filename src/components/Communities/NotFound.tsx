import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <Flex
      direction={"column"}
      justify={"center"}
      alignItems={"center"}
      minHeight={"60vh"}
    >
      Sorry, that community does not exists or has been banned
      <Link href={"/"}>
        <Button mt={4}>Go Home</Button>
      </Link>
    </Flex>
  );
};

export default NotFound;
