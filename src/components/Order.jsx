import { getDownloadURL, ref } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../config/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function Order(props) {

  const { order } = props;
  const [newurl, setNewurl] = useState(null);
  const [start, setStart] = useState(null);
  const [status, setStatus] = useState(null);
  const postsref = collection(db, "orders");
  const navigate = useNavigate();
  const handleDownload = () => {
    const fileref = ref(storage, `${order.filepath}`);
    setStart(order.filepath);
    console.log(order.filepath);
    getDownloadURL(fileref)
      .then((url) => {
        console.log(url)
        setNewurl(url);
        window.open(url, '_blank')
        console.log(newurl);
      })
      .catch((error) => console.log(error));
  };

  const updateDatabase = async () => {
    // async (e) => {
    //   await updateDoc(doc(db, "orders", order.id), {
    //     paymentstatus: true,
    //   });
    // };
    await updateDoc(doc(db, "orders", order.id), {
      completeStatus: true,
    });
    console.log("Updated");
    alert(`Order is completed`)
    setStatus(order)


//email
//email
    navigate("/submissions")
    
  };

  const colorStatus = ()=>{
    if (start === order?.filepath) {return ({backgroundColor: "green"})}
  
  }
  return (
    <>
    
    { (!(status?.completeStatus) && status?.user !== order?.user)  &&  
        <tr style={colorStatus()}>
          <td>{start == order?.filepath ? <button onClick={() => updateDatabase()}>Mark Done</button>  : ""}
          </td>
        
          <th>{(new Date(order?.timestamp.seconds*1000)).toUTCString()}</th>
          <th>{order?.user}</th>
          <th>{order?.orderDescription}</th>
          <th>{order?.paymentMode}</th>
          
          <th>{order?.completeStatus === false ? "Pending" : "Completed" }</th>
          <th>
            
              <button onClick={() => handleDownload()}>Proceed</button>
         
          </th>
        </tr>
       }
        </>
       
  );
}

export default Order;
