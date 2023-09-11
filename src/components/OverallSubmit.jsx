import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

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

function OverallSubmit() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [percent, setPercent] = useState(0);
  const [fileLink, setFileLink] = useState("");

  const schema = yup.object().shape({
    cost: yup.number(),
    type: yup.string(),
    ordernumber: yup.number(),
    orderdetails: yup.string(),
    paymentMode: yup.string(),
    paymentstatus: yup.bool(),

    timestamp: yup.date().default(() => new Date()),
    transactionid: yup.string(),
    vendor: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "orders");

  const onSubmitOrder = async (data) => {
    console.log(fileLink);
    await addDoc(postsRef, {
      ...data,
      size: fileUpload.size,
      filepath: fileLink,
      user: user?.displayName,
      userid: user?.uid,
      completeStatus: false,
    });

    navigate("/");
  };

  function handleChange(event) {
    setFileUpload(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!fileUpload) {
      alert("Please upload the file first!");
    }

    const newFilename = `/files/${v4() + fileUpload.name}`;
    const storageRef = ref(storage, newFilename);
    // const uploadTask =
    const uploadTask = uploadBytesResumable(storageRef, fileUpload);
    //   .then((snapshot) => {
    //   alert("File Uploaded");
    // });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        setFileLink(newFilename);
        console.log(newFilename);
        navigate("/submitorder");
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
    <div>
      <form style={formStyle} onSubmit={handleSubmit(onSubmitOrder)}>
        <input
          style={inputStyle}
          placeholder="COST...."
          {...register("cost")}
        />
        <p style={errorStyle}>{errors.cost?.message}</p>
        <input
          style={inputStyle}
          placeholder="Document Type"
          {...register("type")}
        />
        <p style={errorStyle}>{errors.type?.message}</p>
        <input
          style={inputStyle}
          placeholder="Order Number"
          {...register("ordernumber")}
        />
        <p style={errorStyle}>{errors.ordernumber?.message}</p>
        <input
          style={inputStyle}
          placeholder="Order Details"
          {...register("orderdetails")}
        />
        <p style={errorStyle}>{errors.orderdetails?.message}</p>
        <input
          style={inputStyle}
          placeholder="Payment Mode"
          {...register("paymentMode")}
        />
        <p style={errorStyle}>{errors.paymentMode?.message}</p>
        <input
          style={inputStyle}
          // type="checkbox"
          placeholder="Payment Status"
          {...register("paymentstatus")}
        />
        <p style={errorStyle}>{errors.paymentstatus?.message}</p>
        {/* <input style={inputStyle} placeholder="Size" {...register("size")} />
        <p style={errorStyle}>{errors.size?.message}</p> */}
        {/* <input
          style={inputStyle}
          type="date"
          placeholder="TimeStamp"
          {...register("timestamp")}
        />
        <p style={errorStyle}>{errors.timestamp?.message}</p> */}
        <input
          style={inputStyle}
          placeholder="Transaction ID"
          {...register("transactionid")}
        />
        <p style={errorStyle}>{errors.transactionid?.message}</p>
        <input
          style={inputStyle}
          placeholder="Vendor"
          {...register("vendor")}
        />
        <p style={errorStyle}>{errors.vendor?.message}</p>

        <input type="submit" style={inputStyle} />
      </form>
      <div style={containerStyle}>
        <input type="file" onChange={handleChange} style={inputStyle} />
        <button onClick={handleUpload} style={buttonStyle}>
          Upload to Firebase
        </button>
        <p>{percent}% done</p>
      </div>
    </div>
  );
}

export default OverallSubmit;
