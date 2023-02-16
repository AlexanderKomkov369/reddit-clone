import React from "react";
import PageContent from "@/src/components/Layout/PageContent";
import { Box, Text } from "@chakra-ui/react";
import NewPostForm from "@/src/components/Posts/PostForm/NewPostForm/NewPostForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import useCommunityData from "@/src/hooks/useCommunityData";
import About from "@/src/components/Communities/About";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const {
    communityState: { currentCommunity },
  } = useCommunityData();

  return (
    <PageContent>
      <>
        <Box p={"14px 0px"} borderBottom={"1px solid"} borderColor={"white"}>
          <Text>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={currentCommunity?.imageURL}
          />
        )}
      </>
      <>{currentCommunity && <About community={currentCommunity} />}</>
    </PageContent>
  );
};

export default SubmitPostPage;
