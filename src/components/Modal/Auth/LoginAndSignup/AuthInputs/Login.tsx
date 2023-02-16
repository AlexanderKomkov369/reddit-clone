import React, { useState } from "react";
import { Button, Flex, FormErrorMessage, Text } from "@chakra-ui/react";
import { auth } from "@/src/firebase/clientApp";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { ToggleView } from "@/src/types/types";
import FormInput from "@/src/components/UI/Forms/FormInput";

type LoginFormProps = {
  email: string;
  password: string;
};

type LoginProps = {
  toggleView: ToggleView;
};

const InputName: LoginFormProps = {
  email: "email",
  password: "password",
} as const;

const Login: React.FC<LoginProps> = ({ toggleView }) => {
  const [loginForm, setLoginForm] = useState<LoginFormProps>({
    email: "",
    password: "",
  });
  const [signInWithEmailAndPassword, user, loading, authError] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginForm(
      (prev): LoginFormProps => ({
        ...prev,
        [event.target.name]: event.target.value,
      })
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        name={InputName.email}
        type="email"
        placeholder="Email"
        mb={2}
        onChange={onChange}
      />
      <FormInput
        name={InputName.password}
        type="password"
        placeholder="Password"
        mb={2}
        onChange={onChange}
      />
      <FormErrorMessage>
        {authError &&
          FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]}
      </FormErrorMessage>
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
        Log In
      </Button>
      <Flex justify="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          fontWeight={500}
          onClick={() => toggleView("resetPassword")}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justify="center">
        <Text mr={1}>New here?</Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor="pointer"
          onClick={() => toggleView("signup")}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
