import React from "react";
import OAuthButtons from "@/src/components/Modal/Auth/LoginAndSignup/OAuthButtons/OAuthButtons";
import { Text } from "@chakra-ui/react";
import AuthInputs from "@/src/components/Modal/Auth/LoginAndSignup/AuthInputs/AuthInputs";
import { ToggleView } from "@/src/types/types";

type LoginAndSignupProps = {
  toggleView: ToggleView;
};

const LoginAndSignup: React.FC<LoginAndSignupProps> = ({ toggleView }) => {
  return (
    <>
      <OAuthButtons />
      <Text color="gray.500" fontWeight={700}>
        OR
      </Text>
      <AuthInputs toggleView={toggleView} />
    </>
  );
};

export default LoginAndSignup;
