import { signOut } from "next-auth/react";
import React from "react";
import LogoLight from "../assets/logo-light.svg";
import HorizontalEllipsis from "../assets/icon-horizontal-ellipsis.svg";
import IconCheck from "../assets/icon-check.svg";

import type { Board } from "@prisma/client";

interface NavbarProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBoardEdit: (val: boolean) => void;
  handleDeleteBoard: () => void;
  boardsLength: number | undefined;
  handleSelectedBoard: (boardId: string) => void;
  boardNames: { title: string; id: string }[];
  selectedBoard: Board | null;
}

const Navbar = ({
  open,
  setOpenModal,
  setBoardEdit,
  handleDeleteBoard,
  boardsLength,
  boardNames,
  handleSelectedBoard,
  selectedBoard,
}: NavbarProps) => {
  return (
    <div className="flex h-24 w-screen items-center bg-darkGrey shadow-lg">
      <div
        className={`rounded-non box-border flex h-full w-72 items-center justify-center border-r-2  border-b-darkLines border-r-darkLines
         ${open ? "border-b-0" : "border-b-2"}`}
      >
        <div className={`${open ? "h-[30px]" : "h-[28px]"}`}>
          <LogoLight />
        </div>
      </div>
      <div className="flex h-24 flex-1 items-center justify-end border-b-2 border-b-darkLines">
        <div className="dropdown-end dropdown dropdown-bottom flex cursor-pointer sm:hidden">
          <label
            tabIndex={0}
            className="ml-2 cursor-pointer rounded-md border-2 p-2 text-center font-bold"
          >
            Boards
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            {boardNames?.map((board, i) => {
              return (
                <div key={i}>
                  <a
                    onClick={() => {
                      handleSelectedBoard(board.id);
                    }}
                    className={`ml-2 flex items-center justify-start gap-2 overflow-ellipsis
                    ${selectedBoard?.id === board.id ? "font-bold" : ""}`}
                  >
                    {board.title}
                    {selectedBoard?.id === board.id ? <IconCheck /> : ""}
                  </a>
                </div>
              );
            })}
          </ul>
        </div>

        <button
          className="hidden w-56 rounded-full bg-mainPurple px-10 py-3 font-semibold text-white no-underline disabled:bg-mainPurple/30 disabled:text-white/30 md:flex "
          onClick={() => setOpenModal(true)}
          disabled={boardsLength === 0}
        >
          + Add New Task
        </button>

        <div className="dropdown-end dropdown dropdown-bottom mx-3 cursor-pointer ">
          <label tabIndex={0} className="cursor-pointer text-center">
            <HorizontalEllipsis />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box mt-6 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <button
                className="md:hidden"
                type="button"
                disabled={boardsLength === 0}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Add New Task
              </button>
              <button
                type="button"
                disabled={boardsLength === 0}
                onClick={() => {
                  setBoardEdit(true);
                }}
              >
                Edit Board
              </button>
            </li>
            <li>
              <button
                type="button"
                disabled={boardsLength === 0}
                onClick={() => {
                  handleDeleteBoard();
                }}
                className="text-red disabled:text-darkLines disabled:hover:bg-dropMenu"
              >
                Delete Board
              </button>
            </li>
            <li>
              <a
                onClick={() => {
                  void signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
