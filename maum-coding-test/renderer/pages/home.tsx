import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useCollection from "../hooks/useCollection";
import Footer from "../components/layout/footer";
import { collection, getDocs, query, addDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/layout/header";
import { Lists } from "../types/type";

function Home() {
  //로그인 안돼있으면 로그인창으로 이동 -> useEffect 사용
  const { data } = useCollection("all-chats", collection(db, "chats"));
  const router = useRouter();
  const [userList, setUserList] = useState<Lists[]>([]);
  const [chatBtn, setChatBtn] = useState<string>("");
  const [admin, setAdmin] = useState({ adminUid: "", adminName: "" });

  useEffect(() => {
    async function getUserList() {
      const userListRef = collection(db, "users");
      const q = await query(userListRef);
      const data = await getDocs(q);
      const newData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserList(newData);
    }
    getUserList();

    const adminUid = localStorage.getItem("uid");
    const adminName = localStorage.getItem("displayName");
    if (!adminUid || !adminName) {
      router.push("/signin");
    } else setAdmin({ adminUid, adminName });
  }, []);

  const handleCreateChatClick = async (uid: string, displayName: string) => {
    const users = [
      { uid, displayName },
      { uid: admin.adminUid, displayName: admin.adminName },
    ];
    const q = query(collection(db, "chats"), where("users", "==", users));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(collection(db, "chats"), {
        users,
      });
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>UserList</title>
      </Head>
      <div className="h-screen">
        <Header>유저목록</Header>
        <Link href="/signin">Sign In</Link>
        <Link href="/signup">Sign Up</Link>
        <ul>
          {userList &&
            userList.map((res) => (
              <li
                key={res.id}
                className="flex border-b-2 py-4 overflow-y-auto cursor-pointer"
                onClick={() => setChatBtn(res.uid)}
              >
                <div className="w-20">{res.displayName}</div>
                <div>
                  {chatBtn === res.uid && (
                    <Link href={`/Chat/${res.id}`}>
                      <button
                        className="border-2 rounded-md"
                        onClick={() =>
                          handleCreateChatClick(res.uid, res.displayName)
                        }
                      >
                        1:1 대화하기
                      </button>
                    </Link>
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
