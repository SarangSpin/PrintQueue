import React, { useCallback, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import Order from "./Order";
function PendingOrders() {
  const [ordersList, setOrdersList] = useState(null);
  const postsRef = collection(db, "orders");

  //   const getOrders = async () => {
  //     const data = await getDocs(postsRef);
  //     setOrdersList(
  //       data.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }))
  //     );
  //     console.log(ordersList);
  //     };

  useEffect(() => {
    getDocs(postsRef)
      .then((data) => {
        console.log(data);

        setOrdersList(
          data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      })
      .then(() => {
        console.log(ordersList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // getOrders();

  return (
    <div>
      hello
      {/* {ordersList?.map((order) => {
        return <Order order={order} key={order.id} />;
      })} */}
    </div>
  );
}

export default PendingOrders;
