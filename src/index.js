import React from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
import "./index.css";
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      message={["Terrible", "Poor", "Normal", "Good", "Excellent"]}
      defaultRating={3}
    />
    <StarRating color="red" /> */}
  </React.StrictMode>
);
