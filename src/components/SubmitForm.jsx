import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

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

function SubmitForm() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    cost: yup.number(),
    type: yup.string(),
    ordernumber: yup.number(),
    orderdetails: yup.string(),
    paymentMode: yup.string(),
    paymentstatus: yup.bool(),
    size: yup.number(),
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
    await addDoc(postsRef, {
      ...data,
      user: user?.displayName,
      userid: user?.uid,
    });

    navigate("/");
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
        <input style={inputStyle} placeholder="Size" {...register("size")} />
        <p style={errorStyle}>{errors.size?.message}</p>
        <input
          style={inputStyle}
          type="date"
          placeholder="TimeStamp"
          {...register("timestamp")}
        />
        <p style={errorStyle}>{errors.timestamp?.message}</p>
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
    </div>
  );
}

export default SubmitForm;
