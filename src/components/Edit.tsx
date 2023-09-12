import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./part/Header";
import { db, app } from "../firebase";
import { doc, updateDoc } from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Edit() {
  const location = useLocation();
  const params = useParams();
  
  const [team, setTeam] = useState(location.state.team);
  const [title, setTitle] = useState(location.state.title);
  const [contents, setContents] = useState(location.state.contents);
  const [file, setFile] = useState<File | null>(null);

  //현재 글쓰고 있는 유저의 닉네임 정보 가져오기
  const { nickName } = JSON.parse(sessionStorage.getItem("user") || "{}");

  //게시글의 팀 분류 설정
  const teamHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setTeam(e.target.value);
  };

  //게시글의 제목 설정
  const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  //사용자가 첨부한 파일 인지하기
  const fileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  //사용자가 첨부한 파일 storage에 업로드 및 해당 url 가져온 후 문서에 함께 추가
  const navigate = useNavigate();
  async function fileUpload(e: React.FormEvent) {
    e.preventDefault();
    //제목 입력하게 하기
    if (title.length < 2) {
      alert("제목을 2글자 이상 입력해주세요.");
      return;
    }
    //내용 입력하게 하기
    if (contents.length < 1) {
      alert("내용을 입력해주세요.");
      return;
    }
    const storage = getStorage(app);
    const postRef = doc(db, "post", `${params.id}`);
    const fileRef = ref(storage, `file/${title}${contents}${nickName}`);
    if (file) {
      await uploadBytes(fileRef, file).then(async () => {
        await getDownloadURL(
          ref(storage, `file/${title}${contents}${nickName}`)
        ).then(async (url) => {
          await updateDoc(postRef, {
            title: title,
            contents: contents,
            team: team,
            fileType: file?.type,
            fileURL: url,
          });
          navigate(`/postdetail/${params.id}`);
        });
      });
    } else {
      await updateDoc(postRef, {
        title: title,
        contents: contents,
        team: team,
        fileURL: location.state.fileURL,
      });
      navigate(`/postdetail/${params.id}`);
    }
  }

  //게시물 작성 취소하고 나가기
  const cancelPosting = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/postdetail/${params.id}`);
  };

  //quill contents 내용 state
  function handleChange(content:string) {
    setContents(content);
  }

  return (
    <>
      <Header></Header>
      <ForQuillDiv>
        <form action="">
          <div className="title">
            <select name="" id="" onChange={teamHandler}>
              <option value="none">팀</option>
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
              maxLength={20}
              value={location.state.title}
            ></input>
          </div>
          <ReactQuill
            modules={modules}
            className="inner"
            defaultValue={`${location.state.contents}`}
            // onChange={(content, delta, source, editor) => {
            //   cleanUp.push(content, delta, source);
            //   setContents(editor.getHTML());
            // }}
            onChange={handleChange}
          ></ReactQuill>
          <div className="button-list">
            <input type="file" onChange={fileHandler} />
            <div>
              <button className="upload" onClick={fileUpload}>
                게시하기
              </button>
              <button className="cancel" onClick={cancelPosting}>
                취소하기
              </button>
            </div>
          </div>
        </form>
      </ForQuillDiv>
    </>
  );
}

export default Edit;

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
        &:focus {
          outline: none;
        }
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
      justify-content: space-between;
      gap: 4px;
      div {
        display: flex;
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
  }
`;
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
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
      ["clean"],
    ],
  },
};
