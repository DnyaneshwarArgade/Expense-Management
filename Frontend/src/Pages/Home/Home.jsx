import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaWallet, FaLeaf, FaHome, FaGraduationCap, FaCar, FaCalendarAlt } from "react-icons/fa";

function Home() {

const navigate = useNavigate();
const [showForm,setShowForm] = useState(false);

useEffect(() => {
  if (showForm) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}, [showForm]);

return (

<div className="dashboard">

<div className="header"></div>

<div className="summary">

<div className="box income">
<h3>उत्पन्न</h3>
<h1>₹50,000</h1>
</div>

<div className="box expense">
<h3>खर्च</h3>
<h1>₹23,500</h1>
</div>

</div>


<div className="addExpensee" onClick={()=>setShowForm(true)}>
<FaPlus className="plus"/>
<span>खर्च जोडा</span>
</div>

<h2 className="title">वर्ग</h2>

<div className="categories">

<div className="category" onClick={()=>navigate("/personal-expense")}>
<div className="icon orange"><FaWallet/></div>
<p>दैनिक खर्च</p>
</div>

<div className="category" onClick={()=>navigate("/agriculture")}>
<div className="icon green"><FaLeaf/></div>
<p>शेती</p>
</div>

<div className="category" onClick={()=>navigate("/construction")}>
<div className="icon blue"><FaHome/></div>
<p>बांधकाम</p>
</div>

<div className="category" onClick={()=>navigate("/education")}>
<div className="icon yellow"><FaGraduationCap/></div>
<p>शिक्षण</p>
</div>

{/* NEW CATEGORY */}

<div className="category" onClick={()=>navigate("/vehicle")}>
<div className="icon purple"><FaCar/></div>
<p>वाहन</p>
</div>

<div className="category" onClick={()=>navigate("/functions")}>
<div className="icon pink"><FaCalendarAlt/></div>
<p>कार्यक्रम</p>
</div>

</div>


{/* Expense Form */}

{showForm && (

<div className="overlay">

<div className="expenseForm">

<div className="formHeader">
<h2>खर्च जोडा</h2>
<span className="cancelIcon" onClick={()=>setShowForm(false)}>❌</span>
</div>

<label>खर्च प्रकार</label>
<select className="inputField">
<option>सर्वच प्रकार</option>
<option>दैनिक खर्च</option>
<option>शेती</option>
<option>बांधकाम</option>
<option>शिक्षण</option>
<option>कार्यक्रम</option>
<option>वाहन</option>
</select>

<label>रक्कम</label>
<input type="number" className="inputField" placeholder="₹ 0"/>

<label>फोटो / बिल अपलोड</label>
<input type="file" className="inputField"/>

<label>Note</label>
<textarea className="inputField textarea"></textarea>

<button className="saveButton">जोडा</button>

</div>

</div>

)}

</div>

)

}

export default Home;