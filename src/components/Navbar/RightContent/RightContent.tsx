import React from "react";
import AuthButtons from "@/src/components/Navbar/RightContent/AuthButtons";
import { Flex } from "@chakra-ui/react";
import AuthModal from "@/src/components/Modal/Auth/AuthModal";
import { User } from "@firebase/auth";
import { nulldefined } from "@/src/types/types";
import Icons from "@/src/components/Navbar/RightContent/Icons";
import UserMenu from "@/src/components/Navbar/RightContent/UserMenu";

type RightContentProps = {
  user: User | nulldefined;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};

export default RightContent;
