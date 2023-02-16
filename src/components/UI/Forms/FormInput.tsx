import { Input, InputProps } from "@chakra-ui/react";
import React from "react";

type FormInputProps = {
  name: string;
  placeholder: string;
  type: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mb?: number;
} & InputProps;

const FormInput: React.FC<FormInputProps> = ({
  name,
  placeholder,
  type,
  onChange,
  mb,
  ...props
}) => {
  return (
    <Input
      required
      onChange={onChange}
      mb={mb}
      fontSize="10pt"
      _placeholder={{ color: "gray.500" }}
      _hover={{
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      _focus={{
        boxShadow: "none",
        outline: "none",
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      bg="gray.50"
      name={name}
      placeholder={placeholder}
      type={type}
      {...props}
    />
  );
};
export default FormInput;
