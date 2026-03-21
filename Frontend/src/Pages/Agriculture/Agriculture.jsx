import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const [records, setRecords] = useState([])
    const API_URL = "http://localhost:5000/api/agriculture";
    /* Fetch records from backend on mount */
    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await axios.get(API_URL);
            // Parse 'details' JSON string if necessary
            const formatted = res.data.map(r => ({
                ...r,
                expenses: typeof r.details === 'string' ? JSON.parse(r.details) : (r.details || [])
            }));
            setRecords(formatted);
        } catch (err) {
            console.error("Error fetching records:", err);
        }
    };

    /* local storage save for current session state ONLY */
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

    const saveRecord = async () => {
        if (expenses.length === 0) {
            setMsg("खर्च नोंदवला नाही,जतन होणार नाही");
            setTimeout(() => setMsg(""), 2000);
            return;
        }

        const newRecord = {
            crop,
            season,
            land,
            totalExpense,
            income,
            profit,
            loss,
            details: expenses // Details will be stored as JSON
        }

        try {
            await axios.post(API_URL, newRecord);
            setMsg("नोंद जतन झाली");
            fetchRecords(); // Refresh list
            setTimeout(() => setMsg(""), 2000);
        } catch (err) {
            setMsg("जतन करताना त्रुटी आली");
            console.error(err);
        }
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

    const deleteRecord = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setMsg("नोंद हटवली");
            fetchRecords(); // Refresh list
            setTimeout(() => setMsg(""), 2000);
        } catch (err) {
            setMsg("हटवताना त्रुटी आली");
            console.error(err);
        }
    }

    const MultiSelect = ({ options, selected, onChange, placeholder }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState("");

        const filteredOptions = options.filter(opt => {
            const search = searchTerm.toLowerCase();
            return (
                opt.mr.toLowerCase().includes(search) ||
                (opt.en && opt.en.toLowerCase().includes(search))
            );
        });

        const isExactMatch = options.some(opt =>
            opt.mr.toLowerCase() === searchTerm.toLowerCase() ||
            (opt.en && opt.en.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return (
            <div className="multi-select-container">
                <div className="multi-select-header" onClick={() => setIsOpen(!isOpen)}>
                    <input
                        type="text"
                        className="multi-select-input"
                        placeholder={selected && selected.length > 0 ? selected.join(", ") : placeholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!isOpen) setIsOpen(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && searchTerm === '' && selected.length > 0) {
                                onChange(selected.slice(0, -1));
                            }
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking input
                    />
                    <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
                </div>
                {isOpen && (
                    <div className="multi-select-options">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <div
                                    key={opt.mr}
                                    className={`multi-select-option ${selected.includes(opt.mr) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (selected.includes(opt.mr)) {
                                            onChange(selected.filter(s => s !== opt.mr));
                                        } else {
                                            onChange([...selected, opt.mr]);
                                        }
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(opt.mr)}
                                        readOnly
                                    />
                                    <span>{opt.mr}</span>
                                </div>
                            ))
                        ) : (
                            searchTerm && !isExactMatch && (
                                <div
                                    className="multi-select-option add-new"
                                    onClick={() => {
                                        onChange([...selected, searchTerm]);
                                        setSearchTerm("");
                                    }}
                                >
                                    <i className="bi bi-plus-circle"></i>
                                    <span>"{searchTerm}" जोडा</span>
                                </div>
                            )
                        )}
                        {searchTerm && filteredOptions.length > 0 && !isExactMatch && (
                            <div
                                className="multi-select-option add-new"
                                onClick={() => {
                                    onChange([...selected, searchTerm]);
                                    setSearchTerm("");
                                }}
                            >
                                <i className="bi bi-plus-circle"></i>
                                <span>"{searchTerm}" जोडा</span>
                            </div>
                        )}
                        {!searchTerm && filteredOptions.length === 0 && (
                            <div className="no-options">निवडण्यासाठी काहीही नाही</div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const machineOptions = [
        { mr: "ट्रॅक्टर नांगरणी", en: "tractor nangarni ploughing" },
        { mr: "रोटाव्हेटर", en: "rotavator rotawtor" },
        { mr: "जमीन समतल करणे", en: "leveling land leveling" },
        { mr: "सरी तयार करणे", en: "sari making ridges" },
        { mr: "माती भुसभुशीत करणे", en: "tilling soil tilling" },
        { mr: "माती उलटणे", en: "soil turning" },
        { mr: "ट्रॉलीने शेणखत आणणे", en: "manure trolley" },
        { mr: "शेणखत पसरवणे", en: "manure spreading" }
    ];

    const seedOptions = [
        { mr: "गहू बियाणे", en: "wheat gehu" },
        { mr: "तांदूळ बियाणे", en: "rice tandul" },
        { mr: "कापूस बियाणे", en: "cotton kapus" },
        { mr: "ऊस रोपे", en: "sugarcane uss" },
        { mr: "कांदा बियाणे", en: "onion kanda" },
        { mr: "ज्वारी बियाणे", en: "jowar sorted sorghum" },
        { mr: "बाजरी बियाणे", en: "bajra pearl millet" },
        { mr: "मका बियाणे", en: "maize corn maka" },
        { mr: "तूर बियाणे", en: "tur pigeon pea" },
        { mr: "हरभरा बियाणे", en: "harbhara chickpea" },
        { mr: "चना बियाणे", en: "chana gram" },
        { mr: "मूग बियाणे", en: "moong mung" },
        { mr: "उडीद बियाणे", en: "urad black gram" },
        { mr: "मसूर बियाणे", en: "masoor lentil" },
        { mr: "वाल बियाणे", en: "val field bean" },
        { mr: "चवळी बियाणे", en: "chavli cowpea" },
        { mr: "मटकी बियाणे", en: "matki moth bean" },
        { mr: "सोयाबीन बियाणे", en: "soyabean soybean" },
        { mr: "भुईमूग बियाणे", en: "groundnut peanuts bhuimug" },
        { mr: "तीळ बियाणे", en: "til sesame" },
        { mr: "मोहरी बियाणे", en: "mohari mustard" },
        { mr: "सूर्यफूल बियाणे", en: "sunflower suryaful" },
        { mr: "करडई बियाणे", en: "kardai safflower" },
        { mr: "अळशी बियाणे", en: "alshi linseed" },
        { mr: "हळद बियाणे", en: "halad turmeric" },
        { mr: "आले बियाणे", en: "ale ginger" },
        { mr: "लसूण बियाणे", en: "lasun garlic" },
        { mr: "बटाटा बियाणे", en: "batata potato" },
        { mr: "टोमॅटो बियाणे", en: "tomato" },
        { mr: "वांगी बियाणे", en: "vangi brinjal" },
        { mr: "भेंडी बियाणे", en: "bhendi okra lady finger" },
        { mr: "मिरची बियाणे", en: "mirchi chilli" },
        { mr: "कोबी बियाणे", en: "kobi cabbage" },
        { mr: "फुलकोबी बियाणे", en: "fulkobi cauliflower" },
        { mr: "पालक बियाणे", en: "palak spinach" },
        { mr: "मेथी बियाणे", en: "methi fenugreek" },
        { mr: "दोडका बियाणे", en: "dodka sponge gourd" },
        { mr: "घेवडा बियाणे", en: "ghevda beans" },
        { mr: "कारले बियाणे", en: "karle bitter gourd" },
        { mr: "भोपळा बियाणे", en: "bhopla pumpkin" },
        { mr: "काकडी बियाणे", en: "kakdi cucumber" },
        { mr: "गाजर बियाणे", en: "gajar carrot" },
        { mr: "बीट बियाणे", en: "beet beet root" },
        { mr: "शेवगा रोपे", en: "shevga drumstick" },
        { mr: "आंबा रोपे", en: "amba mango" },
        { mr: "केळी रोपे", en: "keli banana" },
        { mr: "संत्रा रोपे", en: "santra orange" },
        { mr: "मोसंबी रोपे", en: "mosambi sweet lime" },
        { mr: "डाळिंब रोपे", en: "dalimb pomegranate" },
        { mr: "द्राक्षे रोपे", en: "draksha grapes" },
        { mr: "पेरू रोपे", en: "peru guava" },
        { mr: "लिंबू रोपे", en: "limbu lemon" },
        { mr: "सीताफळ रोपे", en: "sitafal custard apple" },
        { mr: "चिकू रोपे", en: "chiku sapota" },
        { mr: "जांभूळ रोपे", en: "jambhul jamun" },
        { mr: "पपई रोपे", en: "papai papaya" },
        { mr: "अननस रोपे", en: "ananas pineapple" },
        { mr: "नारळ रोपे", en: "naral coconut" },
        { mr: "सुपारी रोपे", en: "supari arecanut" },
        { mr: "धणे बियाणे", en: "dhane coriander" },
        { mr: "जिरे बियाणे", en: "jire cumin" },
        { mr: "बडीशेप बियाणे", en: "badishep fennel" },
        { mr: "मेथीदाणे बियाणे", en: "methidane" },
        { mr: "काळीमिरी बियाणे", en: "kalimiri black pepper" }
    ];

    const fertilizerOptions = [
        { mr: "खत", en: "khat fertilizer manure" },
        { mr: "औषध", en: "aushadh medicine pesticide" },
        { mr: "फवारणी", en: "favarni spraying" }
    ];

    const labourOptions = [
        { mr: "रोप लावणी मजुरी", en: "rop lavani planting labour" },
        { mr: "बियाणे पेरणी मजुरी", en: "sowing perni labour" },
        { mr: "तण काढणे मजुरी", en: "weeding tan kadhne labour" },
        { mr: "खत टाकणे मजुरी", en: "fertilizing labour mapping" },
        { mr: "औषध फवारणी मजुरी", en: "spraying labour mapping" },
        { mr: "पाणी देणे मजुरी", en: "watering irrigation labour" },
        { mr: "कापणी मजुरी", en: "harvesting kapni labour" },
        { mr: "माल गोळा करणे मजुरी", en: "packing collecting labour" }
    ];

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
                        <MultiSelect
                            options={machineOptions}
                            selected={item ? item.split(", ").filter(x => x) : []}
                            onChange={(vals) => setItem(vals.join(", "))}
                            placeholder="मशीन / काम निवडा"
                        />
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
                        <MultiSelect
                            options={seedOptions}
                            selected={item ? item.split(", ").filter(x => x) : []}
                            onChange={(vals) => setItem(vals.join(", "))}
                            placeholder="बियाणे निवडा"
                        />
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
                        <MultiSelect
                            options={fertilizerOptions}
                            selected={item ? item.split(", ").filter(x => x) : []}
                            onChange={(vals) => setItem(vals.join(", "))}
                            placeholder="खत / औषध निवडा"
                        />
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
                        <MultiSelect
                            options={labourOptions}
                            selected={item ? item.split(", ").filter(x => x) : []}
                            onChange={(vals) => setItem(vals.join(", "))}
                            placeholder="मजुरी प्रकार निवडा"
                        />
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
                        <div className="table-wrapper">
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
                        </div>
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
                            <button onClick={saveRecord}>जतन करा</button>
                            <button onClick={() => setStep(10)}>खर्च यादी</button>
                        </div>
                    </div>
                )}
                {step === 10 && (
                    <div className="listPageContainer">
                        <h3>खर्च यादी</h3>
                        <div className="listPage">
                            {records.map((r, i) => (
                                <div className="recordCard" key={r.id || i}>
                                    <h4>पिक : {r.crop}</h4>
                                    <p>जमीन : {r.land}</p>
                                    <p>एकूण खर्च : ₹ {r.totalExpense}</p>
                                    <p>एकूण उत्पन्न : ₹ {r.income}</p>
                                    <p style={{ color: "green" }}>नफा : ₹ {r.profit}</p>
                                    <p style={{ color: "red" }}>तोटा : ₹ {r.loss}</p>
                                    <div className="cardActions">
                                        <i className="bi bi-x-circle deleteCross" onClick={() => deleteRecord(r.id)}></i>
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



