import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";

const MainBoard: React.FC<{ posts: Post[] | null }> = (props) => {
  // function MainBoard() {/
  const [isLoading, setIsLoading] = useState(false);
  //result = 메인 피드에 보일 게시물들
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

  //※이중 필터가 영 쉽지 않다. Atom으로 구현해봐야하나?
  let onlyMyTeam = false;
  let contentsCondition = "all";
  //게시물 가져오는 방식 설정에 따라 게시물 맞춤 렌더링
  function getPost() {
    // console.log("내 팀만 보기", onlyMyTeam);
    // console.log("게시물 종류",contentsCondition);
    
    //모든 팀 보기 및 전체 보기
    if (onlyMyTeam === false && contentsCondition === "all") {
      setResult(props.posts);
      //모든 팀 보기 및 영상, 사진관
    } else if (onlyMyTeam === false && contentsCondition === "isUrl") {
      let urlPost: Post[] = [];
      props.posts?.find((el) => {
        if (el.fileURL !== "none") {
          urlPost = [...urlPost, el];
        }
      });
      setResult(urlPost);
      //모든 팀 보기 및 커뮤니티
    } else if (onlyMyTeam === false && contentsCondition === "noUrl") {
      let writingPost: Post[] = [];
      props.posts?.find((el) => {
        if (el.fileURL === "none") {
          writingPost = [...writingPost, el];
        }
      });
      setResult(writingPost);
      //내 팀 보기 및 전체보기
    } else if (onlyMyTeam === true && contentsCondition === "all") {
      let myTeamPost: Post[] = [];
      const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
      //내 팀 보기
      props.posts?.find((el) => {
        if (el.team === team) {
          myTeamPost = [...myTeamPost, el];
        }
      });
      setResult(myTeamPost);
      //내 팀 보기 및 영상, 사진관
    } else if (onlyMyTeam === true && contentsCondition === "isUrl") {
      let myTeamPost: Post[] = [];
      let myTeamUrlPost: Post[] = [];
      const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
      //내 팀 보기
      props.posts?.find((el) => {
        if (el.team === team) {
          myTeamPost = [...myTeamPost, el];
        }
      });
      //영상, 사진관
      myTeamPost.find((el) => {
        if (el.fileURL !== "none") {
          myTeamUrlPost = [...myTeamUrlPost, el];
        }
      });
      setResult(myTeamUrlPost);
      //내 팀 보기 및 커뮤니티
    } else if (onlyMyTeam === true && contentsCondition === "noUrl") {
      let myTeamPost: Post[] = [];
      let myTeamWritingPost: Post[] = [];
      const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
      //내 팀 보기
      props.posts?.find((el) => {
        if (el.team === team) {
          myTeamPost = [...myTeamPost, el];
        }
      });
      //영상, 사진관
      myTeamPost.find((el) => {
        if (el.fileURL === "none") {
          myTeamWritingPost = [...myTeamWritingPost, el];
        }
      });
      setResult(myTeamWritingPost);
    }
    setIsLoading(true);
  }

  //모든 팀 보기
  function getAllTeamPost() {
    onlyMyTeam = false;
    getPost();
  }


  //내 팀 보기
  function getMyTeamPost() {
    onlyMyTeam = true;
    getPost();
  }

  //전체 보기
  function getAllKindPost() {
    contentsCondition = "all";
    getPost();
  }

  //영상 게시물만 보기
  function getUrlPost() {
    contentsCondition = "isUrl";
    getPost();
  }

  //글 게시물만 보기
  function getWritingPost() {
    contentsCondition = "noUrl";
    getPost();
  }

  useEffect(() => {
    onlyMyTeam = false;
    contentsCondition = "all";
    getPost();
  }, []);

  return (
    <MaingBoardDiv>
      <div className="board-nav">
        <button className="all" onClick={getAllKindPost}>
          전체 보기
        </button>
        <button className="video" onClick={getUrlPost}>
          영상, 사진관
        </button>
        <button className="community" onClick={getWritingPost}>
          커뮤니티
        </button>
        <button onClick={canPosting} className="posting">
          게시물 작성
        </button>
      </div>
      <div className="post-list-container">
        <div className="list-nav">
          <button className="all" onClick={getAllTeamPost}>모두 보기</button>
          <button className="my-team" onClick={getMyTeamPost}>
            내 팀 보기
          </button>
        </div>
        <ul className="post-list">
          {!isLoading && <span>isLoading</span>}
          {result &&
            result.map((el) =>
              el.fileURL === "" ? (
                <li key={el.time} className="writing post">
                  <div className="info">
                    <div className="title-time">
                      <span className="title">{el.title}</span>
                      <span className="time">{el.time}</span>
                    </div>
                    <p className="author">{el.nickName}</p>
                    <p
                      className="description"
                      dangerouslySetInnerHTML={{ __html: el.contents }}
                    ></p>
                    <div className="communication">
                      <i className="heart">하트</i>
                      <i className="comment">댓글</i>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={el.time} className="url post">
                  {el.fileType && el.fileType.charAt(0) === "v" && (
                    <video muted controls src={el.fileURL}></video>
                  )}
                  {el.fileType && el.fileType.charAt(0) === "i" && (
                    <img src={el.fileURL}></img>
                  )}
                  <div className="info">
                    <div className="title-time">
                      <span className="title">{el.title}</span>
                      <span className="time">{el.time}</span>
                    </div>
                    <p className="author">{el.nickName}</p>
                    <p
                      className="description"
                      dangerouslySetInnerHTML={{ __html: el.contents }}
                    ></p>
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
        background-color: #c7c7c7;
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
        background-color: #c7c7c7;
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
        transition: 500ms;
        width: 80px;
        height: 30px;
        background-color: white;
        border: none;
        border-radius: 7px;
        margin-right: 10px;
        cursor: pointer;
        font-weight: bold;
        &:hover {
          background-color: #c7c7c7;
        }
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
        img {
          width: 100%;
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
  fileURL: string;
  view: number;
  time: string;
  num?: number;
  pageNum?: number;
  postId?: number;
  fileType: string;
  docKey: string;
};
