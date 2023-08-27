import React, { useState } from "react";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore/lite";

function SignUp() {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [team, setTeam] = useState("");

  const nickNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNickName(e.target.value);
  };
  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };
  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const rePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRePassword(e.target.value);
  };
  const teamHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setTeam(e.target.value);
  };

  //유효성 검사
  const submitConfirm = async () => {
    //닉네임 기입 여부
    if (nickName.length === 0) {
      alert("닉네임을 입력해주세요");
      return false;
    }

    //닉네임 중복 여부
    type User = {
      nickName: string;
      email: string;
    };

    let userList: User[] = [];

    //회원가입 되어 있는 계정들의 닉네임과 이메일 가져오기
    const users = await getDocs(collection(db, "account"));
    users.docs.map((doc) => {
      const { nickName, email } = doc.data();
      if (Array.isArray(userList)) {
        userList.push({ nickName, email });
      }
    });

    //중복된 닉네임이 있다면 isNickName에 true 저장
    const isNickName = userList.some(el => el.nickName === nickName);

    if (isNickName) {
      alert("중복된 닉네임입니다. 다른 닉네임을 사용해주세요");
      return false;
    }

    //이메일 기입 여부
    if (email.length === 0) {
      alert("이메일을 입력해주세요");
      return false;
    }

    //이메일 형식 검사
    if (email.indexOf("@") === -1 || email.indexOf(".com") === -1) {
      alert("이메일 형식을 확인해주세요");
      return false;
    }

    //이메일 공백 검사
    if (email.length !== email.replace(" ", "").length) {
      alert("이메일의 공백을 확인해주세요");
      return false;
    }

    //이메일 중복 여부
    const isEmail = userList.some(el => el.email === email);
    if (isEmail) {
        alert("중복된 이메일입니다. 다른 이메일을 사용해주세요.")
        return false;
    }

    //비밀번호 기입 여부
    if (password.length === 0) {
      alert("비밀번호를 입력해주세요");
      return false;
    }

    //비밀번호 재입력 기입 여부
    if (rePassword.length === 0) {
      alert("비밀번호를 재입력해주세요");
      return false;
    }

    //비밀번호 재입력 검사
    if (password !== rePassword) {
      alert("재입력한 비밀번호를 확인해주세요");
      return false;
    }

    return true;
  };

  //회원가입 될 유저 정보
  let newUser = {
    email: email,
    imagae: "url",
    nickName: nickName,
    password: password,
    team: team,
  };

  const navigation = useNavigate();

  //회원가입 과정
  const signUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //유효성 검사 통과 여부
    const check = await submitConfirm();
    if (!check) {
        return false;
    }

    //회원 정보에 추가
    await addDoc(collection(db, "account"), newUser);
    alert("회원가입 완료");
    navigation("/login");
  };

  return (
    <SignUpDiv className="inner">
      <Link to={"/"} className="main-Logo">
        <img src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/mainLogo.png?raw=true" alt="메인페이지로 이동" />
      </Link>
      <form action="" className="signUp-form">
        <ul className="input-list">
          <li className="nickName-form">
            <span>닉네임</span>
            <input
              type="text"
              className="nickName"
              placeholder="닉네임을 입력해주세요"
              onChange={nickNameHandler}
            />
          </li>
          <li className="email-form">
            <span>이메일</span>
            <input
              type="text"
              className="email"
              placeholder="이메일을 입력해주세요"
              onChange={emailHandler}
            />
          </li>
          <li className="password-form">
            <span>비밀번호</span>
            <input
              type="password"
              className="password"
              placeholder="비밀번호를 입력해주세요"
              onChange={passwordHandler}
            />
          </li>
          <li className="rePassword-form">
            <span></span>
            <input
              type="password"
              className="rePassword"
              placeholder="비밀번호를 재입력해주세요"
              onChange={rePasswordHandler}
            />
          </li>
          <li className="selectTeam-form">
            <span>팀 선택</span>
            <select name="" id="" onChange={teamHandler}>
              <option selected value="none">팀선택</option>
              <option value="ulsan">울산</option>
              <option value="jeonbuk">전북</option>
              <option value="pohang">포항</option>
              <option value="incheon">인천</option>
              <option value="jeju">제주</option>
              <option value="gangwon">강원</option>
              <option value="suwonFC">수원FC</option>
              <option value="daegu">대구</option>
              <option value="seoul">FC서울</option>
              <option value="suwon">수원삼성</option>
              <option value="gwangju">광주</option>
              <option value="daejeon">대전</option>
            </select>
          </li>
        </ul>
        <button className="submit" onClick={signUpSubmit}>
          회원가입
        </button>
      </form>
    </SignUpDiv>
  );
}

export default SignUp;

const SignUpDiv = styled.div`
  padding-top: 120px;
  .main-Logo {
    display: inline-block;
    width: 400px;
    img {
      width: 100%;
    }
    margin-bottom: 50px;
  }
  .signUp-form {
    display: flex;
    flex-direction: column;
    align-items: center;
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
          &::after {
            content: "";
            position: absolute;
            top: -5px;
            right: -5px;
            width: 4px;
            height: 4px;
            background-color: red;
            border-radius: 100%;
          }
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
      .selectTeam-form {
        select {
          padding-left: 10px;
          width: 300px;
          height: 40px;
          border-radius: 7px;
          border: none;
          box-sizing: border-box;
          &:focus {
            outline: none;
          }
        }
      }
      .rePassword-form,
      .selectTeam-form {
        span {
          &::after {
            display: none;
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
  }
`;
