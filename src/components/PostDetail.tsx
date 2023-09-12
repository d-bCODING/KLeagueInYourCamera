import { styled } from "styled-components";
import Header from "./part/Header";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { DocumentData, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";

function PostDetail() {
  const [postData, setPostData] = useState<DocumentData>();
  const [comment, setComment] = useState("");
  const [a, setA] = useState(0);
  const params = useParams();

  let nickName = "";
  if (sessionStorage.getItem("user")) {
    const userData = JSON.parse(sessionStorage.getItem("user") || "null");
    nickName = userData.nickName;
  }

  async function getPostData() {
    const postRef = doc(db, "post", `${params.id}`);
    const res = await getDoc(postRef);
    const resData = res.data();
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
    const postRef = doc(db, "post", `${params.id}`);
    let commentArr = [];
    //이전에 있는 댓글들 가져와주고
    commentArr = postData?.comment;
    //업데이트 과정 시작
    await updateDoc(postRef, {
      comment: [
        ...commentArr,
        {
          author: nickName,
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
    console.log(postData);
    
    navigate(`/postdetail/${params.id}/edit`, { state: postData });
  }

  //게시물 삭제
  const deletePost = async () => {
    if (confirm("게시물을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "post", `${params.id}`));
      navigate("/");
    }
  }

  return (
    <>
      <Header></Header>
      <PostDetailDiv className="post">
        {!postData && <span>isLoading</span>}
        {postData && (
          <>
            <div className="title-controll">
              <span className="title">{postData.title}</span>
              {postData.nickName === nickName && 
                <div className="controll">
                  <span className="fix" onClick={fixPost}>수정</span>
                  <span className="delete" onClick={deletePost}>삭제</span>
                </div>
              }
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
                  <span className="comment-author">{el.author}</span>
                  <span className="comment-contents">{el.contents}</span>
                </div>
              ))}
              <form className="comment-form" action="">
                <input
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  padding: 20px 0 0;
  border-radius: 10px;
  text-align: left;
  margin-bottom: 80px;
  .title-controll{
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .title {
      display: inline-block;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .controll{
      display: flex;
      gap: 10px;
      span{
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
    min-height: 400px;
    .url-contents {
      display: flex;
      justify-content: center;
    }
    img,
    video {
      margin-bottom: 20px;
      max-width: 100%;
      max-height: 400px;
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
      padding: 10px 0 0;
      .comment-author {
        display: inline-block;
        font-weight: bold;
        margin-right: 10px;
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
      }
      button {
        width: 6%;
        border-radius: 0 6px 6px 0;
        border: none;
      }
    }
  }
`;

type Comment = {
  author: string;
  contents: string;
};
