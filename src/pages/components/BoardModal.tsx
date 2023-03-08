import React, { useState } from "react";
import IconCross from "../../assets/icon-cross.svg";

interface BoardModalProps {
  createBoard: () => void;
  create: boolean;
}

const BoardModal = ({ createBoard, create }: BoardModalProps) => {
  const [boardName, setBoardName] = useState<string>("");
  const [boardColumns, setBoardColumns] = useState<string[]>(["Todo", "Doing"]);
  const [errors, setErrors] = useState<string[]>([]);

  const addNewColumn = () => {
    setBoardColumns((prev) => {
      if (prev[prev.length - 1] === "") {
        return prev;
      } else {
        return [...prev, ""];
      }
    });
  };

  const handleInputOnChange = (text: string, i: number) => {
    setBoardColumns((prev) => {
      prev[i] = text;
      return [...prev];
    });
  };

  const handleCreateBoard = () => {
    if (!boardName) {
      setErrors((prev) => [...prev, "boardName"]);
    }
  };

  const handleDeleteColumn = (i: number) => {
    const newState = [...boardColumns];
    newState.splice(i, 1);
    setBoardColumns(newState);
  };

  return (
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative flex max-w-md flex-col gap-4 bg-darkGrey">
          <label
            htmlFor="my-modal-3"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <p className="text-lg font-bold text-white">
            {create ? "Add" : "Edit"} New Board
          </p>
          <div className="flex flex-col">
            <p className="mb-2 text-xs font-bold">Board Name</p>
            <input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              type="text"
              placeholder="e.g. Web Design"
              className="h-10 rounded-md border border-inputBorder bg-transparent pl-2 align-middle font-medium outline-none transition-all placeholder:text-inputBorder hover:border-mainPurple focus:border-mainPurple"
            />
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-xs font-bold">Board Columns</p>
            <div className="flex flex-col gap-3">
              {boardColumns.map((input, i) => {
                return (
                  <div key={i} className="flex gap-4">
                    <input
                      type="text"
                      className=" h-10 grow rounded-md border border-inputBorder bg-transparent pl-2 align-middle outline-none transition-all invalid:border-red hover:border-mainPurple focus:border-mainPurple"
                      onChange={(e) => handleInputOnChange(e.target.value, i)}
                      value={input}
                      required
                    />
                    <button onClick={() => handleDeleteColumn(i)}>
                      <IconCross />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <button
              className="h-10 w-full rounded-full bg-white font-bold text-mainPurple"
              onClick={addNewColumn}
            >
              + Add New Column
            </button>
            <label
              htmlFor="my-modal-3"
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-mainPurple font-bold text-white transition-all hover:bg-mainPurpleHover "
              onClick={handleCreateBoard}
            >
              Create New Board
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardModal;
