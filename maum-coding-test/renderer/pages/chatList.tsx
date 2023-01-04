import Head from "next/head";
import React from "react";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { Lists } from "../types/types";
import Link from "next/link";

export default function ChatList() {
  const [chatList, setChatList] = useState<Lists[]>([]);

  useEffect(() => {
    const uid = localStorage.getItem("uid");

    async function getChatList() {
      const chatListRef = collection(db, "chats");
      const q = await query(chatListRef);
      const data = await getDocs(q);
      const filteredData = data.docs.filter((doc) =>
        doc.data().users.find((res: any) => res.uid === uid)
      );
      const newData = filteredData.map((doc) => ({
        id: doc.id,
        messages: doc.data().messages,
        users: doc.data().users.filter((res: any) => res.uid !== uid),
      }));
      setChatList(newData);
    }
    getChatList();
  }, []);

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
                {res.users.length > 1 ? (
                  <div>{`그룹 채팅방 : ${res.users[0]?.displayName}님 외 ${
                    res.users.length - 1
                  }명`}</div>
                ) : (
                  <div>{`채팅방 : ${res.users[0]?.displayName}님`}</div>
                )}
              </li>
            </Link>
          ))}
      </ul>
      <Footer />
    </React.Fragment>
  );
}
