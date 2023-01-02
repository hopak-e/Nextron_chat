import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Header({ children }: Props) {
  return (
    <header className="h-10 flex items-center justify-center text-white font-semibold bg-pink">
      {children}
    </header>
  );
}
