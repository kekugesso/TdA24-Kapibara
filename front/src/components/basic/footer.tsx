'use client'

import dayjs from "dayjs";

export default function Footer({ bgColor }: { bgColor: string }) {
  return (
    <footer className={`${bgColor} text-white grid min-h-10 place-items-center px-6 py-6 lg:px-8 justify-self-end`}>
      <h1>© {dayjs().year().toString()} Teacher Digital Agency</h1>
    </footer>
  );
}

