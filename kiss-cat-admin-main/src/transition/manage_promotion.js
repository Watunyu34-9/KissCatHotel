import React, { useEffect, useState } from 'react';
import '../App.css'
import { firebase } from "../backend/backend"
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import managepromotionIcon from '../asset/managepromotionIcon.png'
import search from '../asset/search.png'
import Modal from 'react-modal';
import { ModalAlert } from '../component/modal';


export default function ManagePromotion({ navigation }) {
    const isUser = firebase.auth().currentUser.uid;
    const [tableData, setTableData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
    const [isPromotionData, setPromotionData] = useState([]);
    const [isNamePromotion, setNamePromotion] = useState("");
    const [isNamePromotionEdit, setNamePromotionEdit] = useState("");
    const [isPercent, setPercent] = useState("");
    const [isPercentEdit, setPercentEdit] = useState("");
    const [isDateCreatePromotion, setDateCreatePromotion] = useState("");
    const [editItem, setEditItem] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [isModalAlert, setModalAlert] = useState(false);
    const [isModalSwitchAlert, setModalSwitchAlert] = useState(false);
    const [isManyDeletePromotion, setManyDeletePromotion] = useState(false);
    const [isCheckBoxManyDeletePromotion, setCheckBoxManyDeletePromotion] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    
    useEffect(() => {
        console.log("ManagePromotion..");
        getPromotionData();
        setCurrentDate();
    }, []);

    const getPromotionData = async () => {
        const docRef = firebase.firestore().collection('admin').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                if (data.my_promotion && data.my_promotion.length > 0) {
                    const mergedData = [
                        {
                            id: "รหัสรายการ",
                            name: "ชื่อ",
                            discount: "ส่วนลด",
                            period: "วันที่สร้างโปรโมชั่น",
                        },
                        ...data.my_promotion.map((item, index) => ({
                            id: (index + 1).toString().padStart(2, '0'), //ปรับรหัสโปรโมชั่น เลขที่เป็นหลักหน่วยให้มี 0 นำข้างหน้า
                            name: item.name,
                            discount: item.discount,
                            period: formatDateString(item.period),
                            promotion_ison: item.promotion_ison
                        }))
                    ];
                    setTableData(mergedData);
                    setPromotionData(data.my_promotion);
                } else {
                    setPromotionData([]);
                }
            }
        });
    }

    const setCurrentDate = () => {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0]
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
        const thisFormat = `${day}/${month}/${year}`;
        console.log("thisFormat: ", thisFormat);
        setDateCreatePromotion(thisFormat);
    };

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.

        return `${day}/${month}/${year}`;
    };

    const handleCheckBoxManyDeletePromotion = (rowIdx) => {
        console.log("rowIdx: ", rowIdx);
    
        const updatedCheckBoxManyDeletePromotion = [...isCheckBoxManyDeletePromotion];
        updatedCheckBoxManyDeletePromotion[rowIdx] = !updatedCheckBoxManyDeletePromotion[rowIdx];
        console.log("updatedCheckBoxManyDeletePromotion: ", updatedCheckBoxManyDeletePromotion);
        setCheckBoxManyDeletePromotion(updatedCheckBoxManyDeletePromotion);
    
        const updatedSelectedItems = [...selectedItems];
        let i = rowIdx - 1
        if (updatedSelectedItems.includes(i)) {
            updatedSelectedItems.splice(updatedSelectedItems.indexOf(i), 1);
        } else {
            updatedSelectedItems.push(i);
        }
        console.log("updatedSelectedItems: ", updatedSelectedItems);
        setSelectedItems(updatedSelectedItems);
    };
    

    const AddPromotion = async () => {
        if (!isNamePromotion || !isPercent) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        } else {
            try {
                const firestore = firebase.firestore();
                const adminRef = firestore.collection('admin').doc(isUser);
                const doc = await adminRef.get();
                if (!doc.exists || !doc.data().my_promotion) {
                    await adminRef.set({ my_promotion: [] }, { merge: true });
                }

                // หา id ของไอเท็มล่าสุดใน my_menu หากไม่มีให้กำหนดเป็น 0
                const lastItemId = doc.data().my_promotion.length > 0 ? doc.data().my_promotion[doc.data().my_promotion.length - 1].id : 0;
                const newItemId = lastItemId + 1;

                const currentDate = new Date();
                const IsDate = currentDate.toISOString().split('T')[0]

                await adminRef.update({
                    my_promotion: firebase.firestore.FieldValue.arrayUnion({
                        name: isNamePromotion,
                        discount: isPercent,
                        period: IsDate,
                        promotion_ison: "N",
                        id: newItemId
                    }),
                });
                closeModal();
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }

    const EditPromotion = async (item, index) => {
        console.log("item EditUsers: ", item);
        console.log("index EditUsers: ", index);
        let i = index - 1
        if (i < 0) {
            console.error('ตรวจสอบว่าค่า i ไม่เป็นค่าลบก่อนใช้งาน (i < 0)');
            return;
        }
        if (item.promotion_ison === "Y") {
            setModalAlert(true)
            closeModalEdit();
            return;
        }
        try {

            const firestore = firebase.firestore();
            const AdminRef = firestore.collection('admin').doc(isUser);

            // ค้นหาเมนูที่ต้องการแก้ไข
            const snapshot = await AdminRef.get();
            if (snapshot.exists) {
                const userData = snapshot.data();
                const managepromotion = userData.my_promotion;

                if (i >= managepromotion.length) {
                    console.error('ตรวจสอบว่าค่า i ไม่เกินขอบเขตของ array managepromotion (i >= managepromotion.length)');
                    return;
                }

                const updatedMs = managepromotion.map((managepromotion, idx) => {
                    if (idx === i) {
                        return {
                            ...managepromotion,
                            name: isNamePromotionEdit || managepromotion.name,
                            discount: isPercentEdit || managepromotion.discount,
                        };
                    }
                    return managepromotion;
                });

                // อัปเดตข้อมูลใน Firestore collection 'admin'
                await AdminRef.update({
                    my_promotion: updatedMs,
                });

                closeModalEdit();
            } else {
                console.log('ไม่พบข้อมูลผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
        }
    }

    const DeletePromotion = async (item, index) => {
        console.log("item DeletePromotion: ", item);
        console.log("index DeletePromotion: ", index);
        let i = index - 1
        try {
            // ถามผู้ใช้ว่าต้องการลบเมนูหรือไม่
            const confirmation = window.confirm('คุณต้องการลบเมนูนี้หรือไม่?');

            // ถ้าผู้ใช้กด "Cancel" หรือปุ่มปิดก็ไม่ต้องทำอะไร
            if (!confirmation) {
                return;
            }

            if (item && item.promotion_ison === "Y") {
                setModalAlert(true);
                return;
            }

            const adminRef = firebase.firestore().collection('admin').doc(isUser);
            const doc = await adminRef.get();

            if (doc.exists) {
                const AdminData = doc.data();
                AdminData.my_promotion.splice(i, 1)

                await adminRef.update({ my_promotion: AdminData.my_promotion })
            }

        } catch (error) {
            console.log("error: ",error);
        }
    }

    const DeleteManyPromotion = async () => {
        try {
            console.log("selectedItems: ", selectedItems);
    
            // ดึง id ของไอเท็มที่ถูกเลือกมา
            const idsToDelete = selectedItems.map(index => isPromotionData[index]?.id);
            console.log("IDs to delete: ", idsToDelete); // Log เพื่อดูว่า IDs ถูกต้องหรือไม่
    
            if (idsToDelete.length === 0) {
                return; // ไม่มีไอเท็มที่ถูกเลือก
            }
    
            // ตรวจสอบว่ามีไอเท็มใดมี promotion_ison เป็น "Y" หรือไม่
            const hasPromotionY = idsToDelete.some(id => {
                const selectedItem = isPromotionData.find(item => item.id === id);
                return selectedItem?.promotion_ison === "Y";
            });
    
            // ถ้ามีไอเท็มใดมี promotion_ison เป็น "Y" ให้แสดงการแจ้งเตือนและไม่ลบไอเท็ม
            if (hasPromotionY) {
                setModalAlert(true);
                return;
            }
    
            // ดึงข้อมูลจาก Firebase
            const adminRef = firebase.firestore().collection('admin').doc(isUser);
            const doc = await adminRef.get();
    
            if (doc.exists) {
                const AdminData = doc.data();
    
                // Log เพื่อดูข้อมูลก่อนการลบ
                console.log("Admin data before deletion: ", AdminData.my_promotion);
    
                // ลบไอเท็มที่ถูกเลือกออกจาก my_promotion
                selectedItems.forEach(index => {
                    const idToDelete = isPromotionData[index]?.id;
                    AdminData.my_promotion = AdminData.my_promotion.filter(item => item.id !== idToDelete);
                });
    
                // Log เพื่อดูข้อมูลหลังการลบ
                console.log("Admin data after deletion: ", AdminData.my_promotion);
    
                // อัพเดตข้อมูลใน Firebase
                await adminRef.update({ my_promotion: AdminData.my_promotion });
            }
            handleCloseManyDeletePromotion();
        } catch (error) {
            console.error("Error deleting promotions:", error);
        }
    };
    
    
    const handleCloseManyDeletePromotion = () => {
        setManyDeletePromotion(false);
        setCheckBoxManyDeletePromotion([]);
        setSelectedItems([])
    };

    const handleToggle = async (item, index) => {
        console.log("item handleToggle: ", item);
        console.log("index handleToggle: ", index);
        let i = index - 1;
        if (i < 0) {
            console.error('ตรวจสอบว่าค่า i ไม่เป็นค่าลบก่อนใช้งาน (i < 0)');
            return;
        }
        try {
            let setting_switch;
            if (item.promotion_ison === "N") {
                setting_switch = "Y";
            } else {
                setting_switch = "N";
            }

            const firestore = firebase.firestore();
            const AdminRef = firestore.collection('admin').doc(isUser);

            // ค้นหาเมนูที่ต้องการแก้ไข
            const snapshot = await AdminRef.get();
            if (snapshot.exists) {
                const userData = snapshot.data();
                const managepromotion = userData.my_promotion;

                if (i >= managepromotion.length) {
                    console.error('ตรวจสอบว่าค่า i ไม่เกินขอบเขตของ array managepromotion (i >= managepromotion.length)');
                    return;
                }

                // ตรวจสอบว่ามีโปรโมชั่นอื่นที่เปิดใช้งานอยู่หรือไม่
                const isAnyPromotionActive = managepromotion.some((promotion, idx) =>
                    promotion.promotion_ison === "Y" && idx !== i
                );

                if (setting_switch === "Y" && isAnyPromotionActive) {
                    setModalSwitchAlert(true)
                    return;
                }

                const updatedMs = managepromotion.map((promotion, idx) => {
                    if (idx === i) {
                        return {
                            ...promotion,
                            promotion_ison: setting_switch,
                        };
                    }
                    return promotion;
                });

                // อัปเดตข้อมูลใน Firestore collection 'admin'
                await AdminRef.update({
                    my_promotion: updatedMs,
                });

            } else {
                console.log('ไม่พบข้อมูลผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
        }
    };

    const handleNamePromotion = (event) => {
        console.log("=new: ", event.target.value);
        setNamePromotion(event.target.value);
    };

    const handlePercent = (event) => {
        const value = event.target.value;

        // อนุญาตให้เป็นช่องว่างได้
        if (value === "") {
            setPercent("");
            return;
        }

        // กรองเฉพาะตัวเลข
        const numericValue = value.replace(/\D/g, '');

        // แปลงค่าเป็นตัวเลข
        let percentValue = parseInt(numericValue, 10);

        // ตรวจสอบว่าค่าที่กรอกอยู่ในช่วง 1-100 หรือไม่
        if (isNaN(percentValue) || percentValue < 1) {
            percentValue = 1;
        } else if (percentValue > 100) {
            percentValue = 100;
        }

        setPercent(percentValue);
    };

    const handleNamePromotionEdit = (event) => {
        console.log("=new: ", event.target.value);
        setNamePromotionEdit(event.target.value);
    };

    const handlePercentEdit = (event) => {
        const value = event.target.value;

        // อนุญาตให้เป็นช่องว่างได้
        if (value === "") {
            setPercentEdit("");
            return;
        }

        // กรองเฉพาะตัวเลข
        const numericValue = value.replace(/\D/g, '');

        // แปลงค่าเป็นตัวเลข
        let percentValue = parseInt(numericValue, 10);

        // ตรวจสอบว่าค่าที่กรอกอยู่ในช่วง 1-100 หรือไม่
        if (isNaN(percentValue) || percentValue < 1) {
            percentValue = 1;
        } else if (percentValue > 100) {
            percentValue = 100;
        }

        setPercentEdit(percentValue);
    };

    const openModal = () => {
        setModalIsOpen(true);
    }

    const openModalEdit = (item, index) => {
        setModalIsOpenEdit(true);
        setEditItem(item);
        setEditIndex(index);
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setNamePromotion("")
        setPercent("")
    }

    const closeModalEdit = () => {
        setModalIsOpenEdit(false);
        setNamePromotionEdit("")
        setPercentEdit("")
        setEditItem({});
        setEditIndex(null);
    }

    const modal = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsOpen}//const [modalIsOpen, setModalIsOpen] = useState(false);ถ้า setตัวหลัง ทรู อันนี้จะขึ้นมา โดยการเชื่อมตัวหน้า Modal เพิ่มเมนู
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '60%',
                                height: '50%',
                                margin: 'auto',
                                zIndex: 999999,
                                borderRadius: 10,
                                padding: 20,

                            },

                        }}
                    >
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                            <button onClick={closeModal} style={{ position: "absolute", right: 10, }}>X</button>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                                เพิ่มส่วนลด
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    ชื่อ
                                </div>
                                <input
                                    type="text"
                                    value={isNamePromotion}
                                    onChange={handleNamePromotion}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 10 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    ส่วนลด
                                </div>
                                <div style={{ position: "relative", }}>
                                    <input
                                        type="text"
                                        value={isPercent}
                                        onChange={handlePercent}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    >
                                    </input>
                                    <div style={{ position: "absolute", right: 15, top: 15, fontFamily: "Prompt-Medium", fontSize: 17, }}>
                                        / เปอร์เซ็นต์
                                    </div>
                                </div>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 10 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    วันที่สร้างโปรโมชั่น
                                </div>
                                <div style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, display: "flex", alignItems: "center" }}
                                >
                                    {isDateCreatePromotion}
                                </div>
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 30 }}>
                                <div onClick={() => AddPromotion()} style={{ width: 60, height: 40, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", fontFamily: "Prompt-Medium", fontSize: 20, width: 156, height: 46, cursor: "pointer" }}>
                                    เพิ่ม
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    const modalEdit = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsOpenEdit}//const [modalIsOpen, setModalIsOpen] = useState(false);ถ้า setตัวหลัง ทรู อันนี้จะขึ้นมา โดยการเชื่อมตัวหน้า Modal เพิ่มเมนู
                        onRequestClose={closeModalEdit}
                        contentLabel="Example Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '60%',
                                height: '50%',
                                margin: 'auto',
                                zIndex: 999999,
                                borderRadius: 10,
                                padding: 20,

                            },

                        }}
                    >
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                            <button onClick={closeModalEdit} style={{ position: "absolute", right: 10, }}>X</button>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                                แก้ไขส่วนลด
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    ชื่อ
                                </div>
                                <input
                                    type="text"
                                    value={isNamePromotionEdit}
                                    onChange={handleNamePromotionEdit}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    placeholder={`${editItem.name}`}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 10 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    ส่วนลด
                                </div>
                                <div style={{ position: "relative", }}>
                                    <input
                                        type="text"
                                        value={isPercentEdit}
                                        onChange={handlePercentEdit}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                        placeholder={`${editItem.discount}`}
                                    >
                                    </input>
                                    <div style={{ position: "absolute", right: 15, top: 15, fontFamily: "Prompt-Medium", fontSize: 17, }}>
                                        / เปอร์เซ็นต์
                                    </div>
                                </div>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 10 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    วันที่สร้างโปรโมชั่น
                                </div>
                                <div style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, display: "flex", alignItems: "center" }}
                                >
                                    {isDateCreatePromotion}
                                </div>
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 30 }}>
                                <div onClick={() => EditPromotion(editItem, editIndex)} style={{ width: 60, height: 40, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", fontFamily: "Prompt-Medium", fontSize: 20, width: 156, height: 46, cursor: "pointer" }}>
                                    แก้ไข
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    const modalAlert = () => {
        return (
            <>
                <ModalAlert
                    isOpen={isModalAlert}
                    onRequestClose={() => setModalAlert(false)}
                    title={"ไม่สามารถแก้ไขส่วนลดนี้ได้"}
                    message={"ไม่สามารถแก้ไขส่วนลดนี้ได้ เนื่องจาก ส่วนลดนี้ได้มีการเปิดใช้งานอยู่"}
                />
            </>
        )
    }

    const modalSwitchAlert = () => {
        return (
            <>
                <ModalAlert
                    isOpen={isModalSwitchAlert}
                    onRequestClose={() => setModalSwitchAlert(false)}
                    title={"ไม่สามารถเปิดใช้ส่วนลดนี้ได้"}
                    message={"ไม่สามารถเปิดใช้ส่วนลดนี้ได้ เนื่องจาก ส่วนลดอื่นมีการเปิดใช้งานอยู่"}
                />
            </>
        )
    }

    return (
        <>
            <div style={{ width: "100%", }}>
                {modal()}
                {modalEdit()}
                {modalAlert()}
                {modalSwitchAlert()}
                <div style={{ flexDirection: "row", display: "flex", paddingLeft: 20, paddingTop: 20, alignItems: "center" }}>
                    <img
                        src={managepromotionIcon} alt="Brief Screen" className="brief-image" style={{ width: 46, height: 46, }}
                    />
                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}>
                        ส่วนลดกล้องวงจรปิด
                    </div>
                </div >
                <div style={{ flexDirection: "row", display: "flex", paddingLeft: 20, paddingTop: 20, alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                        <div
                            onClick={openModal}
                            style={{
                                fontFamily: "Prompt-Medium", fontSize: 20, width: 120, height: 40, backgroundColor: "#63E834", color: "#FFF", alignItems: "center", justifyContent: "center", borderRadius: 10, display: "flex", cursor: "pointer"
                            }}>
                            เพิ่มโปรโมชั่น
                        </div>
                        {isManyDeletePromotion
                            ? <div onClick={() => handleCloseManyDeletePromotion()} style={{ fontFamily: "Prompt-Medium", fontSize: 20, width: 120, height: 40, backgroundColor: "#FF553E", color: "#FFF", alignItems: "center", justifyContent: "center", borderRadius: 10, display: "flex", marginLeft: 10, cursor: "pointer" }}>
                                ยกเลิก
                            </div>
                            : <div onClick={() => setManyDeletePromotion(true)} style={{ fontFamily: "Prompt-Medium", fontSize: 20, width: 120, height: 40, backgroundColor: "#FF553E", color: "#FFF", alignItems: "center", justifyContent: "center", borderRadius: 10, display: "flex", marginLeft: 10, cursor: "pointer" }}>
                                เลือกลบ
                            </div>
                        }
                    </div>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                        <input
                            style={{
                                width: 337, height: 47, display: "flex", alignItems: "center", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingLeft: 30, fontFamily: "Prompt-Light", fontSize: 18, borderColor: "#808080", borderStyle: "solid", borderWidth: 1
                            }}
                            placeholder='ค้นหา'
                        />
                        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#714B1C", borderTopRightRadius: 10, borderBottomRightRadius: 10, width: 81, justifyContent: "center", cursor: "pointer" }}>
                            <img
                                src={search} alt="Brief Screen" className="brief-image" style={{ width: 19, height: 19, }}
                            />
                        </div>
                    </div>
                </div >
                {isPromotionData.length === 0
                    ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 30, marginTop: 40, marginLeft: 40 }}>
                        ยังไม่มีส่วนลดในขณะนี้ ...
                    </div>
                    : <div style={{ backgroundColor: "#D5EEBB", marginLeft: 20, marginRight: 20, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                        <table style={{ marginTop: 30, width: "100%", marginRight: 20 }}>
                            {tableData.map((row, rowIdx) => (
                                [rowIdx == 0 ?
                                    <tr key={rowIdx} style={{}}>
                                        <td style={{ color: "#000", textAlign: "center" }}>
                                            <h3 style={{ fontFamily: "Prompt-Light" }}>
                                                {row.id}
                                            </h3>
                                        </td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.name}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.discount}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.period}</h3></td>
                                        {isManyDeletePromotion && isCheckBoxManyDeletePromotion.some((checked) => checked) && (
                                            <td onClick={() => DeleteManyPromotion()} style={{ color: "#FFF", textAlign: "center", backgroundColor: "#FF553E", cursor: "pointer" }}>
                                                <h3 style={{ fontFamily: "Prompt-Light" }}>ยืนยันการลบ</h3>
                                            </td>
                                        )}
                                    </tr> :
                                    (isManyDeletePromotion)
                                        ? <tr key={rowIdx} style={{ borderBottomWidth: 1, backgroundColor: (isCheckBoxManyDeletePromotion[rowIdx]) ? "#FFB5B5" : "#FFF", cursor: "pointer" }} onClick={() => handleCheckBoxManyDeletePromotion(rowIdx)} >
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.id}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.name}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.discount}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.period}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}  >
                                                <label style={{ position: "relative", display: "inline-block", width: 26, height: 26, }}>
                                                    <span style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#CFCFCF", transition: ".4s", borderRadius: 4, borderWidth: 2, borderStyle: "solid", borderColor: "red", cursor: "pointer" }}></span>
                                                    {isCheckBoxManyDeletePromotion[rowIdx] && <span style={{ position: "absolute", bottom: -4, left: 2, color: "red", fontSize: 26 }}>✓</span>}
                                                </label>
                                            </td>
                                        </tr>
                                        : <tr key={rowIdx} style={{ borderBottomWidth: 1, backgroundColor: "#FFF" }} >
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.id}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.name}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.discount}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.period}</h3></td>
                                            <td style={{ color: "#000", textAlign: "center" }}>
                                                <label style={{ position: "relative", display: "inline-block", width: 60, height: 26 }}>
                                                    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }}
                                                        checked={(row.promotion_ison === "Y") ? true : false}
                                                        onChange={() => handleToggle(row, rowIdx)}
                                                    />
                                                    <span style={{
                                                        position: "absolute",
                                                        cursor: "pointer",
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: "#CFCFCF",
                                                        transition: ".4s",
                                                        borderRadius: 20
                                                    }} />
                                                    <span style={{
                                                        position: "absolute",
                                                        height: 20,
                                                        width: 20,
                                                        left: (row.promotion_ison === "Y") ? 36 : 4,
                                                        bottom: 3,
                                                        backgroundColor: (row.promotion_ison === "Y") ? "#2DFF28" : "#FFF",
                                                        transition: ".4s",
                                                        borderRadius: "50%"
                                                    }} />
                                                </label>
                                            </td>
                                            <td onClick={() => openModalEdit(row, rowIdx)} style={{ color: "#FFF", textAlign: "center", backgroundColor: "#FFF73A", alignItems: "center", cursor: "pointer" }}><h3 style={{ fontFamily: "Prompt-Light" }}>แก้ไข</h3></td>
                                            <td onClick={() => DeletePromotion(row, rowIdx)} style={{ color: "#FFF", textAlign: "center", backgroundColor: "#FF553E", alignItems: "center", cursor: "pointer" }}><h3 style={{ fontFamily: "Prompt-Light" }}>ลบ</h3></td>
                                        </tr>
                                ]
                            ))}
                        </table>
                    </div>
                }
            </div >
        </>
    )


}