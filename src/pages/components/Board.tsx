import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useState } from "react";
import Container from "./Container";

const Board = () => {
  const [activeId, setActiveId] = useState<string | null>();

  const [items, setItems] = useState<Record<string, { id: string }[]>>({
    A: [{ id: "1" }, { id: "2" }, { id: "3" }],
    B: [{ id: "4" }, { id: "5" }, { id: "6" }],
    C: [{ id: "7" }, { id: "8" }, { id: "9" }],
    D: [{ id: "10" }, { id: "11" }, { id: "12" }],
  });

  function findContainer(id: string) {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) =>
      items[key]?.find((item) => item.id === id)
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const { id } = active;
    if (!over) return;
    const overId = over.id;
    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId.toString());

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer]?.findIndex(
      (item) => item.id === active.id
    );
    const overIndex = items[overContainer]?.findIndex(
      (item) => item.id === over.id
    );

    if (
      activeIndex !== undefined &&
      overIndex !== undefined &&
      activeIndex !== overIndex
    ) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer]!,
          activeIndex,
          overIndex
        ),
      }));
    }
    setActiveId(null);
  }

  return (
    <div className="flex flex-row">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {Object.entries(items).map(([key, value]) => {
          return <Container key={key} id={key} items={value} />;
        })}
      </DndContext>
    </div>
  );
};

export default Board;
