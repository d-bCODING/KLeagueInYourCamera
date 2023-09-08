// import React, { useEffect, useState } from "react";
// import { styled } from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import { isLoginAtom } from "../atoms";
// import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
// import { db } from "../firebase";

// const MainBoard: React.FC<{ posts: Post[] | null }> = (props) => {
//   // function MainBoard() {/
//   const [isLoading, setIsLoading] = useState(false);
//   //result = 메인 피드에 보일 게시물들
//   const [result, setResult] = useState<Post[]>([]);
//   //글쓰기 전 로그인 여부 확인
//   const isLogin = useRecoilValue(isLoginAtom);
//   const navigate = useNavigate();
//   const canPosting = () => {
//     if (isLogin) {
//       navigate("/posting");
//     } else {
//       alert("로그인 이후 이용 가능합니다.");
//     }
//   };

//   //※이중 필터가 영 쉽지 않다. Atom으로 구현해봐야하나?
//   let onlyMyTeam = false;
//   let contentsCondition = "all";
//   //게시물 가져오는 방식 설정에 따라 게시물 맞춤 렌더링
//   function getPost() {
//     //모든 팀 보기 및 전체 보기
//     if (onlyMyTeam === false && contentsCondition === "all") {
//       if (props.posts) {
//         setResult(props.posts);
//       }
//       //모든 팀 보기 및 영상, 사진관
//     } else if (onlyMyTeam === false && contentsCondition === "isUrl") {
//       let urlPost: Post[] = [];
//       props.posts?.find((el) => {
//         if (el.fileURL !== "none") {
//           urlPost = [...urlPost, el];
//         }
//       });
//       setResult(urlPost);
//       //모든 팀 보기 및 커뮤니티
//     } else if (onlyMyTeam === false && contentsCondition === "noUrl") {
//       let writingPost: Post[] = [];
//       props.posts?.find((el) => {
//         if (el.fileURL === "none") {
//           writingPost = [...writingPost, el];
//         }
//       });
//       setResult(writingPost);
//       //내 팀 보기 및 전체보기
//     } else if (onlyMyTeam === true && contentsCondition === "all") {
//       let myTeamPost: Post[] = [];
//       const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
//       //내 팀 보기
//       props.posts?.find((el) => {
//         if (el.team === team) {
//           myTeamPost = [...myTeamPost, el];
//         }
//       });
//       setResult(myTeamPost);
//       //내 팀 보기 및 영상, 사진관
//     } else if (onlyMyTeam === true && contentsCondition === "isUrl") {
//       let myTeamPost: Post[] = [];
//       let myTeamUrlPost: Post[] = [];
//       const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
//       //내 팀 보기
//       props.posts?.find((el) => {
//         if (el.team === team) {
//           myTeamPost = [...myTeamPost, el];
//         }
//       });
//       //영상, 사진관
//       myTeamPost.find((el) => {
//         if (el.fileURL !== "none") {
//           myTeamUrlPost = [...myTeamUrlPost, el];
//         }
//       });
//       setResult(myTeamUrlPost);
//       //내 팀 보기 및 커뮤니티
//     } else if (onlyMyTeam === true && contentsCondition === "noUrl") {
//       let myTeamPost: Post[] = [];
//       let myTeamWritingPost: Post[] = [];
//       const { team } = JSON.parse(sessionStorage.getItem("user") || "{}");
//       //내 팀 보기
//       props.posts?.find((el) => {
//         if (el.team === team) {
//           myTeamPost = [...myTeamPost, el];
//         }
//       });
//       //영상, 사진관
//       myTeamPost.find((el) => {
//         if (el.fileURL === "none") {
//           myTeamWritingPost = [...myTeamWritingPost, el];
//         }
//       });
//       setResult(myTeamWritingPost);
//     }
//     setIsLoading(true);
//   }

//   //모든 팀 보기
//   function getAllTeamPost() {
//     onlyMyTeam = false;
//     getPost();
//   }

//   //내 팀 보기
//   function getMyTeamPost() {
//     if (nickName === "") {
//       alert("로그인 이후 이용 가능합니다.");
//       return false;
//     }
//     onlyMyTeam = true;
//     getPost();
//   }

//   //전체 보기
//   function getAllKindPost() {
//     contentsCondition = "all";
//     getPost();
//   }

//   //영상 게시물만 보기
//   function getUrlPost() {
//     contentsCondition = "isUrl";
//     getPost();
//   }

//   //글 게시물만 보기
//   function getWritingPost() {
//     contentsCondition = "noUrl";
//     getPost();
//   }

