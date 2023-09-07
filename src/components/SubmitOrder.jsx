import React from "react";
import SubmitForm from "./SubmitForm";
import SubmitFile from "./SubmitFile";
// import "./SubmitOrder.css"; // Import your CSS file for styling

function SubmitOrder() {
  return (
    <div className="submit-order-container">
      <h2 className="submit-order-heading">Submit Your Order</h2>
      <div className="submit-form">
        <SubmitForm />
      </div>
      <div className="submit-file">
        <SubmitFile />
      </div>
    </div>
  );
}

export default SubmitOrder;
