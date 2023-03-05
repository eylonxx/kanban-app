import { signOut, useSession } from "next-auth/react";
import React from "react";
import LogoLight from "../../assets/logo-light.svg";
import Button from "./Button";

interface NavbarProps {
  open: boolean;
}

const Navbar = ({ open }: NavbarProps) => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-24 w-screen items-center bg-darkGrey  shadow-lg">
      <div
        className={`${
          open ? "border-b-0" : "border-b-2"
        } rounded-non box-border flex h-full w-72 items-center justify-center border-r-2  border-b-darkLines border-r-darkLines `}
      >
        <div className={`${open ? "h-[30px]" : "h-[28px]"}`}>
          <LogoLight />
        </div>
      </div>
      <div className="flex h-24 flex-1 items-center justify-end border-b-2 border-b-darkLines">
        <Button
          text="+ Add New Task"
          width="24"
          height="10"
          variant="mainPurple"
        />
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
        >
          Logout
        </button>
        <button className="btn-ghost btn-square btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
