import React from "react";
import { DndContext } from "@dnd-kit/core";

import { DraggableTask } from "./DraggableTask";
import { DroppableColumn } from "./DroppableColumn";

const Board = () => {
  return (
    <DndContext>
      <h2>hi</h2>
      <DraggableTask>
        <p>lol</p>
      </DraggableTask>
      <DroppableColumn>
        <div className="h-80 w-80 border"></div>
      </DroppableColumn>
    </DndContext>
  );
};

export default Board;
