import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { SettingsModal } from "./SettingsModal";
import settingsButton from "../assets/settings.png";
import SortableItem from "./SortableItem";
import "./Droppable.css";

const Droppable = ({ id, items, handleEdit }) => {
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
        strategy={horizontalListSortingStrategy}
      >
        <ul className="droppable" ref={setNodeRef}>
          {items.items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </ul>
      </SortableContext>
      {!isStartingTier ? (
        <span className="settings-button">
          <img
            onClick={() => setShowSettingsModal((prev) => !prev)}
            src={settingsButton}
            alt="change tier settings"
          />
        </span>
      ) : null}
    </div>
  );
};

export default Droppable;
