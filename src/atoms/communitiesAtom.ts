import { CommunityType } from "@/src/components/Modal/CreateCommunityModal/CreateCommunityModal.constants";
import { Timestamp } from "@firebase/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: CommunityType;
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId?: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  snippetsFetched: boolean;
}

const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
};

export const atomCommunityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
