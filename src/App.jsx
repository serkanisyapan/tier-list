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
import { arrayMove, moveBetweenContainers } from "./utils/array";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import initialState from "./initialState";
import Droppable from "./components/Droppable";
import Item from "./components/Item";
import "./App.css";

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

  const handleEdit = (id, color, name) => {
    const updateTiers = tiers.map((item) => {
      if (id === item.id) {
        return { ...item, color, tierName: name };
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

  const handleReorder = (item, changeOrder) => {
    let copyTiers = [...tiers];
    const itemIndex = copyTiers.indexOf(item);
    if (changeOrder === "goDown") {
      if (itemIndex < copyTiers.length - 2) {
        const getItem = copyTiers.splice(itemIndex, 1)[0];
        copyTiers.splice(itemIndex + 1, 0, getItem);
      }
    }
    if (changeOrder === "goUp") {
      if (itemIndex > 0) {
        const getItem = copyTiers.splice(itemIndex, 1)[0];
        copyTiers.splice(itemIndex - 1, 0, getItem);
      }
    }
    setTiers(copyTiers);
  };

  const handleAddTier = (item, location) => {
    let copyTiers = [...tiers];
    const itemIndex = copyTiers.indexOf(item);
    copyTiers.splice(itemIndex + location, 0, {
      id: Math.random(),
      tierName: "New Tier",
      color: "#ffc0cb",
      items: [],
    });
    setTiers(copyTiers);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div ref={parent} className="main-container">
        {tiers.map((group) => (
          <Droppable
            id={group.id}
            items={group}
            activeId={activeId}
            handleEdit={handleEdit}
            handleChangeOnTier={handleChangeOnTier}
            handleReorder={handleReorder}
            handleAddTier={handleAddTier}
            key={group.id}
          />
        ))}
        <button
          onClick={() => setTiers(initialState)}
          className="reset-all-button"
        >
          Reset All Tiers
        </button>
      </div>
      <DragOverlay>
        {activeId ? <Item id={activeId} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
export default App;
