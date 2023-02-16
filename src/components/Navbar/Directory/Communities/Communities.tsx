import React, { useState } from "react";
import CreateCommunityModal from "@/src/components/Modal/CreateCommunityModal/CreateCommunityModal";
import { Box, Flex, MenuItem, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { Icon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { atomCommunityState } from "@/src/atoms/communitiesAtom";
import MenuListItem from "@/src/components/Navbar/Directory/Communities/MenuListItem";
import { FaReddit } from "react-icons/fa";

const Communities: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { mySnippets } = useRecoilValue(atomCommunityState);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={6}>
        <Text
          pl={3}
          mb={1}
          fontSize={"7pt"}
          fontWeight={500}
          color={"gray.500"}
        >
          MODERATING
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              displayText={`/r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor={"brand.100"}
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={6}>
        <Text
          pl={3}
          mb={1}
          fontSize={"7pt"}
          fontWeight={500}
          color={"gray.500"}
        >
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            displayText={`/r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            icon={FaReddit}
            iconColor={"blue.500"}
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
