import { useState } from "react";
import Navbar from "./Navbar";
import IconBoard from "../../assets/icon-board.svg";
import IconBoardWhite from "../../assets/icon-board-white.svg";
interface LayoutProps {
  children: React.ReactNode;
}
interface Board {
  key: number;
  name: string;
  tasks: number;
}
const boards = [
  { key: 1, name: "Platform Launch", tasks: 8 },
  { key: 2, name: "test", tasks: 6 },
  { key: 3, name: "bla", tasks: 3 },
];

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState(boards[0]?.key);

  return (
    <div className="flex min-h-screen flex-col">
      <div className=" flex items-center justify-between  bg-darkGrey ">
        <Navbar open={open} />
      </div>
      <div className="relative flex flex-grow">
        <aside
          className={`w-0 overflow-hidden border-r-darkLines bg-darkGrey pr-8 transition-all duration-500 ${
            open ? "border-r-2 sm:w-72" : "border-r-0 pr-0"
          }`}
        >
          <ul>
            {boards.map((board) => {
              return (
                <div
                  onClick={() => {
                    setSelectedBoard(board.key);
                  }}
                  key={board.key}
                  className={`${
                    selectedBoard === board.key
                      ? "rounded-r-full bg-mainPurple text-white"
                      : ""
                  } flex h-12 cursor-pointer items-center gap-4 pl-4`}
                >
                  <div className="flex-shrink-0">
                    {selectedBoard === board.key ? (
                      <IconBoardWhite />
                    ) : (
                      <IconBoard />
                    )}
                  </div>
                  <p className="flex-shrink-0">{board.name}</p>
                </div>
              );
            })}
            <li>
              <button className="" onClick={() => setOpen(false)}>
                hide
              </button>
            </li>
          </ul>
        </aside>
        {!open && (
          <button className="absolute bottom-5" onClick={() => setOpen(true)}>
            open
          </button>
        )}
        <main className="grow bg-veryDarkGrey">{children}</main>
      </div>
    </div>
  );
}
