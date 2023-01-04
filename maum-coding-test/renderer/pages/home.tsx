import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Footer from "../components/layout/footer";
import { collection, getDocs, query, addDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/layout/header";
import { Lists, UserLists } from "../types/types";

function Home() {
  const router = useRouter();
  const [userList, setUserList] = useState<Lists[]>([]);
  const [admin, setAdmin] = useState({ adminUid: "", adminName: "" });
  const [checkList, setCheckList] = useState<UserLists[]>([]);

  useEffect(() => {
    const adminUid = localStorage.getItem("uid");
    const adminName = localStorage.getItem("displayName");
    if (!adminUid || !adminName) {
      router.push("/signin");
    } else setAdmin({ adminUid, adminName });

    async function getUserList() {
      const userListRef = collection(db, "users");
      const q = await query(userListRef);
      const data = await getDocs(q);
      const newData = data.docs.map((doc) => ({
        displayName: doc.data().displayName,
        uid: doc.data().uid,
        id: doc.id,
      }));
      setUserList(newData.filter((res) => res.uid !== adminUid));
    }
    getUserList();
  }, []);

  const handleCreateChatClick = async () => {
    if (!checkList.length) {
      alert("채팅 할 상대를 선택해주세요.");
    } else {
      const users = [
        ...checkList,
        { uid: admin.adminUid, displayName: admin.adminName },
      ].sort((a, b) => {
        if (a.uid > b.uid) return 1;
        if (a.uid < b.uid) return -1;
        return 0;
      });

      const q = query(collection(db, "chats"), where("users", "==", users));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const addUser = await addDoc(collection(db, "chats"), {
          users,
        });
        router.push(`/Chat/${addUser.id}`);
      } else router.push(`/Chat/${querySnapshot.docs[0].id}`);
    }
  };

  const handleCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    uid: string,
    displayName: string
  ) => {
    if (checkList.find((res) => res.uid === uid)) {
      const uncheck = checkList.filter((res) => res.uid !== uid);
      setCheckList(uncheck);
    } else {
      setCheckList([...checkList, { uid, displayName }]);
    }
  };

  const handleSignOutClick = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("uid");
      localStorage.removeItem("displayName");
      await router.push("/signin");
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>UserList</title>
      </Head>
      <div className="h-screen">
        <Header>
          <button className="absolute left-2" onClick={handleSignOutClick}>
            로그아웃
          </button>
          유저목록
          <button className="absolute right-2" onClick={handleCreateChatClick}>
            채팅 생성
          </button>
        </Header>
        <ul>
          {userList &&
            userList.map((res) => (
              <li
                key={res.id}
                className="flex items-center border-b-2 h-14 pl-2  overflow-y-auto cursor-pointer"
              >
                <div className="flex mr-2">
                  <input
                    type="checkbox"
                    className="w-6 h-6 cursor-pointer"
                    onChange={(e) =>
                      handleCheckChange(e, res.uid, res.displayName)
                    }
                  />
                </div>
                <div className="w-20">{res.displayName}</div>
              </li>
            ))}
        </ul>
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default Home;
