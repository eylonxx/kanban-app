/* eslint-disable @typescript-eslint/no-non-null-assertion */

import ShowSidebar from "../../assets/icon-show-sidebar.svg";
import { type Column, type Board } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import TasksBoard from "~/components/TasksBoard";
import Sidebar from "~/components/Sidebar";
import BoardModal, { type BoardModalFormValues } from "~/components/BoardModal";
import NewAndEditTaskModal from "~/components/NewAndEditTaskModal";
import { useAtom } from "jotai";
import { columnsAtom } from "~/utils/jotai";
import { Oval } from "react-loader-spinner";
import Navbar from "~/components/Navbar";

const Home: React.FC = () => {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(true);
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const [openEditBoardModal, setOpenEditBoardModal] = useState(false);
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [columns] = useAtom(columnsAtom);
  const [boardNames, setBoardNames] = useState<string[]>([]);
  const ctx = api.useContext();

  const {
    data: boards,
    refetch: refetchBoards,
    isLoading,
  } = api.board.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Board[]) => {
      setBoardNames(data.map((board) => board.title));
      setSelectedBoard(selectedBoard ?? data[0] ?? null);
    },
  });

  const createBoard = api.board.create.useMutation({
    onSuccess: (data: Board) => {
      setSelectedBoard(data);
      void refetchBoards();
    },
  });

  const updateBoard = api.board.update.useMutation({
    onSuccess: (data) => {
      void ctx.board.getAll.invalidate();
      void ctx.column.getAll.invalidate();
      setSelectedBoard(data[0]);
    },
  });

  const deleteBoard = api.board.deleteBoard.useMutation({
    onSuccess: () => {
      void refetchBoards();
    },
  });

  const getBoardColumns = (boardId: string) => {
    return columns.filter((col) => col.boardId === boardId);
  };

  const handleSelectedBoard = (boardTitle: string) => {
    const newBoard = boards?.filter(
      (board: Board) => boardTitle === board.title
    )[0];
    setSelectedBoard(newBoard ? newBoard : null);
  };

  const handleSetOpen = (val: boolean) => {
    setOpen(val);
  };

  const handleOpenEditBoardModal = (val: boolean) => {
    setOpenEditBoardModal(val);
  };

  const handleDeleteBoard = () => {
    if (selectedBoard) {
      deleteBoard.mutate({ id: selectedBoard.id });
      if (boards?.length) {
        setSelectedBoard(boards[0]);
      }
    }
  };

  const handleBoardModalOnSubmit = (
    isEdit: boolean,
    data: BoardModalFormValues
  ) => {
    const currentColumnsIds = columns
      .filter((col: Column) => col.boardId === selectedBoard!.id)
      .map((col: Column) => col.id);

    const columnsToCreate = data.columns.filter((col) => !col.boardId);
    const columnsToUpdate = data.columns.filter((col) => col.boardId && col.id);
    const columnsToDelete = currentColumnsIds.filter(
      (id) => data.columns.find((col) => col.id === id) === undefined
    );

    if (isEdit) {
      updateBoard.mutate({
        boardId: selectedBoard!.id,
        boardName: data.boardName,
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
      <div className=" flex items-center justify-between ">
        <Navbar
          handleDeleteBoard={handleDeleteBoard}
          open={open}
          boardsLength={boards?.length}
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
          <div className="flex grow items-center justify-center bg-black/5 transition-colors ease-linear">
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
          <div className="flex grow flex-col items-center justify-center gap-4">
            <p>No Boards</p>
            <button
              type="button"
              className="w-56 rounded-full bg-mainPurple px-10 py-3 font-semibold text-white no-underline transition "
              onClick={() => setOpenNewBoardModal(true)}
            >
              Create New Board
            </button>
          </div>
        ) : (
          selectedBoard && (
            <main className="flex grow transition-all">
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
