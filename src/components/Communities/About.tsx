import React, { useRef, useState } from "react";
import { atomCommunityState, Community } from "@/src/atoms/communitiesAtom";
import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import moment from "moment";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import useSelectFile from "@/src/hooks/useSelectFile";
import { FaReddit } from "react-icons/fa";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { firestore, storage } from "../../firebase/clientApp";
import { doc, updateDoc } from "@firebase/firestore";
import { useSetRecoilState } from "recoil";

type AboutProps = {
  community: Community;
};

const About: React.FC<AboutProps> = ({ community }) => {
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
  const [loadingImage, setLoadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(atomCommunityState);

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setLoadingImage(true);
    try {
      // download image to storage -> get image as new URL
      const imageRef = ref(storage, `communities/${community.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);

      // update firestore doc
      await updateDoc(doc(firestore, `communities`, community.id), {
        imageURL: downloadURL,
      });

      // update atom state
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));

      // clear image input
      setSelectedFile(null);
    } catch (error) {
      console.log("onUpdateImage error: ", error);
    }
    setLoadingImage(false);
  };

  return (
    <Box position={"sticky"} top={"14px"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        bg={"blue.400"}
        color={"white"}
        borderRadius={"4px 4px 0px 0px"}
        p={3}
      >
        <Text fontSize={"10pt"} fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex
        direction={"column"}
        p={3}
        bg={"white"}
        borderRadius={"0px 0px 4px 4px"}
      >
        <Stack>
          <Flex width={"100%"} p={2} fontSize={"10pt"} fontWeight={700}>
            <Flex direction={"column"} flexGrow={1}>
              <Text>{community.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction={"column"} flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align={"center"}
            width={"100%"}
            p={1}
            fontWeight={500}
            fontSize={"10pt"}
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {community.createdAt && (
              <Text>
                Created{" "}
                {moment(new Date(community.createdAt.seconds * 1000)).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${community.id}/submit`}>
            <Button mt={3} height={"30px"} width={"100%"}>
              Create Post
            </Button>
          </Link>
          {user?.uid === community.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize={"10pt"}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align={"center"} justify={"space-between"}>
                  <Text
                    color={"blue.500"}
                    cursor={"pointer"}
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change image
                  </Text>
                  {community.imageURL || selectedFile ? (
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={selectedFile || community?.imageURL}
                      alt="Dan Abramov"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color={"brand.100"}
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (loadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor={"pointer"} onClick={() => onUpdateImage()}>
                      Save changes
                    </Text>
                  ))}
                <input
                  id={"file-upload"}
                  type={"file"}
                  accept={"image/x-png,image/gif,image/jpeg"}
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;
