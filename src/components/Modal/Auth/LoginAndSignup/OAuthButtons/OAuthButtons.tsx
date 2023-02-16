import React, { useEffect } from "react";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { createUserDocumentOAuth } from "@/src/firebase/helpers";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCredentials, loading, error] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (userCredentials) {
      createUserDocumentOAuth(userCredentials.user);
    }
  }, [userCredentials]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src={"/images/googlelogo.png"} width={18} mr={4} />
        Continue with Google
      </Button>
      <Text>{error && error.message}</Text>
    </Flex>
  );
};

export default OAuthButtons;