//   //로그인 되어 있는 유저 닉네임 가져오기
//   let nickName = "";
//   const userData = JSON.parse(sessionStorage.getItem("user") || "null");
//   if (userData) {
//     nickName = userData.nickName;
//   }

//   //좋아요 버튼 controller
//   const doYouLikeThis = async (el: Post) => {
//     //로그인 한 상태 아니면 로그인 페이지로 보내버림
//     if (nickName === "") {
//       alert("로그인 이후 이용 가능합니다.");
//       return false;
//     }

//     //게시물 데이터
//     const postRef = doc(db, "post", `${el.docKey}`);
//     const docInfo = await getDoc(postRef);
//     const docData = docInfo.data();

//     //유저 데이터
//     const userIdRef = doc(db, "account", `${userData.docId}`);
//     const userInfo = await getDoc(userIdRef);
//     const userData2 = userInfo.data();

//     //이전에 있는 좋아요 표시한 유저들 가져와주고
//     let likeUserArr: string[] = [];
//     likeUserArr = docData?.likeUser;

//     //좋아요 누른 적 있는 지 없는지 true, false
//     const isLike = likeUserArr.some((el: string) => el === nickName);

//     //1. 좋아요를 누른적이 있는 경우 삭제해주기
//     let updatedResult: Post[] = [];
//     if (isLike) {
//       const newUserArr = likeUserArr.filter(
//         (user: string) => user !== nickName
//       );
//       await updateDoc(postRef, {
//         likeUser: newUserArr,
//       });
//       updatedResult = result.map((post) =>
//         post.docKey === el.docKey ? { ...post, likeUser: newUserArr } : post
//       );
//       //1-1 사용자가 좋아요한 목록리스트에서도 삭제
//       const removedArr = userData2?.likeList.filter(
//         (likedEl: string) => likedEl !== el.docKey
//       );
//       await updateDoc(userIdRef, {
//         likeList: removedArr,
//       });
//     } else {
//       //2. 좋아요를 누른적이 없는 경우 추가해주기
//       await updateDoc(postRef, {
//         likeUser: [...likeUserArr, nickName],
//       });
//       updatedResult = result.map((post) =>
//         post.docKey === el.docKey
//           ? { ...post, likeUser: [...post.likeUser, nickName] }
//           : post
//       );
//       //2-1 사용자가 좋아요한 목록리스트에도 추가
//       await updateDoc(userIdRef, {
//         likeList: [...userData2?.likeList, el.docKey],
//       });
//     }
//     //3. 바뀐 정보 result에 넣어서 set해주기(리렌더링)
//     setResult(updatedResult);
//   };

//   //상세 페이지 이동 함수(댓글 버튼 클릭시 사용)
//   const goDetailInfo = (el: Post) => {
//     navigate(`/postdetail/${el.docKey}`, { state: el });
//   };

//   useEffect(() => {
//     onlyMyTeam = false;
//     contentsCondition = "all";
//     getPost();
//   }, []);

//   return (
//     <MaingBoardDiv>
//       <div className="board-nav">
//         <button className="all" onClick={getAllKindPost}>
//           전체 보기
//         </button>
//         <button className="video" onClick={getUrlPost}>
//           영상, 사진관
//         </button>
//         <button className="community" onClick={getWritingPost}>
//           커뮤니티
//         </button>
//         <button onClick={canPosting} className="posting">
//           게시물 작성
//         </button>
//       </div>
//       <div className="post-list-container">
//         <div className="list-nav">
//           <button className="all" onClick={getAllTeamPost}>
//             모두 보기
//           </button>
//           <button className="my-team" onClick={getMyTeamPost}>
//             내 팀 보기
//           </button>
//         </div>
//         <ul className="post-list">
//           {!isLoading && <span>isLoading</span>}
//           {result &&
//             result.map((el) => (
//               // el.fileURL === "none" ? (
//               //   <li key={el.time} className="writing post">
//               //     <div className="info">
//               //       <div className="title-time">
//               //         <span className="title">{el.title}</span>
//               //         <span className="time">{el.time}</span>
//               //       </div>
//               //       <p className="author">{el.nickName}</p>
//               //       <p
//               //         className="description"
//               //         dangerouslySetInnerHTML={{ __html: el.contents }}
//               //       ></p>
//               //       <div className="communication">
//               //         <i className="heart">
//               //           <img src={heartSrc} alt="좋아요" />
//               //         </i>
//               //         <i className="comment" onClick={() => goDetailInfo(el)}>
//               //           <img
//               //             src="/src/assets/icons/emptyComment.png"
//               //             alt="댓글"
//               //           />
//               //         </i>
//               //       </div>
//               //     </div>
//               //   </li>
//               // ) :
//               <li key={el.time} className="url post">
//                 {el.fileType && el.fileType.charAt(0) === "v" && (
//                   <video muted controls src={el.fileURL}></video>
//                 )}
//                 {el.fileType && el.fileType.charAt(0) === "i" && (
//                   <img src={el.fileURL}></img>
//                 )}
//                 <div className="info">
//                   <div className="title-time">
//                     <span className="title">{el.title}</span>
//                     <span className="time">{el.time}</span>
//                   </div>
//                   <p className="author">{el.nickName}</p>
//                   <p
//                     className="description"
//                     dangerouslySetInnerHTML={{ __html: el.contents }}
//                   ></p>
//                   <div className="communication">
//                     <i className="heart" onClick={() => doYouLikeThis(el)}>
//                       {el.likeUser.some((el) => el === nickName) ? (
//                         <img
//                           src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/redHeart.png?raw=true"
//                           alt="좋아요"
//                         />
//                       ) : (
//                         <img
//                           src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/emptyHeart.png?raw=true"
//                           alt="좋아요"
//                         />
//                       )}
//                     </i>
//                     <i className="comment" onClick={() => goDetailInfo(el)}>
//                       <img
//                         src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/emptyComment.png?raw=true"
//                         alt="댓글"
//                       />
//                     </i>
//                   </div>
//                 </div>
//               </li>
//             ))}
//         </ul>
//       </div>
//     </MaingBoardDiv>
//   );
// };

