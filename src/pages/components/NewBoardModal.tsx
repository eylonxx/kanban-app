import React from "react";

interface NewBoardModalProps {
  createBoard: () => void;
}

const NewBoardModal = ({ createBoard }: NewBoardModalProps) => {
  return (
    <>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Add New Board</h3>
          <p className="py-4">
            Youve been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
        </label>
      </label>
    </>
  );
};

export default NewBoardModal;
