import Head from "next/head";
import React from "react";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { Lists } from "../types/type";
import Link from "next/link";

export default function ChatList() {
  const [chatList, setChatList] = useState<Lists[]>([]);

  useEffect(() => {
    async function getChatList() {
      const userListRef = collection(db, "chats");
      const q = await query(userListRef);
      const data = await getDocs(q);
      const newData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChatList(newData);
    }
    getChatList();
  }, []);
  console.log(chatList);
  return (
    <React.Fragment>
      <Head>
        <title>채팅목록</title>
      </Head>
      <Header>채팅목록</Header>
      <ul>
        {chatList &&
          chatList.map((res) => (
            <Link href={`/Chat/${res.id}`} key={res.id}>
              <li className="flex border-b-2 py-4 overflow-y-auto cursor-pointer">
                {res.users.length > 2 ? (
                  <div>{`${res.users[0].displayname}외 ${
                    res.users.length - 1
                  }명`}</div>
                ) : (
                  <div>{res.users[0].displayName}</div>
                )}
              </li>
            </Link>
          ))}
      </ul>
      <Footer />
    </React.Fragment>
  );
}
