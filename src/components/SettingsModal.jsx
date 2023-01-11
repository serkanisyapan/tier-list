import { useState } from "react";
import "./SettingsModal.css";

export const SettingsModal = ({
  item,
  handleShowModal,
  handleEdit,
  handleChangeOnTier,
  handleAddTier,
}) => {
  const [tierColor, setTierColor] = useState(item.color);
  const [tierName, setTierName] = useState(item.tierName);
  return (
    <>
      <div onClick={handleShowModal} className="backdrop"></div>
      <div className="settings-modal">
        <span className="modal-text">Change Tier Settings</span>
        <div className="input-section">
          <div className="section">
            <label htmlFor="tier-color">Tier Color</label>
            <input
              type="color"
              id="tier-color"
              onChange={(event) => setTierColor(event.target.value)}
              value={tierColor}
            />
          </div>
          <div className="section">
            <label htmlFor="tier-name">Tier Name</label>
            <input
              type="text"
              id="tier-name"
              onChange={(event) => setTierName(event.target.value)}
              value={tierName}
            />
          </div>
        </div>
        <div className="buttons-section">
          <button
            onClick={() => handleEdit(item.id, tierColor, tierName)}
            className="button save-button"
          >
            Save Changes
          </button>
          <button
            onClick={() => handleChangeOnTier(item, "delete")}
            className="button delete-button"
          >
            Delete Tier
          </button>
          <button
            onClick={() => handleChangeOnTier(item, "removeItems")}
            className="button remove-items-button"
          >
            Remove Ranked Items
          </button>
        </div>
        <div className="add-tier-buttons">
          <button
            onClick={() => handleAddTier(item, 0)}
            className="button add-button"
          >
            Add Tier Above
          </button>
          <button
            onClick={() => handleAddTier(item, 1)}
            className="button add-button"
          >
            Add Tier Below
          </button>
        </div>
      </div>
    </>
  );
};
