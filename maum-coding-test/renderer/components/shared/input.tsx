import React from "react";

interface Props {
  name: string;
  type?: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ ...props }: Props) {
  return (
    <input
      className="border-2 border-gray-300 rounded-lg p-2 w-full"
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
