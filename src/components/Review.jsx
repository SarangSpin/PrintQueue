import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import Order from "./Order";
function ReviewOrders() {

    const search = useLocation().search
    const searchParams = new URLSearchParams(search)

  const [ordersList, setOrdersList] = useState(null);
  const postsRef = collection(db, "orders");

  const getOrders = async () => {
    let data = await getDocs(postsRef);
    console.log(searchParams.get('user'))

    setOrdersList(data)
    
    setOrdersList(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  
    
    

    console.log(data);
  };

  useEffect(() => {
   
  getOrders();
  console.log(ordersList)
  }, []);

  return (
    <div>
    <table>
      {ordersList?.map((order) => {
        if (order.completeStatus === false && order.userid === searchParams.get('user')) {
          return <tr>
         
          <th>{order?.timestamp.seconds}</th>
          <th>{order?.user}</th>
          <th>{order?.transactionid}</th>
          <th>{order?.orderdetails}</th>
          <th>{order?.paymentMode}</th>
          <th>{order?.paymentstatus}</th>
          <th>{order?.completeStatus === false ? "Pending" : "Completed" }</th>
        
        </tr>;
        }
      })}
      </table>
      {/* {ordersList?.map((order) => {
        return <Order order={order} key={order.id} />;
      })} */}
    </div>
  );
}

export default ReviewOrders;
