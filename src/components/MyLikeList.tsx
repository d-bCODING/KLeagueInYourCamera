import { useState, useEffect } from "react";
import Header from "./part/Header";
import { styled } from "styled-components";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function MyLikeList() {
  const [showedPageNum, setShowedPageNum] = useState<Number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const { docId: userId } = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const userLikeList = async () => {
    let likedPostArr: Post[] = [];
    const userRef = doc(db, "account", userId);
    const userData = await getDoc(userRef);
    const userObj = userData.data();
    const likeList = userObj?.likeList;

    for (const el of likeList) {
      const postRef = doc(db, "post", el);
      const postData = await getDoc(postRef);
      const postObj = postData.data();
      const postInfo = {
        postId: el,
        postNum: 0,
        pageNum: 0,
        postTime: postObj?.time,
        postTitle: postObj?.title,
        postAuthor: postObj?.nickName,
      };
      likedPostArr = [...likedPostArr, postInfo];
    }
    // likeList.forEach(async (el: string) => {
    //   const postRef = doc(db, "post", el);
    //   const postData = await getDoc(postRef);
    //   const postObj = postData.data();
    //   const postInfo = {
    //     postId: el,
    //     postTitle: postObj?.contents,
    //     postAuthor: postObj?.nickName,
    //   };
    //   likedPostArr = [...likedPostArr, postInfo];
    // })
    setPosts(likedPostArr);
  };

  //시간 순으로 정렬 후, 가장 오래된 것부터 번호 부여.
  const sortedAllPost = posts.sort(
    (a, b) =>
      new Date(b.postTime as string).getTime() -
      new Date(a.postTime as string).getTime()
  );
  let count = sortedAllPost.length;
  sortedAllPost.map((el) => {
    el.postNum = count;
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

  //상세페이지 이동 함수
  const navigate = useNavigate();
  const goDetailInfo = (el: Post) => {
    navigate(`/postdetail/${el.postId}`, { state: el });
  };

  //보고싶은 페이지 선택
  const showPage = (num: Number) => {
    setShowedPageNum(num);
  };

  //페이지에 맞는 번호 보유하고 있는 게시물들만 가져오기
  const resultPosts = posts.filter(
    (obj) => obj.pageNum === showedPageNum
  );

  useEffect(() => {
    userLikeList();
  }, []);

  return (
    <>
      <Header></Header>
      <SearchListDiv>
        <ul className="post-list">
          {resultPosts.map((el) => (
            <li
              onClick={() => goDetailInfo(el)}
              key={el.postId}
              className="writing post"
            >
              <div className="info">
                <div className="front">
                  <span className="num">{el.postNum}</span>
                  <span className="title">{el.postTitle}</span>
                </div>
                <div className="back">
                  <span className="author">작성자</span>
                  <span className="nickName">{el.postAuthor}</span>
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

export default MyLikeList;

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
  postId: string;
  postTime: string;
  postTitle: string;
  postAuthor: string;
  postNum: number;
  pageNum: number;
};
