import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { atomAuthModalState, AuthModalState } from "@/src/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import LoginAndSignup from "@/src/components/Modal/Auth/LoginAndSignup/LoginAndSignup";
import ResetPassword from "@/src/components/Modal/Auth/ResetPassword/ResetPassword";

const AuthModal = () => {
  const [modalState, setModalState] = useRecoilState(atomAuthModalState);
  const [user] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const toggleView = (view: AuthModalState["view"]) => {
    setModalState((prev) => ({
      ...prev,
      view,
    }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              width="70%"
            >
              {modalState.view === "login" || modalState.view === "signup" ? (
                <LoginAndSignup toggleView={toggleView} />
              ) : (
                <ResetPassword toggleView={toggleView} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
