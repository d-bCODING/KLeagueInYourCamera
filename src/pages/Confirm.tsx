import React, { useState } from "react";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { doc, deleteDoc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";
import { useSetRecoilState } from "recoil";
import { isLoginAtom } from "../atoms";

function Confirm() {
  const { docId: userId } = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );
  const [password, setPassword] = useState("");
  const setIsLogin = useSetRecoilState(isLoginAtom);

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const navigate = useNavigate();
  const deleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    //로그인 되어 있는 유저의 비밀번호를 가져온 후
    const userIdRef = doc(db, "account", `${userId}`);
    const userDoc = await getDoc(userIdRef);
    const userData = userDoc.data();
    const userPassword = userData?.password;
    //사용자가 입력한 비밀번호와 일치하는지 확인 후
    if (password === userPassword) {
      if (confirm("정말 탈퇴하시겠습니까?")) {
        await deleteDoc(doc(db, "account", `${userId}`));
        sessionStorage.removeItem("user");
        setIsLogin(false);
        navigate("/");
      }
    } else {
      alert("패스워드 오류");
    }
  };
  return (
    <MyInfoDiv>
      <Link to={"/"} className="main-Logo">
        <img src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/mainLogo.png?raw=true" alt="메인페이지로 이동" />
      </Link>
      <form action="" className="delete-form">
        <ul className="input-list">
          <li className="password-form">
            <span>비밀번호</span>
            <input
              type="password"
              className="password"
              placeholder="비밀번호를 입력해주세요"
              onChange={passwordHandler}
            />
          </li>
        </ul>
        <button className="submit" onClick={deleteAccount}>
          회원탈퇴
        </button>
      </form>
    </MyInfoDiv>
  );
}

export default Confirm;

const MyInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .main-Logo {
    display: inline-block;
    width: 300px;
    padding-top: 40px;
    margin-bottom: 200px;
    img {
      width: 100%;
    }
  }
  .delete-form{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 300px;
  }
  .input-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-bottom: 100px;
    li {
      width: 400px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 18px;
        position: relative;
      }
      input {
        width: 300px;
        height: 40px;
        padding-left: 10px;
        border-radius: 7px;
        border: none;
        box-sizing: border-box;
        &:focus {
          outline: none;
        }
      }
    }
  }
  .submit {
    width: 400px;
    height: 46px;
    border-radius: 10px;
    background-color: #1e61e2;
    color: white;
    font-size: 18px;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
  }
`;
