import { styled } from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";

function MyInfo() {
  //세션에 저장된 로그인한 유저의 정보중 team, nickName 정보 가져옴
  const { team: userTeam, nickName: userNickName } = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [team, setTeam] = useState("");

  const nickNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNickName(e.target.value);
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

  //회원가입 과정
  const signUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // //유효성 검사 통과 여부
    // const check = await submitConfirm();
    // if (!check) {
    //     return false;
    // }

    // //회원 정보에 추가
    // await addDoc(collection(db, "account"), newUser);
    // alert("회원가입 완료");
    // navigation("/login");
  };

  return (
    <MyInfoDiv>
      <Link to={"/"} className="main-Logo">
        <img src="/src/assets/mainLogo.png" alt="메인페이지로 이동" />
      </Link>
      <div className="show-user">
        <img src={`/src/assets/teamLogo/${userTeam}.png`} alt="인천" />
        <span>{userNickName}님 정보 수정</span>
      </div>
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
              <option value="none">팀선택</option>
              <option value="ulsan">울산</option>
              <option value="jeonbuk">전북</option>
              <option value="pohang">포항</option>
              <option value="incheon">인천</option>
              <option value="jeju">제주</option>
              <option value="gangwon">강원</option>
              <option value="suwonFC">수원FC</option>
              <option value="daegu">대구</option>
              <option value="seoul">FC서울</option>
              <option value="gwangju">광주</option>
              <option value="daejeon">대전</option>
            </select>
          </li>
        </ul>
        <button className="submit" onClick={signUpSubmit}>
          회원정보 수정
        </button>
      </form>
    </MyInfoDiv>
  );
}

export default MyInfo;

const MyInfoDiv = styled.div`
  .main-Logo {
    display: inline-block;
    width: 220px;
    padding-top: 40px;
    margin-bottom: 40px;
    img {
      width: 100%;
    }
  }
  .show-user {
    width: 500px;
    margin: 0 auto;
    padding: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #dadada;
    border-radius: 10px;
    color: black;
    margin-bottom: 100px;
    img {
      width: 80px;
    }
    span {
      font-size: 18px;
      font-weight: bold;
    }
  }
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
