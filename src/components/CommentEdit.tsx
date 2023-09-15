import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./part/Header";
import styled from "styled-components";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "../firebase";

function CommentEdit() {
  const location = useLocation();
  const params = useParams();
  const [comment, setComment] = useState(location.state.comment);
  const commentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setComment(e.target.value);
  };

  const navigate = useNavigate();
  //댓글 수정
  const edit = async () => {
    //이전 댓글 목록 가져오고
    const postRef = doc(db, "post", `${params.id}`);
    const postInfo = await getDoc(postRef);
    const postInfo2 = postInfo.data();
    let commentArr = postInfo2?.comment;
    //수정
    commentArr[location.state.index].contents = comment;
    //이후 업데이트
    await updateDoc(postRef, {
      comment: commentArr,
    });
    navigate(`/postdetail/${params.id}`);
  };

  //댓글 수정 취소
  const editCancel = () => {
    navigate(`/postdetail/${params.id}`);
  };

  return (
    <>
      <Header></Header>
      <CommentEditDiv>
        <input type="text" defaultValue={comment} onChange={commentHandler} />
        <div className="button-list">
          <button className="fix" onClick={edit}>
            수정하기
          </button>
          <button className="cancel" onClick={editCancel}>
            취소
          </button>
        </div>
      </CommentEditDiv>
    </>
  );
}

const CommentEditDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 900px;
  background-color: white;
  margin: 0 auto;
  border-radius: 10px;
  padding: 20px;
  input {
    width: 100%;
    height: 160px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: #dddddd;
    border: none;
    padding: 10px;
    margin-bottom: 20px;
    transition: 100ms;
    &:focus {
      background-color: #ffffcc;
      outline: none;
    }
  }
  .button-list {
    display: flex;
    gap: 10px;
    button {
      cursor: pointer;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: bold;
    }
    .fix {
      background-color: #a7a7ff;
    }
  }
`;

export default CommentEdit;
