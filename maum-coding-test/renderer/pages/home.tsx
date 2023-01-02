import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import useCollection from "../hooks/useCollection";
import Footer from "../components/layout/footer";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/layout/header";
import { UserList } from "../types/home";

function Home() {
  //로그인 안돼있으면 로그인창으로 이동 -> useEffect 사용
  const { data } = useCollection("all-chats", collection(db, "chats"));
  const router = useRouter();
  const [userList, setUserList] = useState<UserList[]>([]);
  const [chatBtn, setChatBtn] = useState<string>("");

  useEffect(() => {
    async function getUserList() {
      const userListRef = collection(db, "users");
      const q = await query(userListRef);
      const data = await getDocs(q);
      const newData = data.docs.map((doc) => ({ ...doc.data() }));
      setUserList(newData);
    }
    getUserList();
  }, []);

  const handleChatClick = async () => {};

  return (
    <React.Fragment>
      <Head>
        <title>UserList</title>
      </Head>
      <div className="h-screen">
        <Header>유저목록</Header>
        <Link href="/signin">Sign In</Link>
        <Link href="/signup">Sign Up</Link>
        <ul className="h-[calc(100%-80px)]">
          {userList &&
            userList.map((res) => (
              <li
                key={res.uid}
                className="flex border-b-2 py-4 overflow-y-auto cursor-pointer"
                onClick={() => setChatBtn(res.uid)}
              >
                <div className="w-20">{res.displayName}</div>
                <div>
                  {chatBtn === res.uid && (
                    <button
                      className="border-2 rounded-md"
                      onClick={() => router.push("/chatList")}
                    >
                      1:1 대화하기
                    </button>
                  )}
                </div>
              </li>
            ))}
        </ul>
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default Home;
