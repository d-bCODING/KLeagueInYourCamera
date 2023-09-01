import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { getDocs, collection } from "firebase/firestore/lite";
import { db, auth } from "../firebase";
import { isLoginAtom } from "../atoms";
import { useSetRecoilState } from "recoil";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsLogin = useSetRecoilState(isLoginAtom);

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };
  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  type User = {
    email: string;
    password: string;
    team: string;
    nickName: string;
    docId: string;
    likeList : [],
  };

  let userList: User[] = [];

  //회원가입 되어 있는 유저 리스트 가져오는 함수 선언
  const setUserList = async () => {
    const users = await getDocs(collection(db, "account"));
    users.docs.map((doc) => {
      const docId = doc.id;
      const { email, password, team, nickName, likeList } = doc.data();
      if (Array.isArray(userList)) {
        userList.push({ email, password, team, nickName, docId, likeList });
      }
    });
  };

  const navigate = useNavigate();

  //로그인 과정
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(userList);
    

    //회원가입 되어 있는 유저 리스트 가져와서 배열에 담기
    await setUserList();

    //사용자가 입력한 이메일과 매칭되는 객체의 인덱스 번호 저장
    const matchIndex = userList.findIndex((obj) => obj.email === email);

    //매칭되는 이메일이 없다면
    if (matchIndex === -1) {
      alert("이메일 혹은 비밀번호를 확인해주세요");
      return false;
      //매칭되는 이메일이 있다면
    } else {
      //비밀번호 매칭 과정
      if (userList[matchIndex].password !== password) {
        alert("이메일 혹은 비밀번호를 확인해주세요");
        return false;
      } else {
        sessionStorage.setItem("user", JSON.stringify(userList[matchIndex]));
        setIsLogin(true);
        navigate("/");
      }
    }
  };

  //구글 로그인
  function handleGoogleLogin(e: React.FormEvent) {
    e.preventDefault();
    const provider = new GoogleAuthProvider(); // provider를 구글로 설정
    signInWithPopup(auth, provider) // popup을 이용한 signup
      .then(async (data) => {
        //회원가입 되어 있는 유저 리스트 가져와서 배열에 담기
        await setUserList();

        //사용자가 입력한 이메일과 매칭되는 객체의 인덱스 번호 저장
        const matchIndex = userList.findIndex(
          (obj) => obj.email === data.user.email
        );

        //매칭되는 이메일이 없다면
        if (matchIndex === -1) {
          navigate(`/signupgoogle`, { state: data.user.email });
          //매칭되는 이메일이 있다면
        } else {
          sessionStorage.setItem("user", JSON.stringify(userList[matchIndex]));
          setIsLogin(true);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <LoginDiv>
      <Link to={"/"} className="main-Logo">
        <img src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/mainLogo.png?raw=true" alt="메인페이지로 이동" />
      </Link>
      <form action="" className="login-form">
        <div className="user-input">
          <input
            type="text"
            className="email"
            placeholder="이메일을 입력해주세요"
            onChange={emailHandler}
          />
          <input
            type="password"
            className="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={passwordHandler}
          />
          <a href="" className="find-password">
            비밀번호 찾기
          </a>
        </div>
        <button className="login" onClick={submitHandler}>
          로그인
        </button>
        <button className="login-google" onClick={handleGoogleLogin}>
          <span>구글 로그인</span>
          <img src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/googleLogo.png?raw=true" alt="구글 로고" />
        </button>
      </form>
      <Link to={"/signup"} className="siguUp-link">
        회원가입
      </Link>
    </LoginDiv>
  );
}

export default Login;

const LoginDiv = styled.div`
  padding-top: 120px;
  .main-Logo {
    display: inline-block;
    width: 400px;
    img {
      width: 100%;
    }
    margin-bottom: 80px;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .user-input {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-bottom: 80px;
      input {
        width: 400px;
        height: 50px;
        padding-left: 10px;
        border-radius: 7px;
        border: none;
        box-sizing: border-box;
        margin-bottom: 20px;
        &:focus {
          outline: none;
        }
      }
      .find-password {
        position: absolute;
        right: 0;
        bottom: -10px;
        color: gray;
      }
    }
    button {
      width: 400px;
      height: 50px;
      border: none;
      border-radius: 10px;
      margin-bottom: 20px;
      color: white;
      background-color: #1e61e2;
      font-size: 18px;
      cursor: pointer;
    }
    .login-google {
      position: relative;
      background-color: #1919ff;
      img {
        position: absolute;
        width: 24px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .siguUp-link {
    color: gray;
  }
`;
