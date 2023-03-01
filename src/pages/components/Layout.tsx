import { useState } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-screen flex-col">
      <div className=" flex items-center justify-between  bg-darkGrey ">
        <Navbar open={open} />
      </div>
      <div className="relative flex flex-grow">
        <aside
          className={`w-0 overflow-hidden  border-r-darkLines bg-darkGrey  transition-all duration-500 ${
            open ? "border-r-2 sm:w-48" : "border-r-0"
          }`}
        >
          <ul>
            <li>text</li>
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
