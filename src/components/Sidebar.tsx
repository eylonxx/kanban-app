import IconBoard from "../assets/icon-board.svg";
import IconBoardPurple from "../assets/icon-board-purple.svg";
import HideSidebar from "../assets/icon-hide-sidebar.svg";
import React from "react";
import { Oval } from "react-loader-spinner";

interface SidebarProps {
  open: boolean;
  handleSelectedBoard: (boardTitle: string) => void;
  handleSetOpen: (val: boolean) => void;
  boardNames: string[];
  selectedBoard: string;
  setOpenModal: (val: boolean) => void;
  isLoadingBoards: boolean;
}

const Sidebar = ({
  open,
  handleSelectedBoard,
  boardNames,
  handleSetOpen,
  selectedBoard,
  setOpenModal,
  isLoadingBoards,
}: SidebarProps) => {
  return (
    <aside
      className={`flex flex-col overflow-hidden border-r-darkLines bg-darkGrey transition-all duration-500
      ${open ? "border-r-2 pr-8 sm:w-72" : "w-0 border-r-0 pr-0"}`}
    >
      <div className="my-5 flex flex-shrink-0 pl-8">
        <p className="m-0 flex-shrink-0 p-0 text-xs font-bold uppercase tracking-widest text-mediumGrey">
          all boards ({boardNames?.length})
        </p>
      </div>
      {isLoadingBoards ? (
        <div className="flex items-center justify-center">
          <Oval
            height={80}
            width={80}
            color="#635FC7"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#828fa3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <ul>
          {boardNames?.map((board, i) => {
            return (
              <div
                onClick={() => {
                  handleSelectedBoard(board);
                }}
                key={i}
                className={`
                  flex h-12 cursor-pointer items-center gap-4 pl-8
                  ${
                    selectedBoard === board
                      ? "rounded-r-full bg-mainPurple text-white transition-all"
                      : "rounded-r-full text-mediumGrey transition-all hover:bg-white hover:text-mainPurple "
                  }`}
              >
                <div
                  className={`flex-shrink-0 
                ${
                  selectedBoard === board
                    ? "text-white transition-all "
                    : " transition-all  hover:text-mainPurple"
                }`}
                >
                  <IconBoard />
                </div>
                <p className="flex-shrink-0 font-bold tracking-wide">{board}</p>
              </div>
            );
          })}
          <li>
            <div className="flex h-12 cursor-pointer items-center gap-4 pl-8 text-mainPurple">
              <div className="flex-shrink-0">
                <IconBoardPurple />
              </div>
              <button
                onClick={() => setOpenModal(true)}
                className="flex-shrink-0"
              >
                + Create New Board
              </button>
            </div>
          </li>
        </ul>
      )}
      <div
        onClick={() => handleSetOpen(false)}
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
  );
};

export default Sidebar;
