import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atomDirectoryMenuState,
  DirectoryMenuItem,
} from "@/src/atoms/directoryMenuItem";
import { useRouter } from "next/router";
import { atomCommunityState } from "@/src/atoms/communitiesAtom";
import { FaReddit } from "react-icons/fa";

const useDirectory = () => {
  const router = useRouter();
  const [directoryMenuState, setDirectoryMenuState] = useRecoilState(
    atomDirectoryMenuState
  );
  const { currentCommunity } = useRecoilValue(atomCommunityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryMenuState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router.push(menuItem.link);
    if (directoryMenuState.isOpen) toggleMenuOpen();
  };

  const toggleMenuOpen = () =>
    setDirectoryMenuState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));

  useEffect(() => {
    if (!router.query.communityId) return;

    if (currentCommunity) {
      setDirectoryMenuState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `/r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: FaReddit,
          iconColor: "blue.500",
        } as DirectoryMenuItem,
      }));
    }
  }, [currentCommunity, router.query]);

  return {
    directoryMenuState,
    toggleMenuOpen,
    onSelectMenuItem,
  };
};

export default useDirectory;
