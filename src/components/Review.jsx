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
    <tr style={{backgroundColor: "black", fontWeight: "bolder"}}>
          <td></td>
          <th>Time</th>
          <th>User</th>
          <th>Pages</th>
          <th>Order Description</th>
          <th>Payment Mode</th>
          <th>Color</th>
          <th>Order Status</th>
          
        </tr>
      {ordersList?.map((order) => {
        if (order.userid === searchParams.get('user')) {
          return <tr>
         <th></th>
         <th>{(new Date(order?.timestamp.seconds*1000)).toUTCString()}</th>
          <th>{order?.user}</th>
          <th>{order?.pages}</th>
          <th>{order?.orderDescription}</th>
          <th>{order?.paymentMode}</th>
          
          <th>{order?.color}</th>
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
