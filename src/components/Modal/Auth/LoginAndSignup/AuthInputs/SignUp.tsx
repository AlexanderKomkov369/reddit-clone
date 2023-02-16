import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import FormErrorMessage from "@/src/components/UI/Forms/FormErrorMessage";
import { ToggleView } from "@/src/types/types";
import FormInput from "@/src/components/UI/Forms/FormInput";
import { createUserDocument } from "@/src/firebase/helpers";

type SignupFormProps = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpProps = {
  toggleView: ToggleView;
};

const InputName: SignupFormProps = {
  email: "email",
  password: "password",
  confirmPassword: "confirmPassword",
} as const;

const SignUp: React.FC<SignUpProps> = ({ toggleView }) => {
  const [signUpForm, setSignUpForm] = useState<SignupFormProps>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formPasswordError, setFormPasswordError] = useState<string | null>(
    null
  );
  const [createUserWithEmailAndPassword, userCredentials, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (userCredentials) {
      createUserDocument(userCredentials.user);
    }
  }, [userCredentials]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormPasswordError(null);
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setFormPasswordError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSignUpForm(
      (prev): SignupFormProps => ({
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
      <FormInput
        name={InputName.confirmPassword}
        type="password"
        placeholder="Confirm password"
        mb={2}
        onChange={onChange}
      />
      <FormErrorMessage>
        {formPasswordError ??
          FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </FormErrorMessage>
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justify="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor="pointer"
          onClick={() => toggleView("login")}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};

export default SignUp;
