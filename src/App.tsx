import { Reset } from "styled-reset";
import "./App.css";
import MainPage from "./components/MainPage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MyPage from "./components/MyPage";
import MyInfo from "./components/MyInfo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Posting from "./components/Posting";
import PostDetail from "./components/PostDetail";
import SignUpWithGoogle from "./components/SignUpWithGoogle";
import Confirm from "./components/Confirm";
import MyLikeList from "./components/MyLikeList";
import SearchedList from "./components/SearchedList";
import Edit from "./components/Edit";

function App() {
  return (
    <>
      <Reset></Reset>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage></MainPage>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/signupgoogle" element={<SignUpWithGoogle></SignUpWithGoogle>}></Route>
          <Route path="/mypage" element={<MyPage></MyPage>}></Route>
          <Route path="/searchlist" element={<SearchedList></SearchedList>}></Route>
          <Route path="/myinfo" element={<MyInfo></MyInfo>}></Route>
          <Route path="/mylikelist" element={<MyLikeList></MyLikeList>}></Route>
          <Route path="/confirm" element={<Confirm></Confirm>}></Route>
          <Route path="/posting" element={<Posting></Posting>}></Route>
          <Route path="/postdetail/:id" element={<PostDetail />} />
          <Route path="/postdetail/:id/edit" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
