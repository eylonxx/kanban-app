import IconBoard from "../../assets/icon-board.svg";
import IconBoardPurple from "../../assets/icon-board-purple.svg";
import HideSidebar from "../../assets/icon-hide-sidebar.svg";
import React from "react";

interface SidebarProps {
  open: boolean;
  handleSelectedBoard: (boardTitle: string) => void;
  handleSetOpen: (val: boolean) => void;
  boardNames: string[];
  selectedBoard: string;
  setOpenModal: (val: boolean) => void;
}

const Sidebar = ({
  open,
  handleSelectedBoard,
  boardNames,
  handleSetOpen,
  selectedBoard,
  setOpenModal,
}: SidebarProps) => {
  return (
    <aside
      className={`flex w-0 flex-col overflow-hidden border-r-darkLines bg-darkGrey transition-all duration-500 ${
        open ? "border-r-2 pr-8 sm:w-72" : "border-r-0 pr-0"
      }`}
    >
      <div className={`my-5 flex flex-shrink-0 pl-8`}>
        <p className="m-0 flex-shrink-0 p-0 text-xs font-bold uppercase tracking-widest text-mediumGrey">
          all boards ({boardNames?.length})
        </p>
      </div>
      <ul>
        {boardNames?.map((board, i) => {
          return (
            <div
              onClick={() => {
                handleSelectedBoard(selectedBoard);
              }}
              key={i}
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
              <p className="flex-shrink-0 font-bold tracking-wide">{board}</p>
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
            <button
              onClick={() => setOpenModal(true)}
              className="flex-shrink-0"
            >
              + Create New Board
            </button>
          </div>
        </li>
      </ul>
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
