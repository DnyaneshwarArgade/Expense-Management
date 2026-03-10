import React, { useState, useEffect } from "react";
import "./Agriculture.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Agri() {
    const [step, setStep] = useState(1)
    const [crop, setCrop] = useState("")
    const [season, setSeason] = useState("")
    const [land, setLand] = useState("")
    const [item, setItem] = useState("")
    const [cost, setCost] = useState("")
    const [expenses, setExpenses] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [msg, setMsg] = useState("")
    const [production, setProduction] = useState("")
    const [price, setPrice] = useState("")
    const [fertilizer, setFertilizer] = useState([])
    const [deletedItem, setDeletedItem] = useState(null);
    const [labourWork, setLabourWork] = useState("")
    /* local storage save */
    useEffect(() => {
        const data = localStorage.getItem("agriData")
        if (data) {
            const parsed = JSON.parse(data)
            setExpenses(parsed.expenses || [])
            setCrop(parsed.crop || "")
            setSeason(parsed.season || "")
            setLand(parsed.land || "")
        }
    }, [])
    useEffect(() => {
        localStorage.setItem("agriData",
            JSON.stringify({ expenses, crop, season, land })
        )
    }, [expenses, crop, season, land])
    /* expense add */
    const addExpense = () => {
        if (item === "" || cost === "") return
        setExpenses([
            ...expenses,
            { item, cost: Number(cost) }
        ])
        setItem("")
        setCost("")
    }
    /* delete */
    const deleteExpense = (index) => {
        const removed = expenses[index];
        setDeletedItem(removed);
        const newExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(newExpenses);
        setTimeout(() => {
            setDeletedItem(null);
        }, 2000);
    };
    /* edit */
    const openEdit = (index) => {
        setEditIndex(index)
        setItem(expenses[index].item)
        setCost(expenses[index].cost)
    }
    const saveEdit = () => {
        const data = [...expenses]
        data[editIndex] = { item, cost: Number(cost) }
        setExpenses(data)
        setEditIndex(null)
        setItem("")
        setCost("")
    }

    const handleFertilizer = (e) => {
        const value = e.target.value
        if (e.target.checked) {
            setFertilizer([...fertilizer, value])
            setItem([...fertilizer, value].join(", "))
        }
        else {
            const data = fertilizer.filter(v => v !== value)
            setFertilizer(data)
            setItem(data.join(", "))
        }
    }
    /* calculations */
    const totalExpense = expenses.reduce((a, b) => a + b.cost, 0)
    const income = production * price
    const difference = income - totalExpense
    const profit = difference > 0 ? difference : 0
    const loss = difference < 0 ? Math.abs(difference) : 0

    const saveRecord = () => {
        if (expenses.length === 0) {
            setMsg("खर्च नोंदवला नाही,जतन होणार नाही");
            setTimeout(() => setMsg(""), 2000);
            return;
        }
        const old = JSON.parse(localStorage.getItem("records")) || []
        const newRecord = {
            crop,
            season,
            land,
            expenses,
            totalExpense,
            income,
            profit,
            loss
        }
        old.push(newRecord)
        localStorage.setItem("records", JSON.stringify(old))
        setMsg("नोंद जतन झाली");
        setTimeout(() => setMsg(""), 2000);
    }
    const newCrop = () => {
        setCrop("")
        setSeason("")
        setLand("")
        setItem("")
        setCost("")
        setExpenses([])
        setProduction("")
        setPrice("")
        setFertilizer([])
        setStep(1)
    }

    const deleteRecord = (index) => {
        const allRecords = JSON.parse(localStorage.getItem("records") || "[]");
        allRecords.splice(index, 1);  // remove selected record permanently
        localStorage.setItem("records", JSON.stringify(allRecords));
        setMsg("Record deleted");      // optional
        setTimeout(() => setMsg(""), 2000);
    }

    return (
        <div className="agriPage">
            <div className="container">
                <h2>शेती खर्च व्यवस्थापन</h2>
                {msg && <div className="msg">{msg}</div>}
                {/* INTRODUCTION */}
                {step === 1 && (
                    <div>
                        <h3>परिचय</h3>
                        <p className="intro">
                            शेती करताना जमीन तयारी, बियाणे, खत, औषध, मजुरी असे अनेक खर्च
                            होतात. या प्रणालीमुळे शेतकरी आपले सर्व खर्च एका ठिकाणी नोंदवू शकतो
                            आणि शेवटी एकूण खर्च, उत्पन्न, नफा किंवा तोटा सहज पाहू शकतो.
                            ही प्रणाली वापरून प्रत्येक पिका साठी खर्च वेगळा साठवता येतो
                            आणि नंतर कधीही पाहता येतो.
                        </p>
                        <button onClick={() => setStep(10)}>खर्च यादी</button>
                        <button onClick={() => setStep(2)}>पुढे</button>
                    </div>
                )}
                {/* CROP INFO */}
                {step === 2 && (
                    <div>
                        <h3>पिक माहिती</h3>
                        <input
                            list="crop"
                            placeholder="पिक निवडा किंवा लिहा"
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                        />
                        <datalist id="crop">
                            <option value="गहू" />
                            <option value="तांदूळ" />
                            <option value="कापूस" />
                            <option value="ऊस" />
                            <option value="कांदा" />
                            <option value="ज्वारी" />
                            <option value="बाजरी" />
                            <option value="मका" />
                            <option value="तूर" />
                            <option value="हरभरा" />
                            <option value="चना" />
                            <option value="मूग" />
                            <option value="उडीद" />
                            <option value="मसूर" />
                            <option value="वाल" />
                            <option value="चवळी" />
                            <option value="मटकी" />
                            <option value="सोयाबीन" />
                            <option value="भुईमूग" />
                            <option value="तीळ" />
                            <option value="मोहरी" />
                            <option value="सूर्यफूल" />
                            <option value="करडई" />
                            <option value="अळशी" />
                            <option value="हळद" />
                            <option value="आले" />
                            <option value="लसूण" />
                            <option value="बटाटा" />
                            <option value="टोमॅटो" />
                            <option value="वांगी" />
                            <option value="भेंडी" />
                            <option value="मिरची" />
                            <option value="कोबी" />
                            <option value="फुलकोबी" />
                            <option value="पालक" />
                            <option value="मेथी" />
                            <option value="दोडका" />
                            <option value="घेवडा" />
                            <option value="कारले" />
                            <option value="भोपळा" />
                            <option value="काकडी" />
                            <option value="गाजर" />
                            <option value="बीट" />
                            <option value="शेवगा" />
                            <option value="आंबा" />
                            <option value="केळी" />
                            <option value="संत्रा" />
                            <option value="मोसंबी" />
                            <option value="डाळिंब" />
                            <option value="द्राक्षे" />
                            <option value="पेरू" />
                            <option value="लिंबू" />
                            <option value="सीताफळ" />
                            <option value="चिकू" />
                            <option value="जांभूळ" />
                            <option value="पपई" />
                            <option value="अननस" />
                            <option value="नारळ" />
                            <option value="सुपारी" />
                            <option value="धणे" />
                            <option value="जिरे" />
                            <option value="बडीशेप" />
                            <option value="मेथीदाणे" />
                            <option value="काळीमिरी" />
                        </datalist>
                        <input
                            type="number"
                            placeholder="जमीन (एकर)"
                            value={land}
                            onChange={(e) => setLand(e.target.value)}
                        />
                        <div className="navBtn">
                            <button onClick={() => setStep(1)}>मागे</button>
                            <button onClick={() => setStep(3)}>पुढे</button>
                        </div>
                    </div>
                )}
                {/* LAND PREPARATION */}
                {step === 3 && (
                    <div>
                        <h3>जमीन तयारी खर्च</h3>
                        <input
                            list="machineWork"
                            placeholder="मशीन / काम"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                        />
                        <datalist id="machineWork">
                            <option value="ट्रॅक्टर नांगरणी"></option>
                            <option value="रोटाव्हेटर"></option>
                            <option value="जमीन समतल करणे"></option>
                            <option value="सरी तयार करणे"></option>
                            <option value="माती भुसभुशीत करणे"></option>
                            <option value="माती उलटणे"></option>
                            <option value="ट्रॉलीने शेणखत आणणे"></option>
                            <option value="शेणखत पसरवणे"></option>
                        </datalist>
                        <input
                            type="number"
                            placeholder="खर्च"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            onBlur={addExpense}
                        />
                        <div className="navBtn">
                            <button onClick={() => setStep(2)}>मागे</button>
                            <button onClick={() => setStep(4)}>पुढे</button>
                        </div>
                    </div>
                )}
                {/* SEED */}
                {step === 4 && (
                    <div>
                        <h3>बियाणे खर्च</h3>
                        <input
                            list="seed"
                            placeholder="बियाणे निवडा"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                        />
                        <datalist id="seed">
                            <option value="गहू बियाणे"></option>
                            <option value="तांदूळ बियाणे"></option>
                            <option value="कापूस बियाणे"></option>
                            <option value="ऊस रोपे"></option>
                            <option value="कांदा बियाणे"></option>
                            <option value="ज्वारी बियाणे"></option>
                            <option value="बाजरी बियाणे"></option>
                            <option value="मका बियाणे"></option>
                            <option value="तूर बियाणे"></option>
                            <option value="हरभरा बियाणे"></option>
                            <option value="चना बियाणे"></option>
                            <option value="मूग बियाणे"></option>
                            <option value="उडीद बियाणे"></option>
                            <option value="मसूर बियाणे"></option>
                            <option value="वाल बियाणे"></option>
                            <option value="चवळी बियाणे"></option>
                            <option value="मटकी बियाणे"></option>
                            <option value="सोयाबीन बियाणे"></option>
                            <option value="भुईमूग बियाणे"></option>
                            <option value="तीळ बियाणे"></option>
                            <option value="मोहरी बियाणे"></option>
                            <option value="सूर्यफूल बियाणे"></option>
                            <option value="करडई बियाणे"></option>
                            <option value="अळशी बियाणे"></option>
                            <option value="हळद बियाणे"></option>
                            <option value="आले बियाणे"></option>
                            <option value="लसूण बियाणे"></option>
                            <option value="बटाटा बियाणे"></option>
                            <option value="टोमॅटो बियाणे"></option>
                            <option value="वांगी बियाणे"></option>
                            <option value="भेंडी बियाणे"></option>
                            <option value="मिरची बियाणे"></option>
                            <option value="कोबी बियाणे"></option>
                            <option value="फुलकोबी बियाणे"></option>
                            <option value="पालक बियाणे"></option>
                            <option value="मेथी बियाणे"></option>
                            <option value="दोडका बियाणे"></option>
                            <option value="घेवडा बियाणे"></option>
                            <option value="कारले बियाणे"></option>
                            <option value="भोपळा बियाणे"></option>
                            <option value="काकडी बियाणे"></option>
                            <option value="गाजर बियाणे"></option>
                            <option value="बीट बियाणे"></option>
                            <option value="शेवगा रोपे"></option>

                            <option value="आंबा रोपे"></option>
                            <option value="केळी रोपे"></option>
                            <option value="संत्रा रोपे"></option>
                            <option value="मोसंबी रोपे"></option>
                            <option value="डाळिंब रोपे"></option>
                            <option value="द्राक्षे रोपे"></option>
                            <option value="पेरू रोपे"></option>
                            <option value="लिंबू रोपे"></option>
                            <option value="सीताफळ रोपे"></option>
                            <option value="चिकू रोपे"></option>
                            <option value="जांभूळ रोपे"></option>
                            <option value="पपई रोपे"></option>
                            <option value="अननस रोपे"></option>
                            <option value="नारळ रोपे"></option>
                            <option value="सुपारी रोपे"></option>

                            <option value="धणे बियाणे"></option>
                            <option value="जिरे बियाणे"></option>
                            <option value="बडीशेप बियाणे"></option>
                            <option value="मेथीदाणे बियाणे"></option>
                            <option value="काळीमिरी बियाणे"></option>
                        </datalist>
                        <input
                            type="number"
                            placeholder="किंमत"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            onBlur={addExpense}
                        />
                        <div className="navBtn">
                            <button onClick={() => setStep(3)}>मागे</button>
                            <button onClick={() => setStep(5)}>पुढे</button>
                        </div>
                    </div>
                )}
                {/* FERTILIZER MULTI */}
                {step === 5 && (
                    <div>
                        <h3>खत / औषध खर्च</h3>
                        <select
                            multiple
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setFertilizer(selected);
                                setItem(selected.join(", "));
                            }}
                        >
                            <option value="खत">खत</option>
                            <option value="औषध">औषध</option>
                            <option value="फवारणी">फवारणी</option>
                        </select>
                        <input
                            type="number"
                            placeholder="खर्च"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            onBlur={addExpense}
                        />
                        <div className="navBtn">
                            <button onClick={() => setStep(4)}>मागे</button>
                            <button onClick={() => setStep(6)}>पुढे</button>
                        </div>
                    </div>
                )}
                {step === 6 && (
                    <div>
                        <h3>मजुरी खर्च</h3>

                        <input
                            list="labour"
                            placeholder="मजुरी प्रकार"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                        />
                        <datalist id="labour">
                            <option value="रोप लावणी मजुरी"></option>
                            <option value="बियाणे पेरणी मजुरी"></option>
                            <option value="तण काढणे मजुरी"></option>
                            <option value="खत टाकणे मजुरी"></option>
                            <option value="औषध फवारणी मजुरी"></option>
                            <option value="पाणी देणे मजुरी"></option>
                            <option value="कापणी मजुरी"></option>
                            <option value="माल गोळा करणे मजुरी"></option>
                        </datalist>
                        <input
                            type="number"
                            placeholder="खर्च"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            onBlur={addExpense}
                        />

                        <div className="navBtn">
                            <button onClick={() => setStep(5)}>मागे</button>
                            <button onClick={() => setStep(7)}>पुढे</button>
                        </div>
                    </div>
                )}
                {/* EXPENSE TABLE */}
                {deletedItem && (
                    <div className="deleteCard">
                        ❌ खर्च delete झाला: {deletedItem.item} - ₹{deletedItem.cost}
                    </div>
                )}
                {step === 7 && (
                    <div>
                        <h3>एकूण खर्च</h3>
                        <table className="tableakunkharch">
                            <thead>
                                <tr>
                                    <th>उद्देश</th>
                                    <th>खर्च</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((e, i) => (
                                    <tr key={i}>
                                        <td>{e.item}</td>
                                        <td>₹ {e.cost}</td>
                                        <td>
                                            <i
                                                className="bi bi-pencil-square edit"
                                                onClick={() => openEdit(i)}
                                            ></i>
                                            <i
                                                className="bi bi-trash delete"
                                                onClick={() => deleteExpense(i)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3>Total Expense : ₹ {totalExpense}</h3>
                        <div className="navBtn">
                            <button onClick={() => setStep(6)}>मागे</button>
                            <button onClick={() => setStep(8)}>पुढे</button>
                        </div>
                    </div>
                )}
                {/* INCOME */}
                {step === 8 && (
                    <div>
                        <h3>उत्पन्न माहिती</h3>
                        <input
                            type="number"
                            placeholder="उत्पादन (क्विंटल)"
                            value={production}
                            onChange={(e) => setProduction(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="बाजार भाव"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <h3>एकूण उत्पन्न : ₹ {income}</h3>
                        <h3>एकूण खर्च : ₹ {totalExpense}</h3>
                        <h3 style={{ color: "green" }}>नफा : ₹ {profit}</h3>
                        <h3 style={{ color: "red" }}>तोटा : ₹ {loss}</h3>
                        <div className="navBtn">
                            <button onClick={() => setStep(7)}>मागे</button>
                            <button onClick={() => setStep(9)}>पुढे</button>
                        </div>
                    </div>
                )}
                {step === 9 && (
                    <div className="conclusion">
                        <h3>निष्कर्ष</h3>

                        <p>पिक : {crop}</p>
                        <p>जमीन : {land} एकर</p>

                        {expenses.length === 0 ? (
                            <p style={{ color: "red" }}>कोणताही खर्च नोंदलेला नाही</p>
                        ) : (
                            <>
                                <h3>एकूण खर्च : ₹ {totalExpense}</h3>
                                <h3>एकूण उत्पन्न : ₹ {income}</h3>
                                <h3 style={{ color: "green" }}>नफा : ₹ {profit}</h3>
                                <h3 style={{ color: "red" }}>तोटा : ₹ {loss}</h3>
                            </>
                        )}

                        <div className="conclusionButtons">
                            <button onClick={() => setStep(8)}>मागे</button>
                            <button onClick={saveRecord}>Save</button>
                            <button onClick={() => setStep(10)}>खर्च यादी</button>
                        </div>
                    </div>
                )}
                {step === 10 && (
                    <div className="listPageContainer">
                        <h3>खर्च यादी</h3>
                        <div className="listPage">
                            {JSON.parse(localStorage.getItem("records") || "[]").map((r, i) => (
                                <div className="recordCard" key={i}>
                                    <h4>पिक : {r.crop}</h4>
                                    <p>जमीन : {r.land}</p>
                                    <p>एकूण खर्च : ₹ {r.totalExpense}</p>
                                    <p>एकूण उत्पन्न : ₹ {r.income}</p>
                                    <p style={{ color: "green" }}>नफा : ₹ {r.profit}</p>
                                    <p style={{ color: "red" }}>तोटा : ₹ {r.loss}</p>
                                    <div className="cardActions">
                                        <i className="bi bi-x-circle deleteCross" onClick={() => deleteRecord(i)}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="listPageButtonWrapper">
                            <button onClick={() => setStep(9)}>मागे</button>
                            <button onClick={newCrop}>नवीन पिक</button>
                        </div>
                    </div>
                )}
                {/* EDIT MODAL */}
                {editIndex !== null && (
                    <div className="modal">
                        <div className="modalBox">
                            <input
                                value={item}
                                onChange={(e) => setItem(e.target.value)}
                            />
                            <input
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                            <button onClick={saveEdit} className="saveBtn">जतन करा</button>
                            <button
                                className="closeBtn"
                                onClick={() => setEditIndex(null)}
                            >
                                बंद करा
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Agri



