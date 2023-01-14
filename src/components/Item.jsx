import "../styles/Item.css";

const Item = ({ id, dragOverlay }) => {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  };

  return (
    <div style={style} className="item">
      <img src={id} alt="tekken7 characters" />
    </div>
  );
};

export default Item;
