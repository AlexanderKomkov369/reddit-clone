import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  CommunityType,
  communityTypes,
} from "@/src/components/Modal/CreateCommunityModal/CreateCommunityModal.constants";
import { CreateCommunityModalProps } from "@/src/components/Modal/CreateCommunityModal/CreateCommunityModal.props";
import { Icon } from "@chakra-ui/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/src/firebase/clientApp";
import { doc, runTransaction, serverTimestamp } from "@firebase/firestore";
import { useRouter } from "next/router";
import useDirectory from "@/src/hooks/useDirectory";

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState("");
  const [charactersRemaining, setCharactersRemaining] = useState(21);
  const [communityType, setCommunityType] = useState<CommunityType>(
    CommunityType.Public
  );
  const [error, setError] = useState<string | null>(null);
  const [communityLoading, setCommunityLoading] = useState(false);
  const { toggleMenuOpen } = useDirectory();

  const handleCommunityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name as CommunityType);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length > 21) return;

    setCommunityName(value);
    setCharactersRemaining(21 - value.length);
  };

  const handleCreateCommunity = async () => {
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    setError(null);
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Community names must be between 3-21 characters, and can only contain letters, numbers, or underscore"
      );
      return;
    }

    setCommunityLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          { communityId: communityName, isModerator: true }
        );
      });

      handleClose();
      toggleMenuOpen();
      router.push(`/r/${communityName}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("createCommunity error: ", error);
        setError(error?.message);
      }
    }

    setCommunityLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={open}
        onClose={() => {
          if (!communityLoading) handleClose();
        }}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection={"column"}
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pr={3} pl={3} mb={2}>
            <Divider />
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              flexDirection={"column"}
              padding={"10px 0px"}
            >
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text color={"gray.500"} fontSize={11}>
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position={"relative"}
                top={"28px"}
                left={"10px"}
                width={"20px"}
                color={"gray.400"}
              >
                /r
              </Text>
              <Input
                position={"relative"}
                pl={23}
                size={"sm"}
                value={communityName}
                onChange={handleInputChange}
              />
              <Text
                fontSize={"9pt"}
                color={charactersRemaining === 0 ? "red" : "gray.500"}
              >
                {charactersRemaining} Characters remaining
              </Text>
              <Text fontSize={"9pt"} color={"red"} pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={700} fontSize={15}>
                  Community Type
                </Text>
              </Box>
              <Stack spacing={2}>
                {communityTypes.map(({ type, text, icon }) => (
                  <Checkbox
                    key={type}
                    name={type}
                    isChecked={communityType === type}
                    onChange={handleCommunityChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={icon} color={"gray.500"} mr={2} />
                      <Text fontSize={"10pt"} mr={1}>
                        {type}
                      </Text>
                      <Text fontSize={"8pt"} color={"gray.500"} pt={1}>
                        {text}
                      </Text>
                    </Flex>
                  </Checkbox>
                ))}
              </Stack>
            </ModalBody>
          </Box>

          <ModalFooter bg={"gray.100"} borderRadius={"0px 0px 10px 10px"}>
            <Button
              variant={"outline"}
              mr={3}
              onClick={handleClose}
              height={"30px"}
            >
              Close
            </Button>
            <Button
              height={"30px"}
              onClick={handleCreateCommunity}
              isLoading={communityLoading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;
