
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
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

const pageFormats = ["A4", "A3", "Letter", "Legal"]; // Add more formats if needed
const colors = ["Black/White", "Color"]; // Add more colors if needed

function OverallSubmit() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [percent, setPercent] = useState(0);
  const [fileLink, setFileLink] = useState("");
  const [cashValue, setCashValue] = useState(10);

  const schema = yup.object().shape({
    documentType: yup.string().required("Document Type is required"),
    pageFormat: yup.string().required("Page Format is required"),
    color: yup.string().required("Color is required"),
    pages: yup.string().required("Pages is required"),
    totalPages: yup
      .number()
      .min(1, "Total Pages must be at least 1"),
    singleSided: yup.boolean().required("Select single/back to back"),
    // cost: yup.number(),
    // ordernumber: yup.number(),
    // orderdetails: yup.string(),
     paymentOnline: yup.boolean().required("Select payment online/offline"),
    // paymentstatus: yup.bool(),
    timestamp: yup.date().default(() => new Date()),
    // transactionid: yup.string(),
    // vendor: yup.string(),
    orderDescription: yup.string().required("Order Description is required"), // Add validation for Order Description
  });

  function calculateTotalPages(input) {
    // Split the input string into an array of page ranges
    
    const ranges = input.split(',');
  
    // Initialize a variable to store the total number of pages
    let totalPages = 0;
  
    // Iterate through each range and calculate the pages used
    for (const range of ranges) {
      const parts = range.split('-');
      if (parts.length === 1) {
        // Single page number
        totalPages++;
      } else if (parts.length === 2) {
        // Page range (e.g., 1-5)
        const startPage = parseInt(parts[0]);
        const endPage = parseInt(parts[1]);
        if (!isNaN(startPage) && !isNaN(endPage) && startPage <= endPage) {
          totalPages += endPage - startPage + 1;
        }
      }
    }
  
    return totalPages;
  }

  function calculateCost(documentType, totalPages, color) {
    // Define cost rules based on document type, page format, and color
    const costRules = {
      "PDF": {
        "A4": {
          "Black/White": 1,
          "Color": 5,
        },
        "A3": {
          "Black/White": 2,
          "Color": 5,
        },
        "Letter": {
          "Black/White": 5,
          "Color": 10,
        },
        "Legal": {
          "Black/White": 1,
          "Color": 5,
        },
      },
      // Add more document types and rules as needed
    };
  
    // Check if the provided document type is in the cost rules
    if (costRules.hasOwnProperty(documentType)) {
      // Get the cost rules for the provided document type
      const documentTypeRules = costRules[documentType];
  
      // Check if the total pages and color are in the rules
      if (
        documentTypeRules.hasOwnProperty(totalPages) &&
        documentTypeRules[totalPages].hasOwnProperty(color)
      ) {
        // Return the cost based on the rules
        return documentTypeRules[totalPages][color];
      }
    }
  
    // Return -1 to indicate that the cost couldn't be determined
    return -1;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "orders");

  const onSubmitOrder = async (data) => {
    if(fileUpload == null){
      alert("Please upload the file");
      return;
     
    }
    const totalPages = calculateTotalPages(data.pages);

    // Add the calculated total pages to the form data
    data.totalPages = totalPages;
    

   
    console.log(fileLink);
    const docRef = await addDoc(postsRef, {
      ...data,
      size: fileUpload.size,
      filepath: fileLink,
      user: user?.displayName,
      userid: user?.uid,
      completeStatus: false,
      approval: false
    });

    var storeref = doc(db, `orders/${docRef.id}`)
    var docR = await getDoc(storeref);
    console.log(docR.data())
    setCashValue(calculateCost(docR.data().documentType, docR.data().totalPages, docR.data().color))
    console.log(docRef.id)
    
    const TransferData = {
      orderid: docRef.id,
      cost: cashValue
    }
    if(docR.data().paymentOnline){
    navigate("/order_payment", {
      state: TransferData
    });
  }
  else{
    
  alert(`The cost of order is ${cashValue}, you have to complete payment on delivery`)
  navigate('/');
  }
  };

  function handleChange(event) {
    setFileUpload(event.target.files[0]);
  }

  const handleUpload = (e) => {
    
    if (!fileUpload) {
      alert("Please upload the file first!");
    }

    const newFilename = `/files/${v4() + fileUpload.name}`;
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
    <div style={{justifyContent: "center", width: "50%", justifySelf: "center"}}>
     <form onSubmit={handleSubmit(onSubmitOrder)}>
        <div>
          <label>Document Type</label>
          <select style={inputStyle} {...register("documentType")}>
            <option value="PDF">PDF</option>
            <option value="docx">docx</option>
            <option value="image">JPG/PNG</option>
            {/* Add more document types as needed */}
          </select>
          <p style={errorStyle}>{errors.documentType?.message}</p>
        </div>
        <div>
          <label>Page Format</label>
          <select style={inputStyle} {...register("pageFormat")}>
            {pageFormats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
          <p style={errorStyle}>{errors.pageFormat?.message}</p>
        </div>
        <div>
          <label>Color</label>
          <select style={inputStyle} {...register("color")}>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          <p style={errorStyle}>{errors.color?.message}</p>
        </div>
        <div>
          <label>Pages</label>
          <input
            style={inputStyle}
            placeholder="Pages (e.g., 1-5 or 2, 4, 6)"
    
            {...register("pages")}
            
          />
          <p style={errorStyle}>{errors.pages?.message}</p>
        </div>
    
        <div>
          <label>Single Sided</label>
          <div>
            <label>
              <input
                type="radio"
                value={true}
                {...register("singleSided")}
              />
              Single Sided
            </label>
            <label>
              <input
                type="radio"
                value={false}
                {...register("singleSided")}
              />
              Back to Back
            </label>
          </div>
          <p style={errorStyle}>{errors.singleSided?.message}</p>
        </div>
        <div>
          <label>Order Description</label>
          <input
            style={inputStyle}
            placeholder="Order Description"
            {...register("orderDescription")}
          />
          <p style={errorStyle}>{errors.orderDescription?.message}</p>
        </div>
        <div>
            <label>
              <input
                type="radio"
                value={true}
                {...register("paymentOnline")}
              />
              Online (UPI/Card/Netbanking)
            </label>
            <label>
              <input
                type="radio"
                value={false}
                {...register("paymentOnline")}
              />
              Cash/Offline (COD)
            </label>
          </div>
          
        <input type="submit" />
        </form>
        {/* Add the rest of the form fields as needed */}
        <div style={containerStyle}>
        <input type="file" onChange={handleChange} style={inputStyle} />
        <p>{percent}% done</p>
        <button style={buttonStyle} onClick={e=>handleUpload(e)}>Upload Files</button>
      </div>
      
      
      
    </div>
  );
}

export default OverallSubmit;

