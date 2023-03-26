import ShowSidebar from "../../assets/icon-show-sidebar.svg";
import { type Board } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { api } from "~/utils/api";
import Navbar from "../components/Navbar";
import TasksBoard from "../components/TasksBoard";
import Sidebar from "../components/Sidebar";
import BoardModal, {
  type BoardModalFormValues,
} from "../components/BoardModal";
import NewAndEditTaskModal from "../components/NewAndEditTaskModal";
import { useAtom } from "jotai";
import { columnsAtom } from "~/utils/jotai";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Oval } from "react-loader-spinner";

const Home: React.FC = () => {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(true);
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const [openEditBoardModal, setOpenEditBoardModal] = useState(false);
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [columns] = useAtom(columnsAtom);
  const queryClient = useQueryClient();

  const {
    data: boards,
    refetch: refetchBoards,
    isLoading,
  } = api.board.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Board[]) => {
      setSelectedBoard(selectedBoard ?? data[0] ?? null);
    },
  });

  const createBoard = api.board.create.useMutation({
    onSuccess: () => {
      void refetchBoards();
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const updateBoard = api.board.update.useMutation({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [...getQueryKey(api.column.getAll)],
        type: "active",
      });
    },
  });

  const boardNames = useMemo(() => {
    return boards?.map((board) => board.title) || [];
  }, [boards]);

  const getBoardColumns = (boardId: string) => {
    return columns.filter((col) => col.boardId === boardId);
  };

  const handleSelectedBoard = (boardTitle: string) => {
    const newBoard = boards?.filter((board) => boardTitle === board.title)[0];
    setSelectedBoard(newBoard ? newBoard : null);
  };

  const handleSetOpen = (val: boolean) => {
    setOpen(val);
  };

  const handleOpenEditBoardModal = (val: boolean) => {
    setOpenEditBoardModal(val);
  };

  const handleBoardModalOnSubmit = (
    isEdit: boolean,
    data: BoardModalFormValues
  ) => {
    const currentColumnsIds = columns
      .filter((col) => col.boardId === selectedBoard!.id)
      .map((col) => col.id);

    const columnsToCreate = data.columns.filter((col) => !col.boardId);
    const columnsToUpdate = data.columns.filter((col) => col.boardId && col.id);
    const columnsToDelete = currentColumnsIds.filter(
      (id) => data.columns.find((col) => col.id === id) === undefined
    );

    if (isEdit) {
      updateBoard.mutate({
        boardId: selectedBoard!.id,
        toCreate: columnsToCreate,
        toUpdate: columnsToUpdate,
        toDelete: columnsToDelete,
      });
    } else {
      createBoard.mutate({
        title: data.boardName,
        columns: data.columns.map((col) => col.title),
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-veryDarkGrey">
      <div className=" flex items-center justify-between ">
        <Navbar
          open={open}
          setOpenModal={setOpenNewTaskModal}
          setBoardEdit={handleOpenEditBoardModal}
        />
      </div>
      <div className="relative flex flex-grow">
        <Sidebar
          isLoadingBoards={isLoading}
          open={open}
          handleSelectedBoard={handleSelectedBoard}
          boardNames={boardNames}
          handleSetOpen={handleSetOpen}
          selectedBoard={selectedBoard?.title || ""}
          setOpenModal={setOpenNewBoardModal}
        />
        <div
          className={`
          absolute bottom-10 flex h-12 cursor-pointer items-center rounded-r-full bg-mainPurple py-4 px-5 text-white transition-all hover:bg-mainPurpleHover 
          ${open ? "hidden" : ""}`}
          onClick={() => setOpen(true)}
        >
          <ShowSidebar />
        </div>
        {isLoading ? (
          <div className="flex grow items-center justify-center">
            <Oval
              height={80}
              width={80}
              color="#635FC7"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#828fa3"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : boards?.length === 0 ? (
          <div className="flex grow items-center justify-center">
            <p>NO BOARDS!!</p>
          </div>
        ) : (
          selectedBoard && (
            <main className="grow bg-veryDarkGrey">
              <BoardModal
                setOpen={setOpenNewBoardModal}
                open={openNewBoardModal}
                isEdit={false}
                selectedBoard={selectedBoard}
                handleBoardModalOnSubmit={handleBoardModalOnSubmit}
              />
              <BoardModal
                setOpen={setOpenEditBoardModal}
                open={openEditBoardModal}
                isEdit={true}
                selectedBoard={selectedBoard}
                handleBoardModalOnSubmit={handleBoardModalOnSubmit}
              />
              <NewAndEditTaskModal
                isEdit={false}
                setOpen={setOpenNewTaskModal}
                open={openNewTaskModal}
                boardColumns={getBoardColumns(selectedBoard.id)}
              />
              <TasksBoard
                selectedBoard={selectedBoard}
                setOpen={setOpenEditBoardModal}
              />
            </main>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
