import Header from "./part/Header";
import { useParams, useLocation } from "react-router-dom";

function PostDetail() {
  //url의 번호이자 해당 게시물의 postId
  const params = useParams();
  const location = useLocation();
  console.log(params.id);
  console.log(location);

  const { state: data } = location;
  console.log(data);

  return (
    <>
      <Header></Header>
      <div className="post">
        <p className="title">제목</p>
        <div className="title-info">
          <div className="author-time">
            <span>글쓴이</span>
            <span>시간</span>
          </div>
          <div className="communicate">
            <span>좋아요수</span>
            <span>댓글수</span>
          </div>
        </div>
        <div className="contents">
            내용
        </div>
      </div>
    </>
  );
}

export default PostDetail;
