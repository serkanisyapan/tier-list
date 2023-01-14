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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTiers } from "./hooks/useTiers";
import Droppable from "./components/Droppable";
import Item from "./components/Item";
import "./App.css";

function App() {
  const {
    tiers,
    activeId,
    handleAddTier,
    handleChangeOnTier,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleEdit,
    handleReorder,
    handleResetTiers,
  } = useTiers();
  const [parent, enableAnimations] = useAutoAnimate();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        <button onClick={handleResetTiers} className="reset-all-button">
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
