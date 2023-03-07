import React from "react";
import IconCross from "../../assets/icon-cross.svg";
import Button from "./Button";

interface BoardModalProps {
  createBoard: () => void;
  create: boolean;
}

const BoardModal = ({ createBoard, create }: BoardModalProps) => {
  return (
    <>
      {/* Put this part before </body> tag */}
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
              type="text"
              placeholder="e.g. Web Design"
              className="h-10 rounded-md border border-inputBorder bg-transparent pl-2 align-middle font-medium outline-none transition-all placeholder:text-inputBorder hover:border-mainPurple focus:border-mainPurple"
            />
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-xs font-bold">Board Columns</p>
            <div className="flex gap-4">
              <input
                type="text"
                className="h-10 grow rounded-md border border-inputBorder bg-transparent pl-2 align-middle outline-none transition-all hover:border-mainPurple focus:border-mainPurple"
              />
              <button>
                <IconCross />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <button className="h-10 w-full rounded-full bg-white font-bold text-mainPurple">
              + Add New Column
            </button>
            <button className="h-10 w-full rounded-full bg-mainPurple font-bold text-white transition-all hover:bg-mainPurpleHover">
              Create New Board
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardModal;
