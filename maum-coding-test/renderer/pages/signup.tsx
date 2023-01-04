import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, doc, collection } from "firebase/firestore";

import useValidation from "../hooks/useValidation";
import { auth, db } from "../firebase";
import Input from "../components/shared/input";
import Button from "../components/shared/button";

export default function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const { email, nickname, password, confirmPassword } = signupInfo;

  const { validText, isValidation } = useValidation(signupInfo);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value,
    });
  };

  const onSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user.user, { displayName: nickname });
      await addDoc(collection(db, "users"), {
        displayName: user.user.displayName,
        uid: user.user.uid,
      });
      if (window.confirm("회원가입이 완료되었습니다!")) {
        window.location.href = "/signin";
      }
    } catch (error) {
      alert("정보를 정확히 기입해주세요.");
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="flex flex-col text-start items-center w-full h-screen">
        <form
          className="flex flex-col justify-center w-4/5 h-full p-6"
          onSubmit={onSignUpSubmit}
        >
          <div className="flex flex-col justify-center border-2 rounded-lg h-4/5 p-6 gap-y-4">
            <label className="text-xl">회원가입</label>
            <Input
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={onChange}
            />
            {isValidation.email || (
              <p className="text-xs text-red-400 pl-2">{validText.email}</p>
            )}
            <Input
              name="nickname"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={onChange}
            />
            {isValidation.nickname || (
              <p className="text-xs text-red-400 pl-2">{validText.nickname}</p>
            )}
            <Input
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={onChange}
            />
            {isValidation.password || (
              <p className="text-xs text-red-400 pl-2">{validText.password}</p>
            )}
            <Input
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={onChange}
            />
            {isValidation.confirmPassword || (
              <p className="text-xs text-red-400 pl-2">
                {validText.confirmPassword}
              </p>
            )}
            <Button>회원가입</Button>
            <div className="text-gray-400">
              이미 아이디가 있으신가요?
              <Link href="/signin">
                <span className="text-black hover:text-pink cursor-pointer">
                  &nbsp;로그인
                </span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
