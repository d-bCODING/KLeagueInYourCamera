import Header from "./part/Header";
import { useRecoilValue } from "recoil";
import { searchKeywordAtom } from "../atoms";
import MainBoard from "./MainBoard";
import SearchedList from "./SearchedList";
import { getDocs, collection } from "firebase/firestore/lite";
import { db } from "../firebase";
import { useEffect, useId, useState } from "react";

function MainPage() {
  const [isPosts, setIsPosts] = useState(false);
  const [givePosts, setGivePosts] = useState<Post[] | null>(null);

  useEffect(() => {
    getAllPost();
  }, []);

  //풀어낸 데이터들 담을 배열
  let allPost: Post[] = [];
  //각 페이지에서 쓰일 데이터들 처음에만 가져와서 내려주도록 함
  async function getAllPost() {
    const posts = await getDocs(collection(db, "post"));
    
    posts.forEach((el) => {
      const data = el.data();
      const docKey = el.id
      const post: Post = {
        comment: data.comment,
        contents: data.contents,
        like: data.like,
        likeUser: data.likeUser,
        nickName: data.nickName,
        team: data.team,
        title: data.title,
        fileURL: data.fileURL,
        fileType:data.fileType,
        view: data.view,
        time: data.time,
        docKey : docKey,
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


    //출하!
    setGivePosts(sortedAllPost);
    setIsPosts(true);
  }

  //검색어 키워드 전달하는 건데, 이 부분은 쿼리 스트링으로 해봄직한 듯?
  const isSearch = useRecoilValue(searchKeywordAtom);
  return (
    <>
      <Header></Header>
      {!isPosts ? (
        "isLoading"
      ) : isSearch ? (
        <SearchedList posts={givePosts}></SearchedList>
      ) : (
        <MainBoard posts={givePosts}></MainBoard>
      )}
    </>
  );
}

export default MainPage;

type Post = {
  comment: string[];
  contents: string;
  like: number;
  likeUser: string[];
  nickName: string;
  team: string;
  title: string;
  fileURL: string;
  fileType:string;
  view: number;
  time: string;
  num?: number;
  pageNum?: number;
  postId?: number;
  docKey:string;
};
