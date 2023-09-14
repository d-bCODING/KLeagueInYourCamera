import Header from "./part/Header";
import { useRecoilValue } from "recoil";
// import { searchKeywordAtom } from "../atoms";
// import MainBoard from "./MainBoard";
// import SearchedList from "./SearchedList";
import { getDocs, collection } from "firebase/firestore/lite";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";
import { isLoginAtom } from "../atoms";

function MainPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  //풀어낸 데이터들 담을 배열
  //각 페이지에서 쓰일 데이터들 처음에만 가져와서 내려주도록 함
  let onlyMyTeam = false;
  let contentsCondition = "all";
  async function getAllPost() {
    let allPost: Post[] = [];
    const posts = await getDocs(collection(db, "post"));
    posts.forEach((el) => {
      const data = el.data();
      const docKey = el.id;
      const post: Post = {
        comment: data.comment,
        contents: data.contents,
        like: data.like,
        likeUser: data.likeUser,
        nickName: data.nickName,
        team: data.team,
        title: data.title,
        fileURL: data.fileURL,
        fileType: data.fileType,
        view: data.view,
        time: data.time,
        docKey: docKey,
      };
      allPost = [post, ...allPost];
    });
    //가져온 게시물들을 최신순으로 위에서부터 정렬
    const sortedAllPost = allPost.sort(
      (a, b) =>
        new Date(b.time as string).getTime() -
        new Date(a.time as string).getTime()
    );
    //이후 마지막으로 각 번호(postId) 매긴다음에
    let postId = sortedAllPost.length;
    sortedAllPost.map((el) => {
      el.postId = postId;
      postId--;
    });

    //※이중 필터가 영 쉽지 않다. Atom으로 구현해봐야하나?
    //모든 팀 보기 및 전체 보기
    if (onlyMyTeam === false && contentsCondition === "all") {
      setPosts(sortedAllPost);
      //모든 팀 보기 및 영상, 사진관
    } else if (onlyMyTeam === false && contentsCondition === "isUrl") {
      let urlPost: Post[] = [];
      sortedAllPost.find((el) => {
        if (el.fileURL !== "none") {
          urlPost = [...urlPost, el];
        }
      });
      setPosts(urlPost);
      //모든 팀 보기 및 커뮤니티
    } else if (onlyMyTeam === false && contentsCondition === "noUrl") {
      let writingPost: Post[] = [];
      sortedAllPost.find((el) => {
        if (el.fileURL === "none") {
          writingPost = [...writingPost, el];
        }
      });
      setPosts(writingPost);
      //내 팀 보기 및 전체보기
    } else if (onlyMyTeam === true && contentsCondition === "all") {
      let myTeamPost: Post[] = [];
      const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
      //내 팀 보기
      sortedAllPost.find((el) => {
        if (el.team === team) {
          myTeamPost = [...myTeamPost, el];
        }
      });
      setPosts(myTeamPost);
      //내 팀 보기 및 영상, 사진관
    } else if (onlyMyTeam === true && contentsCondition === "isUrl") {
      let myTeamPost: Post[] = [];
      let myTeamUrlPost: Post[] = [];
      const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
      //내 팀 보기
      sortedAllPost.find((el) => {
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
      setPosts(myTeamUrlPost);
      //내 팀 보기 및 커뮤니티
    } else if (onlyMyTeam === true && contentsCondition === "noUrl") {
      let myTeamPost: Post[] = [];
      let myTeamWritingPost: Post[] = [];
      const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
      //내 팀 보기
      sortedAllPost.find((el) => {
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
      setPosts(myTeamWritingPost);
    }
    //출하!
    // setPosts(sortedAllPost);
  }

  //모든 팀 보기
  function getAllTeamPost() {
    onlyMyTeam = false;
    getAllPost();
  }

  //내 팀 보기
  function getMyTeamPost() {
    if (userId === "") {
      alert("로그인 이후 이용 가능합니다.");
      return false;
    }
    onlyMyTeam = true;
    getAllPost();
  }

  //전체 보기
  function getAllKindPost() {
    contentsCondition = "all";
    getAllPost();
  }

  //영상 게시물만 보기
  function getUrlPost() {
    contentsCondition = "isUrl";
    getAllPost();
  }

  //글 게시물만 보기
  function getWritingPost() {
    contentsCondition = "noUrl";
    getAllPost();
  }

  //로그인 되어 있는 유저 닉네임 가져오기
  let userId = "";
  const userData = JSON.parse(sessionStorage.getItem("user") || "null");
  if (userData) {
    userId = userData.docId;
  }

  //좋아요 버튼 controller
  const doYouLikeThis = async (el: Post) => {
    //로그인 한 상태 아니면 로그인 페이지로 보내버림
    if (userId === "") {
      alert("로그인 이후 이용 가능합니다.");
      return false;
    }

    //게시물 데이터
    const postRef = doc(db, "post", `${el.docKey}`);
    const docInfo = await getDoc(postRef);
    const docData = docInfo.data();

    //유저 데이터
    const userIdRef = doc(db, "account", `${userData.docId}`);
    const userInfo = await getDoc(userIdRef);
    const userData2 = userInfo.data();

    //이전에 있는 좋아요 표시한 유저들 가져와주고
    let likeUserArr: string[] = [];
    likeUserArr = docData?.likeUser;

    //좋아요 누른 적 있는 지 없는지 true, false
    const isLike = likeUserArr.some((el: string) => el === userId);

    //1. 좋아요를 누른적이 있는 경우 삭제해주기
    let updatedResult: Post[] = [];
    if (isLike) {
      const newUserArr = likeUserArr.filter(
        (user: string) => user !== userId
      );
      await updateDoc(postRef, {
        likeUser: newUserArr,
      });
      updatedResult = posts.map((post) =>
        post.docKey === el.docKey ? { ...post, likeUser: newUserArr } : post
      );
      //1-1 사용자가 좋아요한 목록리스트에서도 삭제
      const removedArr = userData2?.likeList.filter(
        (likedEl: string) => likedEl !== el.docKey
      );
      await updateDoc(userIdRef, {
        likeList: removedArr,
      });
    } else {
      //2. 좋아요를 누른적이 없는 경우 추가해주기
      await updateDoc(postRef, {
        likeUser: [...likeUserArr, userId],
      });
      updatedResult = posts.map((post) =>
        post.docKey === el.docKey
          ? { ...post, likeUser: [...post.likeUser, userId] }
          : post
      );
      //2-1 사용자가 좋아요한 목록리스트에도 추가
      await updateDoc(userIdRef, {
        likeList: [...userData2?.likeList, el.docKey],
      });
    }
    //3. 바뀐 정보 result에 넣어서 set해주기(리렌더링)
    setPosts(updatedResult);
  };

  //상세 페이지 이동 함수(댓글 버튼 클릭시 사용)
  const goDetailInfo = (el: Post) => {
    navigate(`/postdetail/${el.docKey}`, { state: el });
  };

  //글쓰기 전 로그인 여부 확인
  const isLogin = useRecoilValue(isLoginAtom);
  const canPosting = () => {
    if (isLogin) {
      navigate("/posting");
    } else {
      alert("로그인 이후 이용 가능합니다.");
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  //검색어 키워드 전달하는 건데, 이 부분은 쿼리 스트링으로 해봄직한 듯?
  // const isSearch = useRecoilValue(searchKeywordAtom);
  return (
    <>
      <Header></Header>
      {!posts ? (
        "isLoading..."
      ) : (
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
              <button className="all" onClick={getAllTeamPost}>
                모두 보기
              </button>
              <button className="my-team" onClick={getMyTeamPost}>
                내 팀 보기
              </button>
            </div>
            <ul className="post-list">
              {/* {!isLoading && <span>isLoading</span>} */}
              {posts &&
                posts.map((el) => (
                  // el.fileURL === "none" ? (
                  //   <li key={el.time} className="writing post">
                  //     <div className="info">
                  //       <div className="title-time">
                  //         <span className="title">{el.title}</span>
                  //         <span className="time">{el.time}</span>
                  //       </div>
                  //       <p className="author">{el.nickName}</p>
                  //       <p
                  //         className="description"
                  //         dangerouslySetInnerHTML={{ __html: el.contents }}
                  //       ></p>
                  //       <div className="communication">
                  //         <i className="heart">
                  //           <img src={heartSrc} alt="좋아요" />
                  //         </i>
                  //         <i className="comment" onClick={() => goDetailInfo(el)}>
                  //           <img
                  //             src="/src/assets/icons/emptyComment.png"
                  //             alt="댓글"
                  //           />
                  //         </i>
                  //       </div>
                  //     </div>
                  //   </li>
                  // ) :
                  <li key={el.time} className="url post">
                    {el.fileType && el.fileType.charAt(0) === "v" && (
                      <video muted controls src={el.fileURL}></video>
                    )}
                    {el.fileType && el.fileType.charAt(0) === "i" && (
                      <img src={el.fileURL}></img>
                    )}
                    <div className="info">
                      <div className="title-time">
                        <span className="title" onClick={()=> goDetailInfo(el)} >{el.title}</span>
                        <span className="time">{el.time}</span>
                      </div>
                      <p className="author">{el.nickName}</p>
                      <p
                        className="description"
                        dangerouslySetInnerHTML={{ __html: el.contents }}
                      ></p>
                      <div className="communication">
                        <i className="heart" onClick={() => doYouLikeThis(el)}>
                          {el.likeUser.some((el) => el === userId) ? (
                            <img
                              src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/redHeart.png?raw=true"
                              alt="좋아요"
                            />
                          ) : (
                            <img
                              src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/emptyHeart.png?raw=true"
                              alt="좋아요"
                            />
                          )}
                        </i>
                        <i className="comment" onClick={() => goDetailInfo(el)}>
                          <img
                            src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/emptyComment.png?raw=true"
                            alt="댓글"
                          />
                        </i>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </MaingBoardDiv>
      )}
    </>
  );
}

export default MainPage;

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
            cursor: pointer;
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
          span, p {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 15;
            overflow: hidden;
            color: white !important;
          }
        }
        .communication {
          display: flex;
          gap: 10px;
          height: 20px;
          margin-top: 20px;
          i {
            cursor: pointer;
            img {
              width: 24px;
              margin-bottom: 0;
            }
          }
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
  fileType: string;
  view: number;
  time: string;
  num?: number;
  pageNum?: number;
  postId?: number;
  docKey: string;
};
