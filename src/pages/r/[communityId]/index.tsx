import React, { useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { doc, getDoc } from "@firebase/firestore";
import { firestore } from "@/src/firebase/clientApp";
import { atomCommunityState, Community } from "@/src/atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import { nulldefined } from "@/src/types/types";
import NotFound from "@/src/components/Communities/NotFound";
import Header from "@/src/components/Communities/Header";
import PageContent from "@/src/components/Layout/PageContent";
import CreatePostLink from "@/src/components/Communities/CreatePostLink";
import Posts from "@/src/components/Posts/Posts";
import { useSetRecoilState } from "recoil";
import About from "@/src/components/Communities/About";

export type CommunityPageProps = {
  communityData: Community | nulldefined;
};

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(atomCommunityState);

  useEffect(() => {
    if (communityData) {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: communityData,
      }));
    }
  }, [communityData]);

  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header community={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About community={communityData} />
        </>
      </PageContent>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  CommunityPageProps
> = async (context: GetServerSidePropsContext) => {
  const communityDocRef = doc(
    firestore,
    "communities",
    context.query.communityId as string
  );
  const communityDoc = await getDoc(communityDocRef);

  try {
    return {
      props: {
        communityData:
          communityDoc.exists() &&
          JSON.parse(
            safeJsonStringify({
              id: communityDoc.id,
              ...communityDoc.data(),
            })
          ),
      } as CommunityPageProps,
    };
  } catch (error) {
    console.log("Get server side props error: ", error);
    return {
      props: {
        communityData: null,
      },
    };
  }
};

export default CommunityPage;
