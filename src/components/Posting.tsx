import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useState } from "react";
import Header from "./part/Header";
import { styled } from "styled-components";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";

function Posting() {
  const [team, setTeam] = useState("null");
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const teamHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setTeam(e.target.value);
  };

  const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const { nickName } = JSON.parse(sessionStorage.getItem("user") || "{}");

  console.log(title);
  console.log(contents);
  console.log(team);

  const navigate = useNavigate();

  async function addPost(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date();
    const time = `${today.toLocaleDateString()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    await addDoc(collection(db, "post"), {
      title: title,
      contents: contents,
      team: team,
      nickName: nickName,
      view: 0,
      like: 0,
      comment: [],
      likeUser: [],
      videoURL: "",
      time : time,
    });
    navigate("/");
  }

  const cancelPosting = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    console.log(today.toLocaleString());
    navigate("/");
  };

  return (
    <>
      <Header></Header>
      <ForQuillDiv>
        <form action="">
          <div className="title">
            <select name="" id="" onChange={teamHandler}>
              <option value="null">팀</option>
              <option value="ulsan">울산</option>
              <option value="jeonbuk">전북</option>
              <option value="pohang">포항</option>
              <option value="incheon">인천</option>
              <option value="jeju">제주</option>
              <option value="gangwon">강원</option>
              <option value="suwonFC">수원FC</option>
              <option value="daegu">대구</option>
              <option value="seoul">서울</option>
              <option value="suwon">수원삼성</option>
              <option value="gwangju">광주</option>
              <option value="daejeon">대전</option>
            </select>
            <input
              placeholder="제목을 입력해주세요"
              onChange={titleHandler}
            ></input>
          </div>
          <ReactQuill
            modules={modules}
            className="inner"
            onChange={(content, delta, source, editor) =>
              setContents(editor.getHTML())
            }
          ></ReactQuill>
          <div className="button-list">
            <button className="upload" onClick={addPost}>
              게시하기
            </button>
            <button className="cancel" onClick={cancelPosting}>
              취소하기
            </button>
          </div>
        </form>
      </ForQuillDiv>
    </>
  );
}

export default Posting;

// ---------------------------------------------------------------------

const ForQuillDiv = styled.div`
  form {
    width: 1000px;
    height: 40px;
    margin: 0 auto;

    .title {
      display: flex;
      margin: 0 auto;
      width: 1000px;
      height: 40px;
      border: none;
      margin-bottom: 2px;
      select {
        width: 10%;
        height: 100%;
        border: none;
        box-sizing: border-box;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
      }
      input {
        font-size: 14px;
        width: 90%;
        height: 100%;
        border: none;
        box-sizing: border-box;
        padding: 0 20px;
      }
    }
    .quill {
      width: 1000px;
      background-color: white;
      height: 400px;
      margin-bottom: 45px;
      //toolbar 높이 42px;
      .ql-container {
      }
      .ql-toolbar {
        text-align: left;
      }
      .ql-editor {
        background-color: white;
        color: black;
      }
    }
    .button-list {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      button {
        width: 100px;
        height: 36px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
      }
    }
  }
`;
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, "link"],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
        { background: [] },
      ],
      ["image", "video"],
      ["clean"],
    ],
  },
};
