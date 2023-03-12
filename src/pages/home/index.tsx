import ShowSidebar from "../../assets/icon-show-sidebar.svg";
import { type Board } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { api } from "~/utils/api";
import Navbar from "../components/Navbar";
import TasksBoard from "../components/TasksBoard";
import Sidebar from "../components/Sidebar";
import BoardModal from "../components/BoardModal";
import NewTaskModal from "../components/NewTaskModal";

const Home: React.FC = () => {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(true);
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const { data: boards, refetch: refetchBoards } = api.board.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data: Board[]) => {
        setSelectedBoard(selectedBoard ?? data[0] ?? null);
      },
    }
  );

  const createBoard = api.board.create.useMutation({
    onSuccess: () => {
      void refetchBoards();
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const handleCreateBoard = (title: string, columnNames: string[]) => {
    createBoard.mutate({
      title: title,
      columns: columnNames,
    });
  };

  const boardNames = useMemo(() => {
    return boards?.map((board) => board.title) || [];
  }, [boards]);

  const handleSelectedBoard = (boardTitle: string) => {
    const newBoard = boards?.filter((board) => boardTitle === board.title)[0];
    setSelectedBoard(newBoard ? newBoard : null);
  };

  const handleSetOpen = (val: boolean) => {
    setOpen(val);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className=" flex items-center justify-between  bg-darkGrey ">
        <Navbar open={open} setOpenModal={setOpenNewTaskModal} />
      </div>
      <div className="relative flex flex-grow">
        <Sidebar
          open={open}
          handleSelectedBoard={handleSelectedBoard}
          boardNames={boardNames}
          handleSetOpen={handleSetOpen}
          selectedBoard={selectedBoard?.title || ""}
          setOpenModal={setOpenNewBoardModal}
        />
        <div
          className={`${
            open ? "hidden" : ""
          } absolute bottom-10 flex h-12 cursor-pointer items-center rounded-r-full bg-mainPurple py-4 px-5 text-white transition-all hover:bg-mainPurpleHover`}
          onClick={() => setOpen(true)}
        >
          <ShowSidebar />
        </div>
        <main className="grow bg-veryDarkGrey">
          <BoardModal
            setOpen={setOpenNewBoardModal}
            open={openNewBoardModal}
            handleCreateBoard={handleCreateBoard}
          />
          <NewTaskModal setOpen={setOpenNewTaskModal} open={openNewTaskModal} />
          <TasksBoard selectedBoard={selectedBoard} />
        </main>
      </div>
    </div>
  );
};

export default Home;
