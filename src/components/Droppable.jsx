import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { SettingsModal } from "./SettingsModal";
import { DownArrow, UpArrow } from "./ArrowIcons";
import settingsButton from "../assets/settings.png";
import SortableItem from "./SortableItem";
import "./Droppable.css";

const Droppable = ({ id, items, handleEdit, handleChangeOnTier }) => {
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
        <span className="settings">
          <span className="arrows">
            <UpArrow size="16px" />
          </span>
          <img
            onClick={() => setShowSettingsModal((prev) => !prev)}
            src={settingsButton}
            alt="change tier settings"
          />
          <span className="arrows">
            <DownArrow size="16px" />
          </span>
        </span>
      ) : null}
    </div>
  );
};

export default Droppable;
