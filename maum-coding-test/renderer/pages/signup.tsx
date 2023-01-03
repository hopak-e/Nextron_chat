import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, doc, collection } from "firebase/firestore";

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
  const [validText, setValidText] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [isValidation, setIsValidation] = useState({
    email: true,
    nickname: true,
    password: true,
    confirmPassword: true,
  });

  const { email, nickname, password, confirmPassword } = signupInfo;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value,
    });
  };

  useEffect(() => {
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (email.length > 0 && emailRegex.test(email) === false) {
      setIsValidation({ ...isValidation, email: false });
      setValidText({
        ...validText,
        email: "올바른 이메일 형식으로 입력해주세요.",
      });
    } else {
      setIsValidation({ ...isValidation, email: true });
      setValidText({ ...validText, email: "" });
    }
  }, [email]);

  useEffect(() => {
    if (password.length && password.length < 6) {
      setIsValidation({ ...isValidation, password: false });
      setValidText({
        ...validText,
        password: "비밀번호 6자 이상이어야 합니다.",
      });
    } else {
      setIsValidation({ ...isValidation, confirmPassword: true });
      setValidText({ ...validText, confirmPassword: "" });
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setIsValidation({ ...isValidation, confirmPassword: false });
      setValidText({
        ...validText,
        confirmPassword: "비밀번호가 일치하지 않습니다.",
      });
    } else {
      setIsValidation({ ...isValidation, confirmPassword: true });
      setValidText({ ...validText, confirmPassword: "" });
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (nickname.length > 0 && (nickname.length < 2 || nickname.length > 8)) {
      setIsValidation({ ...isValidation, nickname: false });
      setValidText({
        ...validText,
        nickname: "닉네임은 2~8 글자로 설정해야 합니다.",
      });
    } else {
      setIsValidation({ ...isValidation, nickname: true });
      setValidText({ ...validText, nickname: "" });
    }
  }, [nickname]);

  const onSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userListRef = doc(db, "users", "userList");
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user.user, { displayName: nickname });
      await addDoc(collection(db, "users"), {
        displayName: user.user.displayName,
        uid: user.user.uid,
      });

      // await setDoc(userListRef, {
      //   ...userListRef,
      //   displayName: user.user.displayName,
      //   uid: user.user.uid,
      // });
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
