import { signOut, useSession } from "next-auth/react";
import React from "react";
import Board from "../components/Board";
import Layout from "../components/Layout";

const Home: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout>
      <div className="w-full">
        <Board />
      </div>
    </Layout>
  );
};

export default Home;
