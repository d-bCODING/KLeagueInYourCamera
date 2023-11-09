import { Reset } from "styled-reset";
import "./App.css";
import MainPage from "./pages/MainPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import MyInfo from "./pages/MyInfo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Posting from "./pages/Posting";
import PostDetail from "./pages/PostDetail";
import SignUpWithGoogle from "./pages/SignUpWithGoogle";
import Confirm from "./pages/Confirm";
import MyLikeList from "./pages/MyLikeList";
import SearchedList from "./pages/SearchedList";
import Edit from "./pages/Edit";
import CommentEdit from "./pages/CommentEdit";

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
          <Route path="/postdetail/:id" element={<PostDetail></PostDetail>} />
          <Route path="/postdetail/:id/edit" element={<Edit></Edit>} />
          <Route path="/postdetail/:id/commentedit" element={<CommentEdit></CommentEdit>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
