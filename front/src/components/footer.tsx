'use client'

export default function Footer({ bgColor }: { bgColor: string }) {
    return (
      <footer className={bgColor + " text-white grid min-h-10 place-items-center px-6 py-6 lg:px-8"}>
        <h1>Hello my footer!</h1>
      </footer>
    );
  }
  