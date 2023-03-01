import { useState } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="min-w-screen flex">
        <aside
          className={`w-0 overflow-hidden  transition-all ${
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
