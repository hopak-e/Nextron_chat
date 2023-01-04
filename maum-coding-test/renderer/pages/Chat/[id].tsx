import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Head from "next/head";

import Header from "../../components/layout/header";
import { Message, UserLists } from "../../types/types";

export default function Chat() {
  const router = useRouter();
  const { id } = router.query;

  const [admin, setAdmin] = useState({ uid: "", displayName: "" });

  const [users, setUsers] = useState<UserLists[]>([]);
  const [message, setMessage] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function getMessage() {
      const chatRef = doc(db, "chats", `${id}`);
      const data = await getDoc(chatRef);
      const users = data.data()?.users;
      const messages = data.data()?.messages;
      if (messages) setMessage(messages);
      if (users)
        setUsers(users?.filter((res: UserLists) => res.uid !== adminUid));
    }
    getMessage();
    const adminUid = localStorage.getItem("uid");
    const adminDisplayName = localStorage.getItem("displayName");
    if (adminUid && adminDisplayName) {
      setAdmin({ uid: adminUid, displayName: adminDisplayName });
    }
  }, [input]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = doc(db, "chats", "messages");
    const addMessage = await updateDoc(doc(db, "chats", `${id}`), {
      messages: [
        ...message,
        {
          text: input,
          uid: admin.uid,
          displayName: admin.displayName,
          createdAt: Timestamp.now(),
        },
      ],
    });
    setInput("");
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-hidden">
      <Head>
        <title>
          {users.length > 1
            ? `${users[0]?.displayName}님 외 ${users.length - 1}명`
            : users[0]?.displayName}
        </title>
      </Head>
      <Header>
        <div
          className="absolute left-0 cursor-pointer"
          onClick={() => router.push("/chatList")}
        >
          <img src="/images/arrow.png" className="w-10" />
        </div>
        {users.length > 1
          ? `${users[0].displayName}님 외 ${users.length - 1}명`
          : users[0]?.displayName}
      </Header>
      <div className={`overflow-y-scroll h-[calc(100vh-96px)]`}>
        <ul className="">
          {message &&
            message.map((res) => (
              <li
                key={res.createdAt.nanoseconds}
                className={`flex items-center px-4 py-2 ${
                  res.uid === admin.uid && "flex-row-reverse"
                }`}
              >
                <div className="mr-2">
                  {res.uid === admin.uid ? null : res.displayName}
                </div>
                <div
                  className={`${
                    res.uid === admin.uid ? "bg-red-200" : "bg-gray-300"
                  } p-2 rounded-xl `}
                >
                  {res.text}
                </div>
              </li>
            ))}
        </ul>
        <div ref={scrollRef} />
      </div>
      <form
        className="flex items-center fixed bottom-0 w-full bg-gray-300 h-12"
        onSubmit={onSubmit}
      >
        <input
          placeholder="내용을 입력하세요"
          className="w-full pl-2 bg-gray-300 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}
