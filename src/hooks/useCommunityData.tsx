import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  atomCommunityState,
  Community,
  CommunitySnippet,
} from "@/src/atoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "@firebase/firestore";
import { atomAuthModalState } from "@/src/atoms/authModalAtom";
import { useRouter } from "next/router";

const useCommunityData = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [communityState, setCommunityState] =
    useRecoilState(atomCommunityState);
  const setAuthModalState = useSetRecoilState(atomAuthModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinOrLeaveCommunity = (community: Community, joined: boolean) => {
    if (!user) {
      setAuthModalState({ view: "login", open: true });
      return;
    }

    setLoading(true);
    if (joined) {
      leaveCommunity(community.id);
      return;
    }

    joinCommunity(community);
  };

  const joinCommunity = async (community: Community) => {
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: community.id,
        imageURL: community.imageURL || "",
        isModerator: community.creatorId === user?.uid,
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, community.id),
        newSnippet
      );

      batch.update<Community | DocumentData>(
        doc(firestore, "communities", community.id),
        {
          numberOfMembers: increment(1),
        }
      );

      await batch.commit();

      setCommunityState((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: unknown) {
      console.log("joinCommunity error: ", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update<Community | DocumentData>(
        doc(firestore, "communities", communityId),
        {
          numberOfMembers: increment(-1),
        }
      );

      await batch.commit();

      setCommunityState((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }));
    } catch (error: unknown) {
      console.log("joinCommunity error: ", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetsDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets: CommunitySnippet[] = snippetsDocs.docs.map((doc) => ({
        ...doc.data(),
      }));
      setCommunityState((prev) => ({
        ...prev,
        mySnippets: snippets,
        snippetsFetched: true,
      }));

      console.log("here is my snippets: ", snippets);
    } catch (error) {
      console.log("getMySnippets error: ", error);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);
      setCommunityState((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error) {
      console.error("getCommunityData error: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityState((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityState.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityState.currentCommunity]);

  return {
    communityState,
    joinOrLeaveCommunity,
    loading,
  };
};

export default useCommunityData;
