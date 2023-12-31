import { styled } from "styled-components";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  DocumentData,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";

function PostDetail() {
  const [postData, setPostData] = useState<DocumentData>();
  const [comment, setComment] = useState("");
  const [a, setA] = useState(0);
  const params = useParams();

  let userId = "";
  let nickName = "";
  if (sessionStorage.getItem("user")) {
    const userData = JSON.parse(sessionStorage.getItem("user") || "null");
    userId = userData.docId;
    nickName = userData.nickName;
  }

  async function getPostData() {
    const postRef = doc(db, "post", `${params.id}`);
    const res = await getDoc(postRef);
    const resData = res.data();
    for (const el of resData?.comment) {
      const userIdRef = doc(db, "account", `${el.author}`);
      const userInfo = await getDoc(userIdRef);
      const userData2 = userInfo.data();
      el.author = userData2?.nickName;
    }
    setPostData(resData);
  }

  useEffect(() => {
    getPostData();
  }, [a]);

  //댓글 작성 전 로그인 여부 판별 위함
  const isLogin = useRecoilValue(isLoginAtom);

  //댓글 추가하는 함수
  // const navigate = useNavigate();
  const updateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      alert("로그인을 하셔야 글을 작성할 수 있습니다.");
      return false;
    }
    if (comment == "") {
      alert("내용을 입력해주세요");
      return false;
    }
    //이전에 있는 댓글들 가져와주고
    const postRef = doc(db, "post", `${params.id}`);
    const postInfo = await getDoc(postRef);
    const postInfo2 = postInfo.data();
    const commentArr = postInfo2?.comment;

    //업데이트 과정 시작
    await updateDoc(postRef, {
      comment: [
        ...commentArr,
        {
          author: userId,
          contents: comment,
        },
      ],
    });
    setA(a + 1);
  };

  //댓글 input창
  const commentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setComment(e.target.value);
  };

  const navigate = useNavigate();
  //게시물 수정(posting으로 보내기)
  const fixPost = async () => {
    navigate(`/postdetail/${params.id}/edit`, { state: postData });
  };

  //게시물 삭제
  const deletePost = async () => {
    if (confirm("게시물을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "post", `${params.id}`));
      navigate("/");
    }
  };

  //댓글 수정창으로 이동
  const goToEdit = (index:number, comment:string) => {
    navigate(`/postdetail/${params.id}/commentedit`, { state: {index, comment} });
  }

  //댓글 삭제
  const deleteComment = async (index: number) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      //이전 댓글 목록 가져오고
      const postRef = doc(db, "post", `${params.id}`);
      const postInfo = await getDoc(postRef);
      const postInfo2 = postInfo.data();
      const commentArr = postInfo2?.comment;
      //이 중 index 번호와 같은 댓글 삭제
      commentArr.splice(index, 1);
      //이후 업데이트
      await updateDoc(postRef, {
        comment: commentArr
      });
    }
    setA(a + 1);
  };

  return (
    <>
      <Header></Header>
      <PostDetailDiv className="post">
        {!postData && <span>isLoading</span>}
        {postData && (
          <>
            <div className="title-controll">
              <span className="title">{postData.title}</span>
              {postData.userId === userId && (
                <div className="controll">
                  <span className="fix" onClick={fixPost}>
                    수정
                  </span>
                  <span className="delete" onClick={deletePost}>
                    삭제
                  </span>
                </div>
              )}
            </div>
            <div className="title-info">
              <div className="author-time">
                <span className="nickName">{postData.nickName}</span>
                <span className="time">{postData.time}</span>
              </div>
              <div className="communicate">
                <span>
                  <img
                    src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/filledHeart.png?raw=true"
                    alt="좋아요 수"
                  />
                  {postData.likeUser.length}
                </span>
                <span>
                  <img
                    src="https://github.com/d-bCODING/KLeagueInYourCamera/blob/master/src/assets/icons/filledComment.png?raw=true"
                    alt="댓글 수"
                  />
                  {postData.comment.length}
                </span>
              </div>
            </div>
            <div className="contents">
              <div className="url-contents">
                {postData.fileURL !== "none" &&
                  postData.fileType.charAt(0) === "i" && (
                    <img src={postData.fileURL}></img>
                  )}
                {postData.fileURL !== "none" &&
                  postData.fileType.charAt(0) === "v" && (
                    <video muted controls src={postData.fileURL}></video>
                  )}
              </div>
              <p
                className="contents-writing"
                dangerouslySetInnerHTML={{ __html: postData.contents }}
              ></p>
            </div>
            <div className="comment-wrap">
              <p className="guide">댓글 {postData.comment.length}개</p>
              {postData.comment.map((el: Comment, index: number) => (
                <div key={index} className="comment">
                  <div className="comment-info">
                    <span className="comment-author">{el.author}</span>
                    <span className="comment-contents">{el.contents}</span>
                  </div>
                  {el.author === nickName && (
                    <div className="comment-controll">
                      <span className="comment-fix" onClick={() => goToEdit(index, el.contents)}>수정</span>
                      <span
                        className="comment-delete"
                        onClick={() => deleteComment(index)}
                      >
                        삭제
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <form className="comment-form" action="">
                <input
                  defaultValue={""}
                  className="write-comment"
                  type="text"
                  placeholder="댓글 작성"
                  onChange={commentHandler}
                />
                <button onClick={updateComment}>작성</button>
              </form>
            </div>
          </>
        )}
      </PostDetailDiv>
    </>
  );
}

export default PostDetail;

const PostDetailDiv = styled.div`
  color: black;
  background-color: white;
  width: 1000px;
  margin: 0 auto 40px;
  padding: 20px 0 0;
  border-radius: 10px;
  text-align: left;
  .title-controll {
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .title {
      display: inline-block;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .controll {
      display: flex;
      gap: 10px;
      span {
        cursor: pointer;
        color: #9e9e9e;
        font-weight: bold;
      }
    }
  }
  .title-info {
    padding: 10px 40px;
    border-radius: 4px;
    display: flex;
    background-color: #e0e0e0;
    justify-content: space-between;
    margin-bottom: 40px;
    .author-time {
      display: flex;
      align-items: center;
      gap: 20px;
      .time {
        font-size: 12px;
      }
    }
    .communicate {
      display: flex;
      gap: 20px;
      span {
        display: flex;
        align-items: center;
        img {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }
  .contents {
    padding: 0 40px 20px;
    min-height: 350px;
    .url-contents {
      display: flex;
      justify-content: center;
    }
    img,
    video {
      margin-bottom: 20px;
      max-width: 100%;
      max-height: 350px;
    }
  }
  .comment-wrap {
    border-radius: 0 0 10px 10px;
    padding: 0 40px 10px;
    background-color: #e0e0e0;
    .guide {
      font-weight: bold;
      border-bottom: 1px solid #000;
      padding: 10px 0;
    }
    .comment {
      display: flex;
      justify-content: space-between;
      padding: 10px 0 0;
      .comment-author {
        display: inline-block;
        font-weight: bold;
        margin-right: 10px;
      }
      .comment-controll {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        span {
          cursor: pointer;
        }
      }
    }
    .comment-form {
      display: flex;
      margin-top: 20px;
      height: 40px;
      .write-comment {
        width: 94%;
        border: none;
        box-sizing: border-box;
        border-radius: 6px 0 0 6px;
        padding-left: 10px;
        &:focus {
          outline: none;
        }
      }
      button {
        width: 6%;
        border-radius: 0 6px 6px 0;
        border: none;
        cursor: pointer;
      }
    }
  }
`;

type Comment = {
  author: string;
  contents: string;
};
