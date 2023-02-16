import { Timestamp } from "@firebase/firestore";
import { atom } from "recoil";

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  createdAt: Timestamp;
  imageURL?: string;
  communityImageUrl?: string;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
}

export type PostVote = {
  id: string;
  communityId: string;
  postId: string;
  voteStatus: 1 | -1;
};

const defaultPostState: PostState = {
  posts: [],
  selectedPost: null,
  postVotes: [],
};

export const atomPostState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});
