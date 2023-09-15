// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { addDoc, collection } from "firebase/firestore";
// import { auth, db } from "../config/firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { storage } from "../config/firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { v4 } from "uuid";
// import { useLocation } from "react-router-dom";



// const formStyle = {
//     maxWidth: "400px",
//     margin: "0 auto",
//     padding: "20px",
//   };
  
//   const inputStyle = {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "10px",
//   };
  
//   const errorStyle = {
//     color: "red",
//   };
  
//   const containerStyle = {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: "20px",
//   };
  
//   const buttonStyle = {
//     backgroundColor: "#4285F4",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   };

// const PaymentPage = () => {
//     const navigate = useNavigate();
//     const stateVar = useLocation();
//     const [transactionId, setTransactionId] = useState("");
//     const [paymentProofImage, setPaymentProofImage] = useState(null);

//     const schema = yup.object().shape({
//         // ... (existing schema fields)
//         orderId: yup.string(),
//         transactionId: yup.string().required("Transaction ID is required"),
        
//       });

//       const {
//         register,
//         handleSubmit,
//         formState: { errors },
//       } = useForm({
//         resolver: yupResolver(schema),
//       });
    
      

//       const onSubmit = async (data) => {
//         try {
//           // Upload Payment Proof Image
//           if (!paymentProofImage) {
//             alert("Please upload the payment proof image");
//             return;
//           }
//           const paymentProofImageRef = ref(storage, `/paymentProofImages/${v4()}`);
//           const paymentProofImageUploadTask = uploadBytesResumable(
//             paymentProofImageRef,
//             paymentProofImage
//           );
    
//           await paymentProofImageUploadTask;
    
//           const paymentProofImageUrl = await getDownloadURL(
//             paymentProofImageUploadTask.snapshot.ref
//           );
    
//           // You can now use `data.transactionId` and `paymentProofImageUrl` as needed.
    
//           // Redirect to another page after successful submission.
//           navigate("/success");
//         } catch (error) {
//           console.error("Error uploading payment proof image: ", error);
//         }
//       };
      
    


//       return(
    
//     <div className="submit-order-container" style={{display: "flex" , flexDirection: "column" ,margin: "2rem", alignItems: "center"}}>
//     <h2 className="submit-order-heading">Complete your Payment</h2>
//     <>
//     <form onSubmit={handleSubmit(onSubmitOrder)}>
//             <div>
//     <label>Transaction ID</label>
//     <input
//         style={inputStyle}
//         placeholder="Transaction ID"
//         {...register("transactionId")}
//     />
//     <p style={errorStyle}>{errors.transactionId?.message}</p>
//     </div>
//     <div>
//     <label>Payment Proof Image</label>
//     <input
//         type="file"
//         onChange={(e) => setPaymentProofImage(e.target.files[0])}
//         style={inputStyle}
//     />
//     <p style={errorStyle}>{errors.paymentProofImage?.message}</p>
//     </div>
//     </form>
//     </>
//   </div>

//       )



// }



import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useLocation } from "react-router-dom";

const formStyle = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const errorStyle = {
  color: "red",
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "20px",
};

const buttonStyle = {
  backgroundColor: "#4285F4",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};



function PaymentPage() {
  const stateVar = useLocation();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [percent, setPercent] = useState(0);
  const [fileLink, setFileLink] = useState("");
  const [pages, setPages] = useState(null);
  const [orderid, setorderID] = useState("");
  const [cost, setcost] = useState(10)

  const schema = yup.object().shape({
    timestamp: yup.date().default(() => new Date()),
    transactionid: yup.string().required("Enter transaction ID"),
    paymentMethod: yup.string().required("Enter the payment method used")
  });

   useEffect(()=>{console.log(stateVar)}, [])



  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "payments");

  const onSubmitOrder = async (data) => {
    if(fileUpload == null){
      alert("Please upload the file");
      return;
     
    }
    

    // Add the calculated total pages to the form data
    


   
    console.log(fileLink);
    console.log(stateVar)
    const docRef = await addDoc(postsRef, {
      ...data,
      size: fileUpload.size,
      filepath: fileLink,
      user: user?.displayName,
      userid: user?.uid,
      orderId: stateVar.state.orderid,
      cost: stateVar.state.cost
    });
    console.log(docRef.id)
    
    navigate("/");
  };

  function handleChange(event) {
    setFileUpload(event.target.files[0]);
  }

  const handleUpload = (e) => {
    
    if (!fileUpload) {
      alert("Please upload the file first!");
    }

    const newFilename = `/payment_proofs/${v4() + 1234}`;
    const storageRef = ref(storage, newFilename);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        setFileLink(newFilename);
        console.log(newFilename);
        
        navigate("/order_payment", {
          state: stateVar.state
        });
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
    
  };

  return (
    <div className="submit-order-container" style={{display: "flex" , flexDirection: "column" ,margin: "2rem", alignItems: "center"}}>
      <h2 className="submit-order-heading">Complete Your Payment</h2>
      <div style={{justifyContent: "center", width: "50%", justifySelf: "center"}}>
     <form onSubmit={handleSubmit(onSubmitOrder)}>
        <div>
        <h3 className="submit-order-heading">Cost of Order: Rs {stateVar.state.cost}</h3>
          <label>Payment Mode Used</label>
          <select style={inputStyle} {...register("paymentMethod")}>
            <option value="upi">UPI</option>
            <option value="card">Debit/Credit Card</option>
            <option value="netbanking">Net Banking</option>
            {/* Add more document types as needed */}
          </select>
          <p style={errorStyle}>{errors.paymentMethod?.message}</p>
        </div>
      

        <div>
          <label>Transaction Id</label>
          <input
            style={inputStyle}
            placeholder="Enter the transaction id of payment"
            {...register("transactionid")}
          />
          <p style={errorStyle}>{errors.transactionid?.message}</p>
        </div>
        
        <input type="submit" />
        </form>
        {/* Add the rest of the form fields as needed */}
      
        <div style={containerStyle}>
        <input type="file" onChange={handleChange} style={inputStyle} />
        <p>{percent}% done</p>
        <button style={buttonStyle} onClick={e=>handleUpload(e)}>Upload Payment Proof</button>
      </div>
      
    </div>
    </div>
   
  );
}

export default PaymentPage;

