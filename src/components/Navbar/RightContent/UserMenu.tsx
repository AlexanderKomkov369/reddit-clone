import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ChevronDownIcon, Icon } from "@chakra-ui/icons";
import { nulldefined } from "@/src/types/types";
import { signOut, User } from "@firebase/auth";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "@/src/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { atomAuthModalState } from "@/src/atoms/authModalAtom";
import { IoSparkles } from "react-icons/io5";

type UserMenuProps = {
  user: User | nulldefined;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(atomAuthModalState);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon
                  fontSize={24}
                  mr={1}
                  color="gray.300"
                  as={FaRedditSquare}
                />
                <Flex
                  display={{ base: "none", lg: "flex" }}
                  direction="column"
                  fontSize="8pt"
                  align="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user.email?.split("@")[0]}
                  </Text>
                  <Flex>
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">0 karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: "blue.500",
                color: "white",
              }}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={CgProfile} />
              </Flex>
              Profile
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: "blue.500",
                color: "white",
              }}
              onClick={logout}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
              </Flex>
              Log Out
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: "blue.500",
                color: "white",
              }}
              onClick={() => setAuthModalState({ open: true, view: "login" })}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
              </Flex>
              Log In / Sign Up
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
