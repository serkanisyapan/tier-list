import { useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

import "./Droppable.css";

const Droppable = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });
  const isStartingTier = items.tierName === "Unranked";
  return (
    <div
      style={{
        marginTop: isStartingTier ? "30px" : "",
        marginBottom: isStartingTier ? "30px" : "",
      }}
      className="droppable-container"
    >
      <div style={{ backgroundColor: items.color }} className="tier-names">
        <span>{items.tierName}</span>
      </div>
      <SortableContext
        id={id}
        items={items.items}
        strategy={horizontalListSortingStrategy}
      >
        <ul className="droppable" ref={setNodeRef}>
          {items.items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
};

export default Droppable;
