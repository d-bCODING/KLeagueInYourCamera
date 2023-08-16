import React from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { useRecoilState } from "recoil";
import { isLoginAtom } from "../../atoms";

const Header: React.FC<{ isLogin: Boolean }> = (props) => {
  // const user = JSON.parse(sessionStorage.getItem("user") || "null");/
  const [ isLogin, setIsLogin ] = useRecoilState(isLoginAtom);

  //로그아웃과정, Recoil값 false로 바꿔주고, session에 저장된 값 삭제
  const logOutHandler = () => {
    sessionStorage.removeItem("user");
    setIsLogin(false);
  }

  return (
    <HeaderDiv>
      <header>
        <Link to={"/"} className="main-Logo">
          <img src="/src/assets/mainLogo.png" alt="메인페이지로 이동" />
        </Link>
        <input type="text" className="search" placeholder="검색" />
        {!props.isLogin ? (
          <div className="user-nav">
            <Link to={"/login"}>로그인</Link>
            <Link to={"/signup"}>회원가입</Link>
          </div>
        ) : (
          <div className="user-nav">
            <Link to={"/"} onClick={logOutHandler}>로그아웃</Link>
            <Link to={"/mypage"}>마이페이지</Link>
          </div>
        )}
      </header>
    </HeaderDiv>
  );
};

export default Header;

const HeaderDiv = styled.div`
  padding-top: 40px;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .main-Logo {
    display: inline-block;
    width: 200px;
    img {
      width: 100%;
    }
  }
  .search {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 10px;
    font-size: 18px;
    border: none;
    &:focus {
      outline: none;
    }
  }
  .user-nav{
    display: flex;
    width: 240px;
    height: 40px;
    a{
      width: 50%;
      height: 100%;
      line-height: 40px;
      color: white;
      text-decoration: none;
      border-radius: 7px;
      transition: 300ms;
      &:hover{
        background-color: white;
        color: black;
      }
      &:first-child{
        position: relative;
        &::after{
          content: "";
          position: absolute;
          width: 1px;
          height: 16px;
          background-color: #ffffff;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
`;
