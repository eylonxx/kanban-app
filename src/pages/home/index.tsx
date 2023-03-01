import { signOut, useSession } from "next-auth/react";
import React from "react";
import Layout from "../components/Layout";

const Home: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout>
      <div className="w-full">
        <p className="text-white text-center text-2xl">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        </p>
        <button
          className="bg-white/10 text-white hover:bg-white/20 rounded-full px-10 py-3 font-semibold no-underline transition"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
        >
          Logout
        </button>
      </div>
    </Layout>
  );
};

export default Home;
