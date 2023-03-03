import {
  DndContext,
  closestCorners,
  rectIntersection,
  closestCenter,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useState } from "react";
import Container from "./Container";
import { Task } from "./SortableItem";

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

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    const overId = over?.id;
    if (overId == null || overId === "void" || active.id in items) {
      return;
    }

    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId.toString());

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer]!;
      const overItems = prev[overContainer]!;

      // Find the indexes for the items
      const activeIndex = activeItems?.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems?.findIndex((item) => item.id === overId);

      let newIndex;
      if (overId in prev) {
        //if dropped container is empty
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        // &&
        // draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer]!.filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer]!.slice(0, newIndex),
          items[activeContainer]![activeIndex]!,
          ...prev[overContainer]!.slice(newIndex, prev[overContainer]!.length),
        ],
      };
    });
  }

  return (
    <div className="flex flex-row">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.entries(items).map(([key, value]) => {
          return <Container key={key} id={key} items={value} />;
        })}

        <DragOverlay>{activeId ? <Task id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
