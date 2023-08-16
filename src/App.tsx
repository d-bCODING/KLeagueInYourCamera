import { Reset } from "styled-reset";
import "./App.css";
import MainPage from "./components/MainPage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MyPage from "./components/MyPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Reset></Reset>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage></MainPage>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/mypage" element={<MyPage></MyPage>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
