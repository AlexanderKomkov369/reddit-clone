import React from "react";
import { Community } from "@/src/atoms/communitiesAtom";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "@/src/hooks/useCommunityData";

type HeaderProps = {
  community: Community;
};

const Header: React.FC<HeaderProps> = ({ community }) => {
  const { communityState, joinOrLeaveCommunity, loading } = useCommunityData();
  const isJoined = !!communityState.mySnippets.find(
    (snippet) => snippet.communityId === community.id
  );

  return (
    <Flex direction={"column"} width={"100%"} height={"146px"}>
      <Box height={"50%"} bg={"blue.500"} />
      <Flex justify={"center"} bg={"white"} flexGrow={1}>
        <Flex width={"95%"} maxWidth={"860px"}>
          {communityState.currentCommunity?.imageURL ? (
            <Image
              src={communityState.currentCommunity.imageURL}
              boxSize={"66px"}
              color={"blue.500"}
              position={"relative"}
              top={-3}
              border={"4px solid white"}
              borderRadius={"full"}
            />
          ) : (
            <Box
              bg={"white"}
              position={"relative"}
              top={-3}
              borderRadius={"full"}
            >
              <Icon
                as={FaReddit}
                fontSize={66}
                color={"blue.500"}
                border={"4px solid white"}
                borderRadius={"full"}
              />
            </Box>
          )}
          <Flex padding={"10px 16px"}>
            <Flex direction={"column"} mr={6}>
              <Text fontWeight={800} fontSize={"16pt"}>
                {community.id}
              </Text>
              <Text fontWeight={600} fontSize={"10pt"} color={"gray.400"}>
                r/{community.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              pl={6}
              pr={6}
              height={"30px"}
              isLoading={loading}
              onClick={() => joinOrLeaveCommunity(community, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
