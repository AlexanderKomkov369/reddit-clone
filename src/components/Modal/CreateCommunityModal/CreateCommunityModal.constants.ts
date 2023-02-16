import { IconType } from "react-icons";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

export enum CommunityType {
  Public = "Public",
  Restricted = "Restricted",
  Private = "Private",
}

export type CommunityTypeData = {
  type: CommunityType;
  text: string;
  icon: IconType;
};

export const communityTypes: CommunityTypeData[] = [
  {
    type: CommunityType.Public,
    text: "Anyone can view, post, and comment to this community",
    icon: BsFillPersonFill,
  },
  {
    type: CommunityType.Restricted,
    text: "Anyone can view this community, but only approved users can post",
    icon: BsFillEyeFill,
  },
  {
    type: CommunityType.Private,
    text: "Only approved users can view and submit to this community",
    icon: HiLockClosed,
  },
];
