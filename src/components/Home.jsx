import React from "react";
import ViewOrders from "./ViewOrders";

const homeStyle = {
  textAlign: "center",
  fontSize: "24px",
  fontWeight: "bold",
  marginTop: "20px",
};

function Home() {
  return (
    <>
      <div style={homeStyle}>Home</div>
      <div>
        <ViewOrders />
      </div>
    </>
  );
}

export default Home;
