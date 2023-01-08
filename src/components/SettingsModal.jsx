import "./SettingsModal.css";

export const SettingsModal = ({ item, handleShowModal, handleEdit }) => {
  return (
    <>
      <div onClick={handleShowModal} className="backdrop"></div>
      <div className="settings-modal">
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
    </>
  );
};
