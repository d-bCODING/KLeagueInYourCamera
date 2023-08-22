import { atom } from "recoil";

export const isLoginAtom = atom({
  key: "isLogin",
  default: false,
});

export const searchKeywordAtom = atom({
  key: "searchKeyword",
  default: "",
});