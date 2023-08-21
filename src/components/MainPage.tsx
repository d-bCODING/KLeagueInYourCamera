import Header from "./part/Header";
import { useRecoilValue } from "recoil";
import { searchKeywordAtom } from "../atoms";
import MainBoard from "./MainBoard";
import SearchedList from "./SearchedList";
import { getDocs, collection, QuerySnapshot } from "firebase/firestore/lite";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";

function MainPage() {
  const [isPosts, setIsPosts] = useState(false);
  const [givePosts, setGivePosts] = useState<QuerySnapshot | null>(null);

  useEffect(() => {
    getAllPost();
  }, []);

  async function getAllPost() {
    const posts = await getDocs(collection(db, "post"));
    setGivePosts(posts)
    setIsPosts(true);
  }

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
