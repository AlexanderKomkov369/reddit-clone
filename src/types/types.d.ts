import { AuthModalState } from "@/src/atoms/authModalAtom";

export type nulldefined = undefined | null;

export type ToggleView = (view: AuthModalState["view"]) => void;
