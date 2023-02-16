import { auth } from "@/src/firebase/clientApp";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { atomAuthModalState } from "@/src/atoms/authModalAtom";
import { Flex, Input } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { FaReddit } from "react-icons/fa";
import { BsLink45Deg } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import useDirectory from "@/src/hooks/useDirectory";

const CreatePostLink: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(atomAuthModalState);
  const { toggleMenuOpen } = useDirectory();

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { communityId } = router.query;
    if (communityId) {
      router.push(`/r/${communityId}/submit`);
      return;
    }

    toggleMenuOpen();
  };

  return (
    <Flex
      justify={"space-evenly"}
      align={"center"}
      bg={"white"}
      height={"56px"}
      borderRadius={4}
      border={"1px solid"}
      borderColor={"gray.400"}
      p={2}
      mb={4}
    >
      <Icon as={FaReddit} fontSize={36} color={"gray.300"} mr={4} />
      <Input
        fontSize={"10pt"}
        placeholder={"Create Post"}
        height={"36px"}
        bg={"gray.50"}
        borderColor={"gray.200"}
        borderRadius={4}
        mr={4}
        onClick={onClick}
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          boxShadow: "none",
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Icon
        as={IoImageOutline}
        mr={4}
        color={"gray.400"}
        fontSize={24}
        cursor={"pointer"}
      />
      <Icon
        as={BsLink45Deg}
        color={"gray.400"}
        fontSize={24}
        cursor={"pointer"}
      />
    </Flex>
  );
};

export default CreatePostLink;
