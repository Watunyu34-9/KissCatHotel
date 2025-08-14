import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';
import addcat from '../asset/addcat.png'
import trash from '../asset/trash.png'
import moment from 'moment';
import Modal from 'react-modal';
// import picroomcat from '../asset/picroomcat.png'

export default function MyReservation({ navigation }) {
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const isUser = firebase.auth().currentUser.uid;
    const [ReserveData, setReserveData] = useState([]);
    const [isAccount, setAccount] = useState("");
    const [isAccountID, setAccountID] = useState("");
    const [isCancleRoom, setCancleRoom] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);


    useEffect(() => {
        console.log("MyReservation..");
        getReserveData()
    }, []);


    const closeModal = () => {
        setModalIsOpen(false);
        setAccount("")
        setAccountID("")
        setCancleRoom({})
    }

    const modal = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '60%',
                                height: '30%',
                                margin: 'auto',
                                zIndex: 999999
                            },

                        }}
                    >
                        <div style={{ alignItems: "center", display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                            <div style={{ fontSize: 30, fontFamily: "Prompt-Medium", color: "#FF5580" }}>กรอกบัญชีคืนเงิน ยกเลิกการจอง {isCancleRoom.roomId} หมายเลขการจอง({isCancleRoom.name})</div>
                            <div style={{ flexDirection: "row", display: "flex", }}>
                                <div style={{ marginTop: 40 }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        ระบุประเภทบัญชีธนาคาร :
                                    </div>
                                    <input
                                        type="text"
                                        value={isAccount}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            setAccount(e.target.value)
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    >
                                    </input>
                                </div>
                                <div style={{ marginLeft: 20, marginTop: 40 }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        เลขบัญชี :
                                    </div>
                                    <input
                                        type="text"
                                        value={isAccountID}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            const value = e.target.value;
                                            const numericValue = value.replace(/\D/g, '');
                                            setAccountID(numericValue);
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    >
                                    </input>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'row', marginTop: 30 }}>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRequestCancle()
                                    }}
                                    style={{ color: "#FFF", borderRadius: 10, cursor: "pointer", backgroundColor: "#3DEC21", padding: 10, fontSize: 20, fontFamily: "Prompt-Medium", marginRight: 30 }}>
                                    ยืนยันยกเลิกการจอง
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        closeModal();
                                    }}
                                    style={{ color: "#FFF", borderRadius: 10, cursor: "pointer", backgroundColor: "#FB6E6E", padding: 10, fontSize: 20, fontFamily: "Prompt-Medium", display: "flex", alignItems: "center" }}>
                                    ยกเลิกทำรายการ
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    const getReserveData = async () => {
        const docRef = firebase.firestore().collection('users').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                if (data.my_reservation && data.my_reservation.length > 0) {
                    setReserveData(data.my_reservation);
                } else {
                    setReserveData([]);
                }
            }
        });
    }

    const goReserveDetail = (item) => {
        navigate("/My-Detail-Reservation", { state: { item: item } });
    }

    const onCancelReservation = async (item) => {
        setCancleRoom(item)
        setModalIsOpen(true)
    };

    const onRequestCancle = async () => {
        try {
            const firestore = firebase.firestore();
            // เปลี่ยนสถานะยกเลิกการจอง collection 'users'
            const userRef = firestore.collection('users').doc(isUser);
            const userDoc = await userRef.get();

            if (userDoc.exists && userDoc.data().my_reservation) {
                const myReservations = userDoc.data().my_reservation;

                const updatedReservations = myReservations.map(reservation => {
                    if (reservation.name === isCancleRoom.name) {
                        return {
                            ...reservation,
                            // refund: "Y"
                            refund_req: "Y",
                            account_bank: isAccount,
                            account_bankID: isAccountID,
                        };
                    }
                    return reservation;
                });

                await userRef.update({ my_reservation: updatedReservations });
            }

            // ลบการจองจาก collection 'admin'
            const adminRef = firestore.collection('admin').doc(AdminDatabse);
            await adminRef.update({ alert: "Y" });
            const adminDoc = await adminRef.get();

            if (adminDoc.exists && adminDoc.data().my_reservation) {
                const myReservations = adminDoc.data().my_reservation;

                const updatedReservations = myReservations.map(reservation => {
                    if (reservation.name === isCancleRoom.name) {
                        return {
                            ...reservation,
                            // refund: "Y",
                            refund_req: "Y",
                            account_bank: isAccount,
                            account_bankID: isAccountID,
                        };
                    }
                    return reservation;
                });

                await adminRef.update({ my_reservation: updatedReservations });
            }
            window.alert("ส่งคำขอการยกเลิกการจองไปให้แอดมินเรียบร้อยแล้ว รอการตรวจสอบ...");
            closeModal();
        } catch (error) {
            console.error("Error cancelling reservation: ", error);
            window.alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
        }
    }

    // const onCancelReservation = async (item) => {
    //     const confirmation = window.confirm('คุณยกเลิกการจองหรือนี้หรือไม่?');

    //     if (!confirmation) {
    //         return;
    //     } else {
    //         setCancle(true)
    //         if (item.status !== "N") {
    //             window.alert("ไม่สามารถยกเลิกการจองนี้ได้ เนื่องจากมีการยืนยันการจองไปแล้ว ");
    //             return;
    //         }

    //         try {
    //             const firestore = firebase.firestore();

    //             // ลบการจองจาก collection 'users'
    //             const userRef = firestore.collection('users').doc(isUser);
    //             const userDoc = await userRef.get();
    //             if (userDoc.exists && userDoc.data().my_reservation) {
    //                 const updatedUserReservations = userDoc.data().my_reservation.filter(reservation => reservation.id !== item.id);
    //                 await userRef.update({ my_reservation: updatedUserReservations });
    //             }

    //             // ลบการจองจาก collection 'admin'
    //             const adminRef = firestore.collection('admin').doc(AdminDatabse);
    //             const adminDoc = await adminRef.get();
    //             if (adminDoc.exists && adminDoc.data().my_reservation) {
    //                 const updatedAdminReservations = adminDoc.data().my_reservation.filter(reservation => reservation.id !== item.id);
    //                 await adminRef.update({ my_reservation: updatedAdminReservations });

    //                 // อัพเดท my_dashboard
    //                 let adminDashboard = adminDoc.data().my_dashboard || [{ reservations: 0, cats_number: 0, Monthly_income: Array(12).fill(0) }];
    //                 adminDashboard[0].reservations = (adminDashboard[0].reservations || 0) - 1;

    //                 // หักลบจำนวนเงินออกจาก Monthly_income
    //                 const currentMonth = moment().month(); // เดือนปัจจุบัน (0-11)
    //                 let monthlyIncome = adminDashboard[0].Monthly_income || Array(12).fill(0);
    //                 monthlyIncome[currentMonth] = (parseFloat(monthlyIncome[currentMonth]) || 0) - parseFloat(item.isTotalPrice || 0);
    //                 adminDashboard[0].Monthly_income = monthlyIncome;

    //                 await adminRef.update({ my_dashboard: adminDashboard });
    //             }

    //             window.alert("การจองถูกยกเลิกเรียบร้อยแล้ว ระบบจะทำการคืนเงินภายใน 3 วัน");
    //         } catch (error) {
    //             console.error("Error cancelling reservation: ", error);
    //             window.alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    //         }
    //     }

    // };


    return (
        <>
            <div style={{ marginTop: 40, marginLeft: 20, marginRight: 20 }}>
                {modal()}
                {ReserveData.length === 0
                    ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 30, marginLeft: 20 }}>
                        ยังไม่มีการจองในขณะนี้...
                    </div>
                    : ReserveData.map((item, index) => (
                        <div
                            style={{ marginBottom: 10, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", flexDirection: "row", display: "flex", justifyContent: "center", cursor: "pointer", backgroundColor: "#FFF", padding: 40, position: "relative" }}
                            onClick={() => goReserveDetail(item)}
                        >
                            <div style={{ flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                    หมายเลขการจอง
                                </div>
                                <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                    {item.name}
                                </div>
                            </div>
                            <div style={{ margin: 10 }}>
                                <img
                                    src={item.picroomcat} alt="Brief Screen" className="brief-image" style={{ width: 118, height: 93, borderRadius: 10 }}
                                />
                            </div>
                            <div style={{ flexDirection: "column", display: "flex", justifyContent: "center", marginLeft: 9 }}>
                                <div style={{ flexDirection: "row", display: "flex" }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        วันเข้า
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 19 }}>
                                        :  {item.Entry_day}
                                    </div>
                                </div>
                                <div style={{ flexDirection: "row", display: "flex" }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        วันออก
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 9 }}>
                                        :  {item.Release_date}
                                    </div>
                                </div>
                            </div>
                            <div style={{ flexDirection: "column", display: "flex", justifyContent: "center", marginLeft: 39 }}>
                                <div style={{ flexDirection: "row", display: "flex" }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        ห้อง
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 19 }}>
                                        : {item.roomId}
                                    </div>
                                </div>
                                <div style={{ flexDirection: "row", display: "flex" }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        ประเภทห้อง
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 9 }}>
                                        : {item.roomType}
                                    </div>
                                </div>
                            </div>
                            <div style={{ flexDirection: "column", display: "flex", justifyContent: "center", marginLeft: 39, }}>
                                <div style={{ flexDirection: "row", display: "flex" }}>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                        <div style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                                            <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                                สถานะการจอง :
                                            </div>
                                            <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 29, backgroundColor: (item.status === "N") ? "#ECE431" : "#33EE67", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", padding: 10 }}>
                                                {(item.status === "Y") ? "ยืนยันแล้ว" : "รอยืนยันชำระเงิน"}
                                            </div>
                                            {(item.refund === "S")
                                                ? <div style={{ flexDirection: "column", display: "flex" }}>
                                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", }}>
                                                        ยกเลิกการจองสำเร็จ
                                                    </div>
                                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", }}>
                                                        ระบบจะคืนเงินภายใน 3 วัน
                                                    </div>
                                                </div>
                                                :
                                                (item.refund_req === "Y" && item.refund === "N")
                                                    ? <div style={{ flexDirection: "column", display: "flex" }}>
                                                        <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", padding: 10 }}>
                                                            ส่งคำขอการยกเลิกการจองแล้ว
                                                        </div>
                                                        <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", }}>
                                                            กรุณารอการตรวจสอบ
                                                        </div>
                                                    </div>
                                                    : (item.refund_req === "N" && item.refund === "N")
                                                        ? <div onClick={(e) => {
                                                            e.stopPropagation();
                                                            onCancelReservation(item, index)
                                                        }} style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, width: 132, height: 37, backgroundColor: "#FF5580", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", cursor: "pointer", padding: 10 }}>
                                                            ยกเลิกการจอง
                                                        </div>
                                                        // refund === "F"
                                                        : <div style={{ flexDirection: "column", display: "flex", }}>
                                                            <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", }}>
                                                                ยกเลิกการจองล้มเหลว
                                                            </div>
                                                            <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", }}>
                                                                ห้องพักจะว่างสำหรับน้องแมว {
                                                                    item.usercatname.map((item, index) => (
                                                                        <div style={{ color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 10, marginRight: 10 }}>{item.name_cat}   </div>
                                                                    ))
                                                                }ในวันที่
                                                            </div>
                                                            <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, borderRadius: 5, color: "#FF5580", alignItems: "center", justifyContent: "center", display: "flex", }}>
                                                                {item.Entry_day} ถึง {item.Release_date}
                                                            </div>
                                                        </div>
                                            }
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 19 }}>

                                    </div>
                                </div>

                            </div>

                        </div>
                    ))
                }
            </div >

        </>

    );
};