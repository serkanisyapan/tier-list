import "./SettingsModal.css";

export const SettingsModal = ({
  item,
  handleShowModal,
  handleEdit,
  handleChangeTier,
}) => {
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
              onChange={(event) => handleEdit(event, item.id, "color")}
              value={item.color}
            />
          </div>
          <div className="section">
            <label htmlFor="tier-name">Tier Name</label>
            <input
              type="text"
              id="tier-name"
              onChange={(event) => handleEdit(event, item.id, "tierName")}
              value={item.tierName}
            />
          </div>
        </div>
        <div className="buttons-section">
          <button
            onClick={() => handleChangeTier(item, "delete")}
            className="button delete-button"
          >
            Delete Tier
          </button>
          <button
            onClick={() => handleChangeTier(item, "removeItems")}
            className="button remove-items-button"
          >
            Remove Items
          </button>
        </div>
      </div>
    </>
  );
};
