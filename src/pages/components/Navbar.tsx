import { signOut } from "next-auth/react";
import React from "react";
import LogoLight from "../../assets/logo-light.svg";
import VerticalEllipsis from "../../assets/icon-vertical-ellipsis.svg";

interface NavbarProps {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBoardEdit: (val: boolean) => void;
  handleDeleteBoard: () => void;
}

const Navbar = ({
  open,
  setOpenModal,
  setBoardEdit,
  handleDeleteBoard,
}: NavbarProps) => {
  return (
    <div className="flex h-24 w-screen items-center bg-darkGrey  shadow-lg">
      <div
        className={`rounded-non box-border flex h-full w-72 items-center justify-center border-r-2  border-b-darkLines border-r-darkLines
         ${open ? "border-b-0" : "border-b-2"}`}
      >
        <div className={`${open ? "h-[30px]" : "h-[28px]"}`}>
          <LogoLight />
        </div>
      </div>
      <div className="flex h-24 flex-1 items-center justify-end border-b-2 border-b-darkLines">
        <button
          className="w-56 rounded-full bg-mainPurple px-10 py-3 font-semibold text-white no-underline transition "
          onClick={() => setOpenModal(true)}
        >
          + Add New Task
        </button>

        <div className="dropdown-end dropdown mx-3 cursor-pointer ">
          <label tabIndex={0} className="cursor-pointer text-center">
            <VerticalEllipsis />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box mt-6 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a
                onClick={() => {
                  setBoardEdit(true);
                }}
              >
                Edit Board
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handleDeleteBoard();
                }}
                className="text-red"
              >
                Delete Board
              </a>
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
