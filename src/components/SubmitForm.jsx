import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

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
      <form onSubmit={handleSubmit(onSubmitOrder)}>
        <input placeholder="COST...." {...register("cost")} />
        <p>{errors.cost?.message}</p>
        <input placeholder="Document Type" {...register("type")} />
        <p>{errors.type?.message}</p>
        <input placeholder="Order Number" {...register("ordernumber")} />
        <p>{errors.ordernumber?.message}</p>
        <input placeholder="Order Details" {...register("orderdetails")} />
        <p>{errors.orderdetails?.message}</p>
        <input placeholder="Payment Mode" {...register("paymentMode")} />
        <p>{errors.paymentMode?.message}</p>
        <input
          // type="checkbox"
          placeholder="Payment Status"
          {...register("paymentstatus")}
        />
        <p>{errors.paymentstatus?.message}</p>
        <input placeholder="Size" {...register("size")} />
        <p>{errors.size?.message}</p>
        <input type="date" placeholder="TimeStamp" {...register("timestamp")} />
        <p>{errors.timestamp?.message}</p>
        <input placeholder="Transaction ID" {...register("transactionid")} />
        <p>{errors.transactionid?.message}</p>
        <input placeholder="Vendor" {...register("vendor")} />
        <p>{errors.vendor?.message}</p>

        <input type="submit" />
      </form>
    </div>
  );
}

export default SubmitForm;
