interface Props {
  children: React.ReactNode;
}

export default function Button({ children }: Props) {
  return (
    <button
      className="rounded-lg py-2 bg-pink text-white active:bg-red-400"
      type="submit"
    >
      {children}
    </button>
  );
}
