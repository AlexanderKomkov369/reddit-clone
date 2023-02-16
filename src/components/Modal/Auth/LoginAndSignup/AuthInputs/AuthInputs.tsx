import React from "react";
import { Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { atomAuthModalState } from "@/src/atoms/authModalAtom";
import Login from "@/src/components/Modal/Auth/LoginAndSignup/AuthInputs/Login";
import SignUp from "@/src/components/Modal/Auth/LoginAndSignup/AuthInputs/SignUp";
import { ToggleView } from "@/src/types/types";

type AuthInputsProps = {
  toggleView: ToggleView;
};

const AuthInputs: React.FC<AuthInputsProps> = ({ toggleView }) => {
  const { view } = useRecoilValue(atomAuthModalState);

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {view === "login" && <Login toggleView={toggleView} />}
      {view === "signup" && <SignUp toggleView={toggleView} />}
    </Flex>
  );
};

export default AuthInputs;
