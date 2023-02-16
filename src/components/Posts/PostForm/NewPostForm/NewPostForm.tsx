import React, { useState } from "react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { Alert, AlertIcon, AlertTitle, Flex } from "@chakra-ui/react";
import TabItem from "@/src/components/Posts/PostForm/NewPostForm/TabItem/TabItem";
import TextInputs from "@/src/components/Posts/PostForm/TextInputs";
import ImageUpload from "@/src/components/Posts/PostForm/ImageUpload";
import {
  TextInputsName,
  TextInputsState,
  TypeItem,
  TypeItemTitle,
} from "./NewPostForm.types";
import { User } from "@firebase/auth";
import { useRouter } from "next/router";
import { Post } from "@/src/atoms/postsAtom";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "@firebase/firestore";
import { firestore, storage } from "@/src/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";

const formTabs: TypeItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
];

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TypeItemTitle>("Post");
  const [textInputs, setTextInputs] = useState<TextInputsState>({
    title: "",
    body: "",
  });
  // const [selectedFile, setSelectedFile] = useState<string>();
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCreatePost = async () => {
    const { communityId } = router.query;

    const newPost: Post = {
      communityId: communityId as string,
      communityImageUrl: communityImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    setLoading(true);
    try {
      setError(false);

      // store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      // check for selectedFile
      if (selectedFile) {
        // store in storage => get downloadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadUrl = await getDownloadURL(imageRef);

        // update post doc
        await updateDoc(postDocRef, {
          imageURL: downloadUrl,
        });
      }

      router.back();
    } catch (error) {
      setError(true);
      if (error instanceof Error) {
        console.log("handleCreatePost error: ", error);
      }
    }
    setLoading(false);
  };

  // const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const reader = new FileReader();
  //
  //   if (event.target.files?.[0]) {
  //     reader.readAsDataURL(event.target.files?.[0]);
  //   }
  //
  //   reader.onload = (readerEvent) => {
  //     if (readerEvent.target?.result) {
  //       setSelectedFile(readerEvent.target?.result as string);
  //     }
  //   };
  // };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTextInputs(
      (prev): TextInputsState => ({
        ...prev,
        [name as TextInputsName]: value,
      })
    );
  };

  return (
    <Flex direction={"column"} bg={"white"} borderRadius={4} mt={2}>
      <Flex width={"100%"}>
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            tabItem={item}
            tabSelected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error creating post</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
