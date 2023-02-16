import React from "react";
import { Icon } from "@chakra-ui/icons";
import { Flex, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

type NavbarIconProps = {
  icon: IconType;
  iconSize?: number;
} & FlexProps;

const NavbarIcon: React.FC<NavbarIconProps> = ({
  icon,
  iconSize,
  ...props
}) => {
  const iconFontSize = iconSize ?? 20;

  return (
    <Flex
      ml={1.5}
      mr={1.5}
      padding={1}
      borderRadius={4}
      cursor="pointer"
      _hover={{ bg: "gray.200" }}
      {...props}
    >
      <Icon as={icon} fontSize={iconFontSize} />
    </Flex>
  );
};

export default NavbarIcon;
