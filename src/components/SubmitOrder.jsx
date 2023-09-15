import React from "react";
import SubmitForm from "./SubmitForm";
import SubmitFile from "./SubmitFile";
import OverallSubmit from "./OverallSubmit";
// import "./SubmitOrder.css"; // Import your CSS file for styling

function SubmitOrder() {
  return (
    <div className="submit-order-container" style={{display: "flex" , flexDirection: "column" ,margin: "2rem", alignItems: "center"}}>
      <h2 className="submit-order-heading">Submit Your Order</h2>
      {/* <div className="submit-form">
        <SubmitForm />
      </div>
      <div className="submit-file">
        <SubmitFile />
      </div> */}
      <OverallSubmit />
    </div>
  );
}

export default SubmitOrder;
