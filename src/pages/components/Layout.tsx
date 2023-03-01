import { useState } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-screen flex-col">
      <div className=" flex items-center justify-between bg-darkGrey">
        <Navbar />
      </div>
      <div className="relative flex flex-grow">
        <aside
          className={`w-0 overflow-hidden bg-darkGrey  transition-all ${
            open ? "sm:w-48" : ""
          }`}
        >
          <ul>
            <li>
              <p>text</p>
            </li>
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
        <main className="flex-1 border">{children}</main>
      </div>
    </div>
  );
}
