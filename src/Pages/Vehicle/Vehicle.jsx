import React, { useState } from "react";
import "./Vehicle.css";

function Vehicle() {

const [activeTab, setActiveTab] = useState("vehicle");

const [vehicles, setVehicles] = useState([]);
const [fuelData, setFuelData] = useState([]);
const [maintenanceData, setMaintenanceData] = useState([]);

const [vehicleForm, setVehicleForm] = useState({
name:"",
number:"",
type:"",
company:""
});

const [fuelForm, setFuelForm] = useState({
date:"",
vehicle:"",
liter:"",
cost:""
});

const [maintenanceForm, setMaintenanceForm] = useState({
date:"",
vehicle:"",
repair:"",
cost:""
});

const handleVehicleChange = (e)=>{
setVehicleForm({...vehicleForm,[e.target.name]:e.target.value});
};

const handleFuelChange = (e)=>{
setFuelForm({...fuelForm,[e.target.name]:e.target.value});
};

const handleMaintenanceChange = (e)=>{
setMaintenanceForm({...maintenanceForm,[e.target.name]:e.target.value});
};

const addVehicle = ()=>{
setVehicles([...vehicles,vehicleForm]);
setVehicleForm({name:"",number:"",type:"",company:""});
};

const deleteVehicle = (index)=>{
const updated = vehicles.filter((v,i)=> i!==index);
setVehicles(updated);
};

const editVehicle = (index)=>{
const v = vehicles[index];

setVehicleForm({
name:v.name,
number:v.number,
type:v.type,
company:v.company
});

deleteVehicle(index);
};

const addFuel = ()=>{
setFuelData([...fuelData,fuelForm]);
setFuelForm({date:"",vehicle:"",liter:"",cost:""});
};

const addMaintenance = ()=>{
setMaintenanceData([...maintenanceData,maintenanceForm]);
setMaintenanceForm({date:"",vehicle:"",repair:"",cost:""});
};

const totalFuel = fuelData.reduce((a,b)=>a+Number(b.cost),0);
const totalMaintenance = maintenanceData.reduce((a,b)=>a+Number(b.cost),0);

return (

<div className="vehicle-page">

<h1 className="title">🚜 वाहन खर्च व्यवस्थापन</h1>

<div className="tabs">

<button onClick={()=>setActiveTab("vehicle")}>वाहन माहिती</button>

<button onClick={()=>setActiveTab("fuel")}>इंधन खर्च</button>

<button onClick={()=>setActiveTab("maintenance")}>दुरुस्ती खर्च</button>

<button onClick={()=>setActiveTab("report")}>खर्च अहवाल</button>

</div>

{/* Vehicle Page */}

{activeTab === "vehicle" && (

<div className="card">

<h2>वाहन माहिती</h2>

<input name="name" value={vehicleForm.name} onChange={handleVehicleChange} placeholder="वाहन नाव"/>

<input name="number" value={vehicleForm.number} onChange={handleVehicleChange} placeholder="वाहन क्रमांक"/>

<input name="type" value={vehicleForm.type} onChange={handleVehicleChange} placeholder="वाहन प्रकार"/>

<input name="company" value={vehicleForm.company} onChange={handleVehicleChange} placeholder="कंपनी नाव"/>

<button className="add-btn" onClick={addVehicle}>वाहन जोडा</button>

<table>

<thead>
<tr>
<th>वाहन नाव</th>
<th>क्रमांक</th>
<th>प्रकार</th>
<th>कंपनी</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{vehicles.map((v,i)=>(

<tr key={i}>
<td>{v.name}</td>
<td>{v.number}</td>
<td>{v.type}</td>
<td>{v.company}</td>

<td>
<button onClick={()=>editVehicle(i)}>Edit</button>
<button onClick={()=>deleteVehicle(i)}>Delete</button>
</td>

</tr>

))}

</tbody>

</table>

</div>

)}

{/* Fuel Page */}

{activeTab === "fuel" && (

<div className="card">

<h2>⛽ इंधन खर्च</h2>

<input
type="date"
name="date"
value={fuelForm.date}
onChange={handleFuelChange}
/>

<select
name="vehicle"
value={fuelForm.vehicle}
onChange={handleFuelChange}
>

<option value="">वाहन निवडा</option>

{vehicles.map((v,i)=>(
<option key={i} value={v.name}>{v.name}</option>
))}

</select>

<input
name="liter"
value={fuelForm.liter}
onChange={handleFuelChange}
placeholder="लिटर"
/>

<input
name="cost"
value={fuelForm.cost}
onChange={handleFuelChange}
placeholder="खर्च"
/>

<button className="add-btn" onClick={addFuel}>खर्च जोडा</button>

<table>

<thead>
<tr>
<th>तारीख</th>
<th>वाहन</th>
<th>लिटर</th>
<th>खर्च</th>
</tr>
</thead>

<tbody>

{fuelData.map((f,i)=>(

<tr key={i}>
<td>{f.date}</td>
<td>{f.vehicle}</td>
<td>{f.liter}</td>
<td>₹{f.cost}</td>
</tr>

))}

</tbody>

</table>

</div>

)}

{/* Maintenance Page */}

{activeTab === "maintenance" && (

<div className="card">

<h2>🔧 दुरुस्ती खर्च</h2>

<input
type="date"
name="date"
value={maintenanceForm.date}
onChange={handleMaintenanceChange}
/>

<select
name="vehicle"
value={maintenanceForm.vehicle}
onChange={handleMaintenanceChange}
>

<option value="">वाहन निवडा</option>

{vehicles.map((v,i)=>(
<option key={i} value={v.name}>{v.name}</option>
))}

</select>

<input
name="repair"
value={maintenanceForm.repair}
onChange={handleMaintenanceChange}
placeholder="दुरुस्ती प्रकार"
/>

<input
name="cost"
value={maintenanceForm.cost}
onChange={handleMaintenanceChange}
placeholder="खर्च"
/>

<button className="add-btn" onClick={addMaintenance}>सेव्ह</button>

<table>

<thead>
<tr>
<th>तारीख</th>
<th>वाहन</th>
<th>दुरुस्ती</th>
<th>खर्च</th>
</tr>
</thead>

<tbody>

{maintenanceData.map((m,i)=>(

<tr key={i}>
<td>{m.date}</td>
<td>{m.vehicle}</td>
<td>{m.repair}</td>
<td>₹{m.cost}</td>
</tr>

))}

</tbody>

</table>

</div>

)}

{/* Report Page */}

{activeTab === "report" && (

<div className="card">

<h2>📊 खर्च रिपोर्ट</h2>

<div className="report-cards">

<div className="report-box">
<h3>एकूण इंधन खर्च</h3>
<p>₹{totalFuel}</p>
</div>

<div className="report-box">
<h3>एकूण दुरुस्ती खर्च</h3>
<p>₹{totalMaintenance}</p>
</div>

</div>

</div>

)}

</div>

);

}

export default Vehicle;