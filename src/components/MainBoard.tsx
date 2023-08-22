import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";

const MainBoard: React.FC<{ posts: Post[] | null }> = (props) => {
  // function MainBoard() {/
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Post[] | null>([]);
  //글쓰기 전 로그인 여부 확인
  const isLogin = useRecoilValue(isLoginAtom);
  const navigate = useNavigate();
  const canPosting = () => {
    if (isLogin) {
      navigate("/posting");
    } else {
      alert("로그인을 하셔야 글을 작성할 수 있습니다.");
    }
  };

  function getAllPost() {
    setResult(props.posts);
    setIsLoading(true);
  }

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <MaingBoardDiv>
      <div className="board-nav">
        <button className="all">전체 보기</button>
        <button className="video">영상관</button>
        <button className="community">커뮤니티</button>
        <button onClick={canPosting} className="posting">
          게시물 작성
        </button>
      </div>
      <div className="post-list-container">
        <div className="list-nav">
          <button className="all">모두 보기</button>
          <button className="my-team">내 팀 보기</button>
        </div>
        <ul className="post-list">
          {!isLoading && <span>isLoading</span>}
          {result &&
            result.map((el) =>
              el.videoURL === "" ? (
                <li key={el.time} className="writing post">
                  <div className="info">
                    <div className="title-time">
                      <span className="title">{el.title}</span>
                      <span className="time">{el.time}</span>
                    </div>
                    <p className="author">{el.nickName}</p>
                    <p className="description">{el.contents}</p>
                    <div className="communication">
                      <i className="heart">하트</i>
                      <i className="comment">댓글</i>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={el.time} className="video post">
                  <video muted controls src={el.videoURL}></video>
                  <div className="info">
                    <div className="title-time">
                      <span className="title">{el.title}</span>
                      <span className="time">{el.time}</span>
                    </div>
                    <p className="author">{el.nickName}</p>
                    <p className="description">{el.contents}</p>
                    <div className="communication">
                      <i className="heart">하트</i>
                      <i className="comment">댓글</i>
                    </div>
                  </div>
                </li>
              )
            )}
        </ul>
      </div>
    </MaingBoardDiv>
  );
};

export default MainBoard;

const MaingBoardDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  text-align: left;
  .board-nav {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 600px;
    button {
      margin-bottom: 20px;
      width: 280px;
      height: 50px;
      border-radius: 7px;
      border: none;
      font-size: 18px;
      font-weight: bold;
      transition: 500ms;
      cursor: pointer;
      &:hover {
        background-color: #0000cc;
      }
    }
    .posting {
      display: inline-block;
      width: 280px;
      height: 50px;
      border-radius: 7px;
      border: none;
      font-size: 18px;
      font-weight: bold;
      transition: 500ms;
      position: absolute;
      margin-bottom: 0;
      bottom: 0;
      left: 0;
      background-color: white;
      text-align: center;
      line-height: 50px;
      text-decoration: none;
      color: black;
      &:hover {
        background-color: #0000cc;
      }
    }
  }
  .post-list-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;

    .list-nav {
      position: absolute;
      top: -40px;
      button {
        width: 80px;
        height: 30px;
        background-color: white;
        border: none;
        border-radius: 7px;
        margin-right: 10px;
        cursor: pointer;
        font-weight: bold;
      }
    }
    .post-list {
      .post {
        background-color: #2c2c2c;
        border-radius: 7px;
        padding: 20px;
        box-sizing: border-box;
        margin-bottom: 40px;
        video {
          width: 100%;
          height: 400px;
          background-color: black;
          margin-bottom: 20px;
        }
        .info {
          color: white;
        }
        .title-time {
          display: flex;
          justify-content: space-between;
          .title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .time {
            font-size: 14px;
          }
        }
        .author {
          font-size: 14px;
          margin-bottom: 19px;
          padding-bottom: 20px;
          border-bottom: 1px solid white;
        }
        .description {
        }
        .communication {
          margin-top: 40px;
        }
      }
    }
  }
`;

type Post = {
  comment: string[];
  contents: string;
  like: number;
  likeUser: string[];
  nickName: string;
  team: string;
  title: string;
  videoURL: string;
  view: number;
  time: string;
  num?: number;
  pageNum?: number;
  postId?: number;
  docKey:string;
};