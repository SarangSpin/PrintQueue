import { getDownloadURL, ref } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../config/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";

function Order(props) {
  const { order } = props;
  const [newurl, setNewurl] = useState(null);
  const postsref = collection(db, "orders");

  const handleDownload = () => {
    const fileref = ref(storage, `${order.filepath}`);
    console.log("in");
    getDownloadURL(fileref)
      .then((url) => {
        setNewurl(url);
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
  };
  return (
    <div>
      <table>
        <tr>
          <td>
            <button onClick={() => updateDatabase()}>Mark Done</button>
          </td>
          <th>{order?.user}</th>
          <th>{order?.orderdetails}</th>
          <th>{order?.paymentstatus}</th>
          <th>
            {!newurl ? (
              <button onClick={() => handleDownload()}>Create Link</button>
            ) : (
              <a href={newurl}>Download File</a>
            )}
          </th>
        </tr>
        <hr></hr>
      </table>
    </div>
  );
}

export default Order;
