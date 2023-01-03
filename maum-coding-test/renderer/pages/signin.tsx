import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import Input from "../components/shared/input";
import Button from "../components/shared/button";

export default function SignIn() {
  const [signinInfo, setSigninInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = signinInfo;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigninInfo({
      ...signinInfo,
      [name]: value,
    });
  };

  const signin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      await localStorage.setItem("uid", user.user.uid);
      user.user.displayName &&
        localStorage.setItem("displayName", user.user.displayName);
      const relocate = () => (window.location.href = "/home");
      await relocate();
    } catch (error) {
      alert("아이디 혹은 비밀번호를 확인해주세요.");
      setSigninInfo({ email: "", password: "" });
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex flex-col text-start items-center w-full h-screen">
        <form
          className="flex flex-col justify-center w-4/5 h-full p-6"
          onSubmit={signin}
        >
          <div className="flex flex-col justify-center border-2 rounded-lg h-3/5 p-6 gap-y-4">
            <label className="text-xl">로그인</label>
            <Input
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={onChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={onChange}
            />
            <Button>로그인</Button>
            <div className="text-gray-400">
              아이디가 없으신가요?
              <Link href="/signup">
                <span className="text-black hover:text-pink cursor-pointer">
                  &nbsp;회원가입
                </span>
              </Link>
              <Link href="/home">홈으로 이동</Link>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
