import { IconType } from "react-icons";

export type TypeItemTitle = "Post" | "Images & Video";

export enum TextInputsName {
  Title = "title",
  Body = "body",
}

export type TextInputsState = {
  [TextInputsName.Title]: string;
  [TextInputsName.Body]: string;
};

export type TypeItem = {
  title: TypeItemTitle;
  icon: IconType;
};
