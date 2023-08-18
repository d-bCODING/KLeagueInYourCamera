import Header from "./part/Header";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";
import MainBoard from "./MainBoard";

function MainPage() {
  const isLogin = useRecoilValue(isLoginAtom);
  return (
    <>
      <Header></Header>
      <MainBoard></MainBoard>
    </>
  );
}

export default MainPage;
