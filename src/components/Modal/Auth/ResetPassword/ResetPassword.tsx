import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { BsDot, BsReddit } from "react-icons/bs";
import { ToggleView } from "@/src/types/types";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import FormInput from "@/src/components/UI/Forms/FormInput";

type ResetPasswordProps = {
  toggleView: ToggleView;
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ toggleView }) => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [sendAttempt, setSendAttempt] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");

    await sendPasswordResetEmail(email);
    setSendAttempt(true);
    setSendAttempt(false);
  };

  useEffect(() => {
    if (sendAttempt && !error) {
      setSuccess(true);
    }
  }, [error, sendAttempt]);

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Enter the email associated with your account and we&apos;ll send you
            a reset link
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <FormInput
              name="email"
              placeholder="Email"
              type="email"
              mb={2}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Text textAlign="center" fontSize="10pt" color="red">
              {formError || (error && "A user with that email does not exist")}
            </Text>
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type={"submit"}
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        cursor="pointer"
        color="blue.500"
        fontWeight={700}
      >
        <Text onClick={() => toggleView("login")}>LOGIN</Text>
        <Icon as={BsDot} />
        <Text onClick={() => toggleView("signup")}>SIGN IN</Text>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
