import { User } from "@firebase/auth";
import { addDoc, collection, doc, setDoc } from "@firebase/firestore";
import { firestore } from "@/src/firebase/clientApp";

export const createUserDocument = async (user: User) => {
  await addDoc(
    collection(firestore, "users"),
    JSON.parse(JSON.stringify(user))
  );
};

export const createUserDocumentOAuth = async (user: User) => {
  const docRef = doc(firestore, "users", user.uid);
  await setDoc(docRef, JSON.parse(JSON.stringify(docRef)));
};
