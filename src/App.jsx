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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Droppable from "./components/Droppable";
import Item from "./components/Item";
import smashcharacters from "./smashcharacters.json";
import "./App.css";

const initialState = [
  { color: "#FFD700", items: [], tierName: "S", id: 1 },
  { color: "#e8d13c", items: [], tierName: "A", id: 2 },
  { color: "#C0C0C0", items: [], tierName: "B", id: 4 },
  { color: "#9C9C9C", items: [], tierName: "C", id: 3 },
  { color: "#CD7F32", items: [], tierName: "D", id: 5 },
  { color: "#B87333", items: [], tierName: "F", id: 6 },
  {
    color: "#8ef1c2",
    tierName: "Unranked",
    items: smashcharacters,
    id: 7,
  },
];

function App() {
  const [tiers, setTiers] = useState(
    JSON.parse(localStorage.getItem("tier-list")) || initialState
  );
  const [activeId, setActiveId] = useState(null);
  const [parent, enableAnimations] = useAutoAnimate();

  useEffect(() => {
    localStorage.setItem("tier-list", JSON.stringify(tiers));
  }, [tiers]);

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
    console.log(over);

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      setTiers((tiers) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in tiers
            ? tiers[overContainer].items.length + 1
            : over.data.current?.sortable.index || over.id;
        return moveBetweenContainers(
          tiers,
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
        over.id in tiers
          ? tiers[overContainer].items.length + 1
          : over.data.current?.sortable.index;
      setTiers((tiers) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = tiers.map((group) => {
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
            tiers,
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

  const handleEdit = (event, id, change) => {
    const updateTiers = tiers.map((item) => {
      if (id === item.id) {
        return { ...item, [change]: event.target.value };
      }
      return item;
    });
    setTiers(updateTiers);
  };

  const handleChangeOnTier = (tier, change) => {
    if (change === "delete") {
      const deleteTier = tiers.filter((item) => item.id !== tier.id);
      setTiers(deleteTier);
    }
    if (tier.items) {
      const getTierItems = [...tier.items];
      setTiers((prev) =>
        prev.map((item) => {
          if (item.id === tier.id) {
            return { ...item, items: [] };
          } else if (item.tierName === "Unranked") {
            return { ...item, items: [...item.items, ...getTierItems] };
          }
          return item;
        })
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <button onClick={() => localStorage.removeItem("tier-list")}>
        delete storage
      </button>
      <div ref={parent} className="main-container">
        {tiers.map((group) => (
          <Droppable
            id={group.id}
            items={group}
            activeId={activeId}
            handleEdit={handleEdit}
            handleChangeOnTier={handleChangeOnTier}
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
