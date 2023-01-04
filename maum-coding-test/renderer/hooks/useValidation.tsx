import { useState, useEffect } from "react";
import { SignUpInfo } from "../types/types";

export default function useValidation(signupInfo: SignUpInfo) {
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

  useEffect(() => {
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (
      signupInfo.email.length > 0 &&
      emailRegex.test(signupInfo.email) === false
    ) {
      setIsValidation({ ...isValidation, email: false });
      setValidText({
        ...validText,
        email: "올바른 이메일 형식으로 입력해주세요.",
      });
    } else {
      setIsValidation({ ...isValidation, email: true });
      setValidText({ ...validText, email: "" });
    }
  }, [signupInfo.email]);

  useEffect(() => {
    if (signupInfo.password.length > 0 && signupInfo.password.length < 6) {
      setIsValidation({ ...isValidation, password: false });
      setValidText({
        ...validText,
        password: "비밀번호는 6자 이상이어야 합니다.",
      });
    } else {
      setIsValidation({ ...isValidation, password: true });
      setValidText({ ...validText, password: "" });
    }
  }, [signupInfo.password]);

  useEffect(() => {
    if (
      signupInfo.confirmPassword.length > 0 &&
      signupInfo.password !== signupInfo.confirmPassword
    ) {
      setIsValidation({ ...isValidation, confirmPassword: false });
      setValidText({
        ...validText,
        confirmPassword: "비밀번호가 일치하지 않습니다.",
      });
    } else {
      setIsValidation({ ...isValidation, confirmPassword: true });
      setValidText({ ...validText, confirmPassword: "" });
    }
  }, [signupInfo.password, signupInfo.confirmPassword]);

  useEffect(() => {
    if (
      signupInfo.nickname.length > 0 &&
      (signupInfo.nickname.length < 2 || signupInfo.nickname.length > 8)
    ) {
      setIsValidation({ ...isValidation, nickname: false });
      setValidText({
        ...validText,
        nickname: "닉네임은 2~8 글자로 설정해야 합니다.",
      });
    } else {
      setIsValidation({ ...isValidation, nickname: true });
      setValidText({ ...validText, nickname: "" });
    }
  }, [signupInfo.nickname]);

  return { validText, isValidation };
}
