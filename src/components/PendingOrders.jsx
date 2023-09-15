import React, { useCallback, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import Order from "./Order";
function PendingOrders() {
  const [ordersList, setOrdersList] = useState(null);
  const postsRef = collection(db, "orders");

  const getOrders = async () => {
    const data = await getDocs(postsRef);
    setOrdersList(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
    console.log(ordersList);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div>
    <table>
    <tr style={{backgroundColor: "black", fontWeight: "bolder"}}>
          <td></td>
          <th>Time</th>
          <th>User</th>
          <th>Order Description</th>
          <th>Payment Mode</th>
          
          <th>Order Status</th>
          
        </tr>
      {ordersList?.map((order) => {
        if (order.completeStatus === false) {
          return <Order order={order} />;
        }
      })}
      </table>
      {/* {ordersList?.map((order) => {
        return <Order order={order} key={order.id} />;
      })} */}
    </div>
  );
}

export default PendingOrders;
