import React from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "@firebase/auth";
import { nulldefined } from "@/src/types/types";

type SearchInputProps = {
  user: User | nulldefined;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  return (
    <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" mb={1} />
        </InputLeftElement>
        <Input
          placeholder="Search Reddit"
          fontSize="10pt"
          height="34px"
          bg="gray.50"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            boxShadow: "none",
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
