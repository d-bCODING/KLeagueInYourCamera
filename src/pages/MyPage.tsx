import { Link } from "react-router-dom";
import { styled } from "styled-components";

function MyPage() {
  //세션에 저장된 로그인한 유저의 정보중 team, nickName 정보 가져옴
  const { team, nickName } = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  return (
    <MyPageDiv>
      <Link to={"/"} className="main-Logo">
        <img
          src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/mainLogo.png?raw=true"
          alt="메인페이지로 이동"
        />
      </Link>
      <div className="show-user">
        {team ? (
          <img
            src={`https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/teamLogo/${team}.png?raw=true`}
            alt="유저 팀 로고"
          />
        ) : (
          <img
            src={`https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/teamLogo/none.png?raw=true`}
            alt="유저 팀 로고"
          />
        )}
        <span>{nickName}님 마이페이지</span>
      </div>
      <ul className="menu-list">
        <li className="user-info">
          <Link to={"/myinfo"}>회원정보 수정</Link>
        </li>
        <li className="like-post">
          <Link to={"/mylikelist"}>좋아요 게시물 보기</Link>
        </li>
        <li className="delete-info">
          <Link to={"/confirm"}>탈퇴하기</Link>
        </li>
      </ul>
    </MyPageDiv>
  );
}

export default MyPage;

const MyPageDiv = styled.div`
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
  .menu-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px;
    li {
      width: 400px;
      height: 60px;
      background-color: white;
      border-radius: 10px;
      line-height: 60px;
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: black;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
`;
