import smashcharacters from "./smashcharacters.json";
const initialState = [
  { color: "#FFD700", items: [], tierName: "S", id: 1 },
  { color: "#e8d13c", items: [], tierName: "A", id: 2 },
  { color: "#C0C0C0", items: [], tierName: "B", id: 3 },
  { color: "#9C9C9C", items: [], tierName: "C", id: 4 },
  { color: "#CD7F32", items: [], tierName: "D", id: 5 },
  { color: "#B87333", items: [], tierName: "F", id: 6 },
  {
    color: "#8ef1c2",
    tierName: "Unranked",
    items: smashcharacters,
    id: 7,
  },
];

export default initialState;
