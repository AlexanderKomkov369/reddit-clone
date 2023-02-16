import React, { Dispatch, SetStateAction } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import {
  TypeItem,
  TypeItemTitle,
} from "@/src/components/Posts/PostForm/NewPostForm/NewPostForm.types";

type TabItemProps = {
  tabItem: TypeItem;
  tabSelected: boolean;
  setSelectedTab: Dispatch<SetStateAction<TypeItemTitle>>;
};

const TabItem: React.FC<TabItemProps> = ({
  tabItem,
  tabSelected,
  setSelectedTab,
}) => {
  return (
    <Flex
      justify={"center"}
      align={"center"}
      flexGrow={1}
      p={"14px 0px"}
      fontWeight={700}
      cursor={"pointer"}
      color={tabSelected ? "blue.500" : "gray.500"}
      borderWidth={tabSelected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={tabSelected ? "blue.500" : "gray.200"}
      borderRightColor={"gray.200"}
      _hover={{ bg: "gray.50" }}
      onClick={() => setSelectedTab(tabItem.title)}
    >
      <Flex align={"center"} mr={2}>
        <Icon as={tabItem.icon} />
      </Flex>
      <Text fontSize={"10pt"}>{tabItem.title}</Text>
    </Flex>
  );
};

export default TabItem;
