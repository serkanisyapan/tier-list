import "./Item.css";

const Item = ({ id, dragOverlay }) => {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  };

  return (
    <div style={style} className="item">
      <img src={id} alt="smash characters" />
    </div>
  );
};

export default Item;