// export default MainBoard;

// const MaingBoardDiv = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: row-reverse;
//   text-align: left;
//   .board-nav {
//     position: relative;
//     display: flex;
//     flex-direction: column;
//     height: 600px;
//     button {
//       margin-bottom: 20px;
//       width: 280px;
//       height: 50px;
//       border-radius: 7px;
//       border: none;
//       font-size: 18px;
//       font-weight: bold;
//       transition: 500ms;
//       cursor: pointer;
//       &:hover {
//         background-color: #c7c7c7;
//       }
//     }
//     .posting {
//       display: inline-block;
//       width: 280px;
//       height: 50px;
//       border-radius: 7px;
//       border: none;
//       font-size: 18px;
//       font-weight: bold;
//       transition: 500ms;
//       position: absolute;
//       margin-bottom: 0;
//       bottom: 0;
//       left: 0;
//       background-color: white;
//       text-align: center;
//       line-height: 50px;
//       text-decoration: none;
//       color: black;
//       &:hover {
//         background-color: #c7c7c7;
//       }
//     }
//   }
//   .post-list-container {
//     position: absolute;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 800px;

//     .list-nav {
//       position: absolute;
//       top: -40px;
//       button {
//         transition: 500ms;
//         width: 80px;
//         height: 30px;
//         background-color: white;
//         border: none;
//         border-radius: 7px;
//         margin-right: 10px;
//         cursor: pointer;
//         font-weight: bold;
//         &:hover {
//           background-color: #c7c7c7;
//         }
//       }
//     }
//     .post-list {
//       .post {
//         background-color: #2c2c2c;
//         border-radius: 7px;
//         padding: 20px;
//         box-sizing: border-box;
//         margin-bottom: 40px;
//         video {
//           width: 100%;
//           height: 400px;
//           background-color: black;
//           margin-bottom: 20px;
//         }
//         img {
//           width: 100%;
//           margin-bottom: 20px;
//         }
//         .info {
//           color: white;
//         }
//         .title-time {
//           display: flex;
//           justify-content: space-between;
//           .title {
//             font-size: 20px;
//             font-weight: bold;
//             margin-bottom: 5px;
//           }
//           .time {
//             font-size: 14px;
//           }
//         }
//         .author {
//           font-size: 14px;
//           margin-bottom: 19px;
//           padding-bottom: 20px;
//           border-bottom: 1px solid white;
//         }
//         .description {
//         }
//         .communication {
//           display: flex;
//           gap: 10px;
//           height: 20px;
//           margin-top: 20px;
//           i {
//             cursor: pointer;
//             img {
//               width: 24px;
//               margin-bottom: 0;
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// type Post = {
//   comment: string[];
//   contents: string;
//   like: number;
//   likeUser: string[];
//   nickName: string;
//   team: string;
//   title: string;
//   fileURL: string;
//   view: number;
//   time: string;
//   num?: number;
//   pageNum?: number;
//   postId?: number;
//   fileType: string;
//   docKey: string;
// };
