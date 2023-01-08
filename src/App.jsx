import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";
import Droppable from "./components/Droppable";
import Item from "./components/Item";
import smashcharacters from "./smashcharacters.json";
import "./App.css";

function App() {
  const [itemGroups, setItemGroups] = useState(
    JSON.parse(localStorage.getItem("tier-list")) || [
      { color: "yellow", items: [], tierName: "S", id: 1 },
      { color: "green", items: [], tierName: "A", id: 2 },
      { color: "teal", items: [], tierName: "B", id: 3 },
      { color: "blue", items: [], tierName: "C", id: 4 },
      { color: "orange", items: [], tierName: "D", id: 5 },
      { color: "red", items: [], tierName: "F", id: 6 },
      {
        color: "#8ef1c2",
        tierName: "Unranked",
        items: smashcharacters,
        id: 7,
      },
    ]
  );
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tier-list", JSON.stringify(itemGroups));
  }, [itemGroups]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      setItemGroups((itemGroups) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer - 1].items.length + 1
            : over.data.current.sortable.index;
        console.log("active:", active);
        console.log("over:", over);
        return moveBetweenContainers(
          itemGroups,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null);
      return;
    }
    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in itemGroups
          ? itemGroups[overContainer - 1].items.length + 1
          : over.data.current.sortable.index;
      setItemGroups((itemGroups) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = itemGroups.map((group) => {
            if (overContainer === group.id) {
              return {
                ...group,
                items: arrayMove(group.items, activeIndex, overIndex),
              };
            } else {
              return group;
            }
          });
        } else {
          newItems = moveBetweenContainers(
            itemGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }

    setActiveId(null);
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    activeItemID
  ) => {
    return items.map((item) => {
      if (activeContainer === item.id) {
        return {
          ...item,
          items: removeAtIndex(item.items, activeIndex),
        };
      } else if (overContainer === item.id) {
        return {
          ...item,
          items: insertAtIndex(item.items, overIndex, activeItemID),
        };
      } else {
        return item;
      }
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="main-container">
        {itemGroups.map((group) => (
          <Droppable
            id={group.id}
            items={group}
            activeId={activeId}
            key={group.id}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? <Item id={activeId} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
export default App;
