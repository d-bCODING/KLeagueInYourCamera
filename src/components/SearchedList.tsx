import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { searchKeywordAtom } from "../atoms";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "./part/Header";
import { getDocs, collection } from "firebase/firestore/lite";
import { db } from "../firebase";

// const SearchedList: React.FC<{ posts: Post[] | null }> = (props) => {
function SearchedList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showedPageNum, setShowedPageNum] = useState<Number>(1);
  const searchKeyword = useRecoilValue(searchKeywordAtom);
  
  useEffect(() => {
    getAllPost();
  }, [searchKeyword]);

  //사용자가 입력한 검색 키워드
  //쿼리 스트링으로 나중에 구현해봄이 적절할 듯? 키워드를 아톰으로 관리하는 것 보단??

  //게시물 데이터 가져오기
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
    //검색 키워드가 없다면 그냥 그대로 전체 게시물 보여주기
    if (searchKeyword === " ") {
      setPosts(allPost);
      return;
    } else {
      //검색키워드와 관련한 게시물이 들어올 배열
      let filteredPost: Post[] = [];
      //게시물들 하나하나씩 뜯어보는 과정
      allPost.forEach((el) => {
        //제목이나 내용에 검색 키워드가 포함되어 있을 경우에만 filteredPost에 포함
        if (
          el.title.indexOf(searchKeyword) !== -1 ||
          el.contents.indexOf(searchKeyword) !== -1
        ) {
          filteredPost = [el, ...filteredPost];
        } else if (searchKeyword === " ") {
          filteredPost = [el, ...filteredPost];
        }
      });
      setPosts(filteredPost);
    }
  }

  //시간 순으로 정렬 후, 가장 오래된 것부터 번호 부여.
  const sortedAllPost = posts.sort(
    (a, b) =>
      new Date(b.time as string).getTime() -
      new Date(a.time as string).getTime()
  );
  let count = sortedAllPost.length;
  sortedAllPost.map((el) => {
    el.num = count;
    count--;
  });

  //각 게시물에게 맞는 페이징 번호 부여.
  let pagingNum = 1;
  let plusNum = 0;
  for (let i = 0; i < sortedAllPost.length; i++) {
    plusNum = Math.floor(i / 5);
    sortedAllPost[i].pageNum = pagingNum + plusNum;
  }

  //5개씩 보여준다는 전제하에 페이징 갯수 구하기
  let pageNum = 0;
  if (sortedAllPost.length % 5 > 0) {
    pageNum = Math.floor(sortedAllPost.length / 5) + 1;
  } else {
    pageNum = Math.floor(sortedAllPost.length / 5);
  }

  //return 문에서 페이징 번호 만들 때 쓸 배열 만들기
  let forMakePaging: Number[] = [];
  for (let i = 0; i < pageNum; i++) {
    forMakePaging.push(i + 1);
  }

  //보고싶은 페이지 선택
  const showPage = (num: Number) => {
    setShowedPageNum(num);
  };

  //페이지에 맞는 번호 보유하고 있는 게시물들만 가져오기
  const resultPosts = sortedAllPost.filter(
    (obj) => obj.pageNum === showedPageNum
  );

  //상세페이지 이동 함수
  const navigate = useNavigate();
  const goDetailInfo = (el: Post) => {
    navigate(`/postdetail/${el.docKey}`, { state: el });
  };

  return (
    <>
      <Header></Header>
      <SearchListDiv>
        <div className="welcome">
          {searchKeyword === " " ? (
            <span className="keyword">전체검색 결과입니다.</span>
          ) : (
            <span className="keyword">{`'${searchKeyword}'`} 에 대한 검색 결과입니다.</span>
          )}
        </div>
        <ul className="post-list">
          {resultPosts.map((el) => (
            <li
              onClick={() => goDetailInfo(el)}
              key={el.num}
              className="writing post"
            >
              <div className="info">
                <div className="front">
                  <span className="num">{el.num}</span>
                  <span className="title">{el.title}</span>
                </div>
                <div className="back">
                  <span className="author">작성자</span>
                  <span className="nickName">{el.nickName}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="pageNums">
          {forMakePaging.map((el) => (
            //React에서는 JSX 요소 내부의 구성 요소 또는 문자열만 렌더링할 수 있습니다.
            //TypeScript는 구성 요소나 문자열이 아니기 때문에 숫자를 렌더링할 수 없다고 말합니다.
            //하여 숫자를 스트링 형식으로 바꿔주면 해결된다!
            <span key={el.toString()} onClick={() => showPage(el)}>
              {el.toString()}
            </span>
          ))}
        </div>
      </SearchListDiv>
    </>
  );
}

export default SearchedList;

const SearchListDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .welcome {
    margin-top: -30px;
    margin-bottom: 50px;
    .keyword {
      font-weight: bold;
      font-size: 18px;
    }
  }
  .post-list {
    width: 800px;
    text-align: left;
    min-height: 600px;
    .post {
      cursor: pointer;
      background-color: #2c2c2c;
      border-radius: 7px;
      padding: 20px 20px 20px 0;
      box-sizing: border-box;
      margin-bottom: 40px;
      .info {
        color: white;
        display: flex;
        justify-content: space-between;
        .front {
          .num {
            position: relative;
            display: inline-block;
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin-right: 20px;
            padding: 0 20px;
            &::after {
              content: "";
              position: absolute;
              right: 0;
              width: 1px;
              height: 100%;
              background-color: gray;
            }
          }
        }
        .back {
          .author {
            opacity: 0.5;
            font-size: 14px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .pageNums {
    display: flex;
    gap: 20px;
    span {
      display: inline-block;
      padding: 10px;
      cursor: pointer;
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
