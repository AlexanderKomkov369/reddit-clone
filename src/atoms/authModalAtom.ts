import { atom } from "recoil";

export interface AuthModalState {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
}

const AUTH_MODAL_KEY = "AUTH_MODAL_KEY";

const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
};

export const atomAuthModalState = atom<AuthModalState>({
  key: AUTH_MODAL_KEY,
  default: defaultModalState,
});
