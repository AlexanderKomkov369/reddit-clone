import React, { useEffect, useState } from "react";
import { Community } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "@firebase/firestore";
import { firestore } from "@/src/firebase/clientApp";
import {
  Box,
  Button,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaReddit } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

const Recommendations: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const {
    communityState: { mySnippets },
    joinOrLeaveCommunity,
  } = useCommunityData();

  const getCommunityRecommendations = async () => {
    setRecommendationsLoading(true);
    try {
      // create communities query
      const communitiesDocsQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      // get communities
      const communitiesDocs = await getDocs(communitiesDocsQuery);
      const communities = communitiesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];

      setCommunities(communities);
    } catch (error) {
      console.log("getCommunityRecommendations error: ", error);
    }
    setRecommendationsLoading(false);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex
      direction={"column"}
      bg={"white"}
      borderRadius={4}
      border={"1px solid"}
      borderColor={"gray.300"}
    >
      <Flex
        align={"flex-end"}
        color={"white"}
        p={"6px 10px"}
        height={"70px"}
        borderRadius={"3px 3px 0px 0px"}
        fontWeight={700}
        bgImage={"url(/images/recCommsArt.png)"}
        backgroundSize={"cover"}
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction={"column"}>
        {recommendationsLoading ? (
          <Stack mt={2} p={3}>
            <Flex justify={"space-between"} align={"center"}>
              <SkeletonCircle size={"10"} />
              <Skeleton height={"10px"} width={"70%"} />
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <SkeletonCircle size={"10"} />
              <Skeleton height={"10px"} width={"70%"} />
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <SkeletonCircle size={"10"} />
              <Skeleton height={"10px"} width={"70%"} />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((community, i) => {
              const isJoined = !!mySnippets.find(
                (snippet) => snippet.communityId === community.id
              );
              return (
                <Link key={community.id} href={`/r/${community.id}`}>
                  <Flex
                    position={"relative"}
                    align={"center"}
                    fontSize={"10pt"}
                    borderBottom={"1px solid"}
                    borderColor={"gray.200"}
                    p={"10px 12px"}
                  >
                    <Flex align={"center"} width={"80%"}>
                      <Flex width={"15%"}>
                        <Text>{i + 1}</Text>
                      </Flex>
                      <Flex width={"80%"} align={"center"}>
                        {community.imageURL ? (
                          <Image
                            src={community.imageURL}
                            borderRadius={"full"}
                            boxSize={"28px"}
                            mr={2}
                          />
                        ) : (
                          <Icon
                            as={FaReddit}
                            fontSize={30}
                            color={"brand.100"}
                            mr={2}
                          />
                        )}
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >{`/r/${community.id}`}</span>
                      </Flex>
                    </Flex>
                    <Box position={"absolute"} right={"10px"}>
                      <Button
                        height={"22px"}
                        fontSize={"8pt"}
                        variant={isJoined ? "outline" : "solid"}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          joinOrLeaveCommunity(community, isJoined);
                        }}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
            <Box p={"10px 20px"}>
              <Button height={"30px"} width={"100%"}>
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Recommendations;
