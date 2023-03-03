import IconBoard from "../../assets/icon-board.svg";
import IconBoardPurple from "../../assets/icon-board-purple.svg";
import HideSidebar from "../../assets/icon-hide-sidebar.svg";
import ShowSidebar from "../../assets/icon-show-sidebar.svg";
import { type Board } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Navbar from "../components/Navbar";
import TasksBoard from "../components/TasksBoard";

const Home: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const { data: boards, refetch: refetchBoards } = api.board.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data: Board[]) => {
        setSelectedBoard(selectedBoard ?? data[0] ?? null);
      },
    }
  );
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <div className=" flex items-center justify-between  bg-darkGrey ">
        <Navbar open={open} />
      </div>
      <div className="relative flex flex-grow">
        <aside
          className={`flex w-0 flex-col overflow-hidden border-r-darkLines bg-darkGrey transition-all duration-500 ${
            open ? "border-r-2 pr-8 sm:w-72" : "border-r-0 pr-0"
          }`}
        >
          <div className={`my-5 flex flex-shrink-0 pl-8`}>
            <p className="m-0 flex-shrink-0 p-0 text-xs font-bold uppercase tracking-widest text-mediumGrey">
              all boards ({boards?.length})
            </p>
          </div>
          <ul>
            {boards?.map((board) => {
              return (
                <div
                  onClick={() => {
                    setSelectedBoard(board);
                  }}
                  key={board.id}
                  className={`
                  flex h-12 cursor-pointer items-center gap-4 pl-8
                  ${
                    selectedBoard === board
                      ? "rounded-r-full bg-mainPurple text-white"
                      : "rounded-r-full text-mediumGrey hover:bg-white hover:text-mainPurple "
                  }`}
                >
                  <div
                    className={`${
                      selectedBoard === board
                        ? "text-white"
                        : "hover:text-mainPurple"
                    } flex-shrink-0`}
                  >
                    <IconBoard />
                  </div>
                  <p className="flex-shrink-0 font-bold tracking-wide">
                    {board.title}
                  </p>
                </div>
              );
            })}
            <li>
              <div
                className={`${"text-mainPurple"} flex h-12 cursor-pointer items-center gap-4 pl-8`}
              >
                <div className="flex-shrink-0">
                  <IconBoardPurple />
                </div>
                <p className="flex-shrink-0 font-bold tracking-wide">
                  + Create New Board
                </p>
              </div>
            </li>
          </ul>
          <div
            onClick={() => setOpen(false)}
            className="group mb-10 mt-auto flex h-12 flex-shrink-0 cursor-pointer items-center rounded-r-full pl-8 transition-all hover:bg-white hover:text-mainPurple"
          >
            <div>
              <HideSidebar />
            </div>
            <p className="flex-shrink-0 pl-4 font-bold tracking-wider text-mediumGrey group-hover:text-mainPurple">
              Hide Sidebar
            </p>
          </div>
        </aside>
        <div
          className={`${
            open ? "hidden" : ""
          } absolute bottom-10 flex h-12 cursor-pointer items-center rounded-r-full bg-mainPurple py-4 px-5 text-white transition-all hover:bg-mainPurpleHover`}
          onClick={() => setOpen(true)}
        >
          <ShowSidebar />
        </div>
        <main className="grow bg-veryDarkGrey">
          <TasksBoard selectedBoard={selectedBoard} />
        </main>
      </div>
    </div>
  );
};

export default Home;
