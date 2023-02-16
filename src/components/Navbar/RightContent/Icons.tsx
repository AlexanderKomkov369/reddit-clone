import React from "react";
import { Flex } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { GrAdd } from "react-icons/gr";
import NavbarIcon from "@/src/components/UI/Icons/NavbarIcon";

const Icons: React.FC = () => {
  return (
    <Flex>
      <Flex
        display={{ base: "none", md: "flex" }}
        align="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <NavbarIcon icon={BsArrowUpRightCircle} />
        <NavbarIcon icon={IoFilterCircleOutline} iconSize={22} />
        <NavbarIcon icon={IoVideocamOutline} iconSize={22} />
      </Flex>
      <>
        <NavbarIcon icon={BsChatDots} />
        <NavbarIcon icon={IoNotificationsOutline} iconSize={20} />
        <NavbarIcon
          icon={GrAdd}
          iconSize={20}
          display={{ base: "none", md: "flex" }}
        />
      </>
    </Flex>
  );
};

export default Icons;
