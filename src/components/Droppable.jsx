import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { SettingsModal } from "./SettingsModal";
import SortableItem from "./SortableItem";
import "./Droppable.css";
import { Settings } from "./Settings";

const Droppable = ({
  id,
  items,
  handleEdit,
  handleChangeOnTier,
  handleReorder,
}) => {
  const { setNodeRef } = useDroppable({ id });
  const isStartingTier = items.tierName === "Unranked";
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleShowModal = () => {
    setShowSettingsModal((prev) => !prev);
  };

  return (
    <div
      style={{
        marginTop: isStartingTier ? "30px" : "",
        marginBottom: isStartingTier ? "30px" : "",
      }}
      className="droppable-container"
    >
      {showSettingsModal &&
        createPortal(
          <SettingsModal
            item={items}
            handleEdit={handleEdit}
            handleChangeOnTier={handleChangeOnTier}
            handleShowModal={handleShowModal}
          />,
          document.body
        )}
      <div style={{ backgroundColor: items.color }} className="tier-names">
        <span>{items.tierName}</span>
      </div>
      <SortableContext
        id={id}
        items={items.items}
        strategy={rectSortingStrategy}
      >
        <ul className="droppable" ref={setNodeRef}>
          {items.items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </ul>
      </SortableContext>
      {!isStartingTier ? (
        <Settings
          items={items}
          handleReorder={handleReorder}
          handleShowModal={handleShowModal}
        />
      ) : null}
    </div>
  );
};

export default Droppable;
