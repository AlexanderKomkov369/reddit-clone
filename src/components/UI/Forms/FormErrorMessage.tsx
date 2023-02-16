import React from "react";
import { Text, TextProps } from "@chakra-ui/react";

type FormErrorMessageProps = {
  children?: string;
} & TextProps;

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ children }) => {
  return (
    <Text color="red" align="center" fontSize="10pt">
      {children}
    </Text>
  );
};

export default FormErrorMessage;
