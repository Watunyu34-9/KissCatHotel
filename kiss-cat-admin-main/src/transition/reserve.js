import React, { useEffect, useState } from 'react';
import { firebase } from "../backend/backend"
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import reserveIcon from '../asset/reserveIcon.png'
import search from '../asset/search.png'
import picroomcat from '../asset/picroomcat.png'
import Kiss from '../asset/kisscathotel.png'
import moment from "moment/moment";

export default function Reserve({ navigation }) {
    const navigate = useNavigate();
    const [isReservePage, setReservePage] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);;
    const [ReserveData, setReserveData] = useState([]);;
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"

    useEffect(() => {
        console.log("Reserve..");
        getReserveData()
    }, []);

    const getReserveData = async () => {
        const docRef = firebase.firestore().collection('admin').doc(AdminDatabse);
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

    const onAcceptCancle = async (item, type) => {
        try {
            const firestore = firebase.firestore();
            // เปลี่ยนสถานะยกเลิกการจอง collection 'users'
            const userRef = firestore.collection('users').doc(item.uid_user);
            const userDoc = await userRef.get();

            if (userDoc.exists && userDoc.data().my_reservation) {
                const myReservations = userDoc.data().my_reservation;

                const updatedReservations = myReservations.map(reservation => {
                    if (reservation.name === item.name) {
                        return {
                            ...reservation,
                            refund: (type === "Accept" || type === "ok") ? "S" : "F",
                            refund_req: "Y",
                        };
                    }
                    return reservation;
                });

                await userRef.update({ my_reservation: updatedReservations });
            }

            // ลบการจองจาก collection 'admin'
            const adminRef = firestore.collection('admin').doc(AdminDatabse);
            const adminDoc = await adminRef.get();

            if (adminDoc.exists && adminDoc.data().my_reservation) {
                const myReservations = adminDoc.data().my_reservation;

                const updatedReservations = myReservations.map(reservation => {
                    if (reservation.name === item.name) {
                        return {
                            ...reservation,
                            refund: (type === "Accept" || type === "ok") ? "S" : "F",
                            refund_req: "Y",
                        };
                    }
                    return reservation;
                });

                await adminRef.update({ my_reservation: updatedReservations });
            } if (type === "Accept") {
                //  อัพเดท my_dashboard
                let adminDashboard = adminDoc.data().my_dashboard || [{ reservations: 0, cats_number: 0, Monthly_income: Array(12).fill(0) }];
                adminDashboard[0].reservations = (adminDashboard[0].reservations || 0) - 1;
                const currentMonth = moment().month(); // เดือนปัจจุบัน (0-11)
                let monthlyIncome = adminDashboard[0].Monthly_income || Array(12).fill(0);
                monthlyIncome[currentMonth] = (parseFloat(monthlyIncome[currentMonth]) || 0) - parseFloat(item.isTotalPrice || 0);
                adminDashboard[0].Monthly_income = monthlyIncome;

                await adminRef.update({ my_dashboard: adminDashboard });
            } else if (type === "ok") {
                //  อัพเดท my_dashboard
                let adminDashboard = adminDoc.data().my_dashboard || [{ reservations: 0, cats_number: 0, Monthly_income: Array(12).fill(0) }];
                adminDashboard[0].reservations = (adminDashboard[0].reservations || 0) - 1;
                // หักลบจำนวนเงินออกจาก Monthly_income
                const currentMonth = moment().month(); // เดือนปัจจุบัน (0-11)
                let monthlyIncome = adminDashboard[0].Monthly_income || Array(12).fill(0);
                monthlyIncome[currentMonth] = (parseFloat(monthlyIncome[currentMonth]) || 0) - parseFloat(item.isTotalPrice || 0);
                adminDashboard[0].Monthly_income = monthlyIncome;
                // หักจำนวนแมวออก
                adminDashboard[0].cats_number = (adminDashboard[0].cats_number || 0) - (item.number_of_cats || 0);

            }
            setReservePage(true)
            // window.alert("ส่งคำขอการยกเลิกการจองไปให้แอดมินเรียบร้อยแล้ว รอการตรวจสอบ...");
        } catch (error) {
            console.error("Error cancelling reservation: ", error);
            window.alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
        }
    }

    const onAcceptRev = async (item, index) => {
        try {
            const firestore = firebase.firestore();

            // อัพเดทใน collection ของ admin
            const adminRef = firestore.collection('admin').doc(AdminDatabse);
            const adminDoc = await adminRef.get();
            if (!adminDoc.exists || !adminDoc.data().my_reservation) {
                throw new Error("Admin document not found");
            }

            let adminReservations = adminDoc.data().my_reservation;
            let reservationIndex = adminReservations.findIndex(reservation => reservation.name === item.name);

            if (reservationIndex !== -1) {
                adminReservations[reservationIndex].status = "Y";
                await adminRef.update({ my_reservation: adminReservations });
            } else {
                throw new Error("Reservation not found ");
            }

            // อัพเดทใน collection ของ users
            const userRef = firestore.collection('users').doc(item.uid_user);
            const userDoc = await userRef.get();
            if (!userDoc.exists || !userDoc.data().my_reservation) {
                throw new Error("User document not found");
            }

            let userReservations = userDoc.data().my_reservation;
            let userReservationIndex = userReservations.findIndex(reservation => reservation.name === item.name);

            if (userReservationIndex !== -1) {
                userReservations[userReservationIndex].status = "Y";
                await userRef.update({ my_reservation: userReservations });
            } else {
                throw new Error("Reservation not found ");
            }

            // อัพเดท my_dashboard
            let adminDashboard = adminDoc.data().my_dashboard || [{ reservations: 0, cats_number: 0, Monthly_income: Array(12).fill(0) }];
            adminDashboard[0].cats_number = (adminDashboard[0].cats_number || 0) + (item.number_of_cats || 0);

            await adminRef.update({ my_dashboard: adminDashboard });

            setReservePage(true);
            console.log("หuccessfully");
        } catch (error) {
            console.error("Errorstatus: ", error);
        }
    };

    // const onAcceptRev = async (item, index) => {
    //     try {
    //         const firestore = firebase.firestore();

    //         // อัพเดทใน collection ของ admin
    //         const adminRef = firestore.collection('admin').doc(AdminDatabse);
    //         const adminDoc = await adminRef.get();
    //         if (!adminDoc.exists || !adminDoc.data().my_reservation) {
    //             throw new Error("Admin document not found");
    //         }

    //         let adminReservations = adminDoc.data().my_reservation;
    //         let reservationIndex = adminReservations.findIndex(reservation => reservation.name === item.name);

    //         if (reservationIndex !== -1) {
    //             adminReservations[reservationIndex].status = "Y";
    //             await adminRef.update({ my_reservation: adminReservations });
    //         } else {
    //             throw new Error("Reservation not found ");
    //         }

    //         // อัพเดทใน collection ของ users
    //         const userRef = firestore.collection('users').doc(item.uid_user);
    //         const userDoc = await userRef.get();
    //         if (!userDoc.exists || !userDoc.data().my_reservation) {
    //             throw new Error("User document not found");
    //         }

    //         let userReservations = userDoc.data().my_reservation;
    //         let userReservationIndex = userReservations.findIndex(reservation => reservation.name === item.name);

    //         if (userReservationIndex !== -1) {
    //             userReservations[userReservationIndex].status = "Y";
    //             await userRef.update({ my_reservation: userReservations });
    //         } else {
    //             throw new Error("Reservation not found ");
    //         }
    //         setReservePage(true);
    //         console.log("หuccessfully");
    //     } catch (error) {
    //         console.error("Errorstatus: ", error);
    //     }
    // };

    const goReserveDetail = (item) => {
        console.log("item: ", item);
        setSelectedItem(item);
        setReservePage(false);

    }


    const renderReserveDetail = (item) => {
        console.log("itemitem: ", item);
        return (
            <div style={{ flexDirection: "row", display: "flex", backgroundColor: "#f5f5f5", paddingLeft: 29, paddingBottom: 20, justifyContent: "center" }}>
                <div style={{ flexDirection: "column", display: "flex" }}>
                    {/* หมายเลขการจอง */}
                    <div style={{ backgroundColor: "#FFF", marginTop: 15, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ borderBottomWidth: 1, borderBottomColor: "#D5D3D3", borderBottomStyle: "solid", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, marginRight: 180, width: "88%", color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>
                            หมายเลขการจอง : {item.name}
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>วันเข้า: {item.Entry_day}</div>
                            <div style={{ marginTop: 20, marginBottom: 25, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>วันออก:  {item.Release_date}</div>
                        </div>
                    </div>
                    {/* รายละเอียดห้องพัก */}
                    <div style={{ backgroundColor: "#FFF", marginTop: 15, borderRadius: 10, paddingBottom: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ borderBottomWidth: 1, borderBottomColor: "#D5D3D3", borderBottomStyle: "solid", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, marginRight: 180, width: "88%", color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>
                            รายละเอียดห้องพัก
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ประเภทห้อง : {item.roomType}</div>
                            <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>หมายเลขห้อง : {item.roomId}</div>
                            <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-between" }}>
                                <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ราคาห้องพัก / วัน </div>
                                <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, marginRight: 30 }}>฿ {item.Price_per_night}</div>
                            </div>
                            <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>จำนวนวันเข้าพัก : {item.number_of_days} วัน</div>
                            <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>จำนวนแมว : {item.number_of_cats} ตัว</div>
                        </div>
                    </div>
                    {(item.refund_req === "Y")
                        ? <div style={{ backgroundColor: "#FFF", marginTop: 15, borderRadius: 10, paddingBottom: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ borderBottomWidth: 1, borderBottomColor: "#D5D3D3", borderBottomStyle: "solid", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, marginRight: 180, width: "88%", color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>
                                รายละเอียดบัญชีคืนเงิน
                            </div>
                            <div style={{ marginLeft: 20 }}>
                                <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>บัญชีธนาคาร : {item.account_bank}</div>
                                <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>เลขที่บัญชี : {item.account_bankID}</div>
                                <div style={{ marginTop: 20, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>วันที่ชำระเงิน : {item.payment_date}</div>
                            </div>
                        </div>
                        : null
                    }
                </div>
                <div style={{ flexDirection: "column", display: "flex" }}>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                        <div style={{ backgroundColor: "#FFF", marginTop: 15, marginLeft: 25, borderRadius: 10, paddingBottom: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}>
                            {/* ข้อมูลลูกค้า */}
                            <div style={{ borderBottomWidth: 1, borderBottomColor: "#D5D3D3", borderBottomStyle: "solid", paddingTop: 20, paddingBottom: 20, marginLeft: 20, marginRight: 160, width: "84%", color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>
                                ข้อมูลลูกค้า :
                            </div>
                            <div style={{ marginLeft: 20 }}>
                                {/* <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ID : {item.userid}</div> */}
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, marginTop: 20 }}>ชื่อ : {item.username}</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>นามสกุล : {item.userlastname}</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>เบอร์โทร : {item.userphonenumber}</div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ชื่อแมว : </div>
                                    <div style={{ marginLeft: 15 }}>
                                        {
                                            item.usercatname.map((item, index) => (
                                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>{item.name_cat}   </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ใบเส็จชำระเงิน */}
                        <div style={{ backgroundColor: "#FFF", marginLeft: 25, borderRadius: 10, paddingBottom: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}>
                            <div style={{ borderBottomWidth: 1, borderBottomColor: "#D5D3D3", borderBottomStyle: "solid", paddingBottom: 20, marginLeft: 20, marginRight: 120, width: "84%", color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, marginTop: 20 }}>
                                ใบเสร็จชำระเงิน :
                            </div>
                            <div style={{ backgroundColor: "#FFF", justifyContent: "center", display: "flex", flexDirection: "column" }}>
                                <img
                                    src={item.pic_re} alt="Brief Screen" className="brief-image" style={{ width: 128, height: 200, alignSelf: "center", marginTop: 20 }}
                                />
                                {/* <div>รูป : {item.pic_receipt}</div> */}
                                {(item.refund === "S")
                                    ? <div style={{ marginTop: 10, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, alignSelf: "center", backgroundColor: "#FF5580", borderRadius: 7, padding: 6 }}>
                                        ยกเลิกการจองแล้ว
                                    </div>
                                    : (item.status === "N")
                                        ? <div
                                            style={{ marginTop: 10, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, alignSelf: "center", backgroundColor: "#ECE431", borderRadius: 7, padding: 6 }}>
                                            รอยืนยันการจอง
                                        </div>
                                        : <div style={{ marginTop: 10, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, alignSelf: "center", backgroundColor: "#33EE67", borderRadius: 7, padding: 6 }}>
                                            ยืนยันการจองแล้ว
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    {/* รายละเอียดชำระเงิน */}
                    <div style={{ backgroundColor: "#FFF", marginTop: 15, marginLeft: 25, borderRadius: 10, paddingBottom: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", position: "relative" }}>
                        {item.isCameRaSelect === true
                            ? <div style={{ position: "absolute", right: 0, top: 15, backgroundColor: "#FB6E6E", color: "#FFFFFF", padding: "10px 40px", fontFamily: "Prompt-Medium", fontSize: 17 }}>SALE! {item.promotion_camera}%</div>
                            : null
                        }
                        <div style={{ borderBottomWidth: 1, borderBottomColor: "#D5D3D3", borderBottomStyle: "solid", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, marginRight: 360, width: "84%", color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>
                            รายละเอียดชำระเงิน :
                        </div>
                        <div style={{ marginLeft: 20, flexDirection: "row", display: "flex", marginRight: 20, justifyContent: "space-between" }}>
                            <div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ราคาห้องพัก (ห้องพัก ฿{item.Price_per_night} x {item.number_of_days} วัน)</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ส่วนลดราคาห้องพัก ({item.isPerCentPerRoom}%) :</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, color: "#FE3E3E" }}>บริการเสริม : </div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>ส่วนลดกล้องวงจรปิด ({item.promotion_camera}%) : </div>
                                <div style={{ marginTop: 10, fontFamily: "Prompt-Medium", fontSize: 20 }}>รวม</div>
                            </div>
                            <div>
                                {/* <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20 }}>{item.sale}</div> */}
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, justifyContent: 'flex-end', display: "flex", color: "#FE3E3E" }}>฿{item.number_of_room}</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, justifyContent: 'flex-end', display: "flex", color: "#FE3E3E" }}>฿ {item.discount}</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, justifyContent: 'flex-end', display: "flex", color: "#FE3E3E" }}>฿ {item.isDisCountCamera}</div>
                                <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, justifyContent: 'flex-end', display: "flex" }}>฿ {item.isAveragePerCamera}</div>
                                <div style={{ marginTop: 10, fontFamily: "Prompt-Medium", fontSize: 20, justifyContent: 'flex-end', display: "flex" }}>฿ {item.isTotalPrice}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 15, marginLeft: 25, borderRadius: 10, paddingBottom: 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        {(item.refund === "S" || item.refund === "F")
                            ? null
                            : (item.refund_req === "Y" && item.status === "N")
                                ? <div style={{ flexDirection: "row", display: "flex" }}>
                                    <div
                                        onClick={() => onAcceptCancle(item, "Accept")}
                                        style={{ backgroundColor: "#FF5580", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, padding: "24px 80px", borderRadius: 10, cursor: "pointer" }}>
                                        ยืนยันการยกเลิกการจอง
                                    </div>
                                    <div
                                        onClick={() => onAcceptRev(item)}
                                        style={{ backgroundColor: "#3DEC21", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, padding: "24px 80px", borderRadius: 10, cursor: "pointer" }}>
                                        ยืนยันการจอง
                                    </div>
                                </div>
                                : (item.refund_req === "Y" && item.status === "Y")
                                    ? <div style={{ flexDirection: "row", display: "flex" }}>
                                        <div
                                            onClick={() => onAcceptCancle(item, "not")}
                                            style={{ backgroundColor: "#3DEC21", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, padding: "24px 80px", borderRadius: 10, cursor: "pointer" }}>
                                            ปฏิเสธยกเลิกการจอง
                                        </div>
                                        <div
                                            onClick={() => onAcceptCancle(item, "ok")}
                                            style={{ backgroundColor: "#FF5580", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, padding: "24px 80px", borderRadius: 10, cursor: "pointer" }}>
                                            ยืนยันการยกเลิกการจอง
                                        </div>
                                    </div>
                                    : (item.status === "N" && item.refund_req === "N") // ยังไม่ยืนยันชำระ
                                        ? <div style={{ flexDirection: "row", display: "flex" }}>
                                            <div
                                                // onClick={() => onAcceptCancle(item)}
                                                style={{ backgroundColor: "#FF5580", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, padding: "24px 80px", borderRadius: 10, cursor: "pointer" }}>
                                                ยกเลิก
                                            </div>
                                            <div
                                                onClick={() => onAcceptRev(item)}
                                                style={{ backgroundColor: "#3DEC21", paddingBottom: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 20, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, padding: "24px 80px", borderRadius: 10, cursor: "pointer" }}>
                                                ยืนยันการจอง
                                            </div>
                                        </div>
                                        : null
                        }
                    </div>
                </div>
            </div>
        );
    }


    return (
        <>
            < div style={{ backgroundColor: (isReservePage) ? "#FFF" : "#f5f5f5", width: "100%", marginTop: 20, borderRadius: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 20, marginLeft: 20 }}>
                <div style={{ width: "100%" }}>
                    <div style={{ flexDirection: "row", display: "flex", paddingLeft: 20, paddingTop: 20, alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
                        <div style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                            {(isReservePage)
                                ? null
                                : <div style={{ fontFamily: "Prompt-Medium", fontSize: 24, cursor: "pointer", marginRight: 20, }}
                                    onClick={() => setReservePage(true)}
                                >
                                    <IoMdArrowBack style={{ width: 29, height: 29 }} />
                                </div>
                            }
                            <img
                                src={reserveIcon} alt="Brief Screen" className="brief-image" style={{ width: 46, height: 46, }}
                            />
                            {(isReservePage)
                                ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}>
                                    รายการจอง
                                </div>
                                : <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}>
                                    รายละเอียดการจอง
                                </div>
                            }
                        </div>
                        {(isReservePage)
                            ? <div style={{ flexDirection: "row", display: "flex" }}>
                                <input
                                    style={{
                                        width: 337, height: 47, display: "flex", alignItems: "center", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingLeft: 30, fontSize: 18, borderColor: "#808080", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium",
                                    }}
                                    placeholder='ค้นหา'
                                />
                                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#714B1C", borderTopRightRadius: 10, borderBottomRightRadius: 10, width: 81, justifyContent: "center", cursor: "pointer" }}>
                                    <img
                                        src={search} alt="Brief Screen" className="brief-image" style={{ width: 19, height: 19, }}
                                    />
                                </div>
                            </div>
                            : null
                        }
                    </div >
                    {(isReservePage)
                        ? <div style={{ marginTop: 29, paddingLeft: 29, flexDirection: "column", display: "flex", }}>
                            {ReserveData.length === 0
                                ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 30, marginLeft: 20 }}>
                                    ยังไม่มีการจองในขณะนี้...
                                </div>
                                : ReserveData.map((item, index) => (
                                    <div
                                        style={{ marginBottom: 10, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", flexDirection: "row", display: "flex", justifyContent: "center", cursor: "pointer" }}
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
                                        <div style={{ flexDirection: "column", display: "flex", justifyContent: "center", marginLeft: 39 }}>
                                            <div style={{ flexDirection: "row", display: "flex" }}>
                                                <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", }}>
                                                    ㅤ
                                                </div>
                                                <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 19 }}>
                                                    ㅤ
                                                </div>
                                            </div>
                                            <div style={{ flexDirection: "row", display: "flex", marginTop: 5 }}>
                                                <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", display: "flex", alignItems: "center" }}>
                                                    สถานะการจอง :
                                                </div>
                                                <div style={{ flexDirection: "column", display: "flex" }}>
                                                    <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 29, backgroundColor: (item.status === "N") ? "#ECE431" : "#33EE67", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", padding: 10, marginBottom: 20 }}>
                                                        {(item.status === "Y") ? "ยืนยันแล้ว" : "รอยืนยันชำระเงิน"}
                                                    </div>
                                                    {(item.refund_req === "N")
                                                        ? null
                                                        : (item.refund === "S")
                                                            ? <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 29, backgroundColor: "#FF5580", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", padding: 10, marginBottom: 20 }}>
                                                                ยกเลิกการจองแล้ว
                                                            </div>
                                                            : (item.refund === "N")
                                                                ? <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 29, backgroundColor: "#FF5580", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", padding: 10, marginBottom: 20 }}>
                                                                    มีคำขอยกเลิกการจอง
                                                                </div>
                                                                : (item.refund === "F")
                                                                    ? <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 29, backgroundColor: "#FF5580", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", padding: 10, marginBottom: 20 }}>
                                                                        ปฏิเสธคำขอยกเลิกการจอง
                                                                    </div>
                                                                    : null

                                                    }
                                                </div>
                                                {/* <div style={{ fontSize: 20, fontFamily: "Prompt-Medium", marginLeft: 20, width: 76, height: 37, backgroundColor: "#FF553E", borderRadius: 5, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", cursor: "pointer" }}>
                                                    ลบ
                                                </div> */}
                                            </div>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                        : renderReserveDetail(selectedItem)
                    }

                </div >
            </div>
        </>
    )


}