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
  handleAddTier,
}) => {
  const { setNodeRef } = useDroppable({ id });
  const isUnrankedTier = items.tierName === "Unranked";
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleShowModal = () => {
    setShowSettingsModal((prev) => !prev);
  };

  return (
    <div
      style={{
        marginTop: isUnrankedTier ? "30px" : "",
        marginBottom: isUnrankedTier ? "30px" : "",
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
            handleAddTier={handleAddTier}
          />,
          document.body
        )}
      {!isUnrankedTier ? (
        <div style={{ backgroundColor: items.color }} className="tier-names">
          <span>{items.tierName}</span>
        </div>
      ) : undefined}
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
      {!isUnrankedTier ? (
        <Settings
          items={items}
          handleReorder={handleReorder}
          handleShowModal={handleShowModal}
        />
      ) : undefined}
    </div>
  );
};

export default Droppable;
