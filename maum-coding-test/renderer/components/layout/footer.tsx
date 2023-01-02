import { useRouter } from "next/router";
import React from "react";

export default function Footer() {
  const router = useRouter();

  return (
    <React.Fragment>
      <div className="flex h-10 cursor-pointer">
        <div
          className={`flex-1 flex justify-center items-center w-full border-r-2  ${
            router.pathname === "/home" ? "bg-pink" : "bg-red-300"
          }`}
          onClick={() => router.push("/home")}
        >
          <img className="w-6 h-6" src="/images/user.png" />
        </div>
        <div
          className={`flex-1 flex justify-center items-center hover:bg-red-300 ${
            router.pathname === "/chatList" ? "bg-pink" : "bg-red-300"
          }`}
          onClick={() => router.push("/chatList")}
        >
          <img className="w-6 h-6" src="/images/user.png" />
        </div>
      </div>
    </React.Fragment>
  );
}
