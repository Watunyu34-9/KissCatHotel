import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';
import addcat from '../asset/addcat.png'
import rec from '../asset/rec.png'
import code from '../asset/code.png'
import { isEmpty } from '../component/empty';
import moment from "moment/moment";

export default function ConfirmedReservation({ navigation }) {
    const navigate = useNavigate();
    const location = useLocation();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const { docList } = location.state || {};
    const { index } = location.state || {};
    // const { isMe } = location.state || {};
    const { docListInnerIndex } = location.state || {};
    const { promotion_camera } = location.state || {};
    const { isCameRaSelect } = location.state || {};
    const { docListInner } = location.state || {};
    const { RevData } = location.state || {};
    const [isReciptPic, setReciptPic] = useState("");
    const [isReciptPicName, setReciptPicName] = useState("");
    // เช็ค me
    const [isMe, setMe] = useState([])
    console.log("isMe: ", isMe);
    console.log("RevData: ", RevData);
    console.log("docList: ", docList);

    useEffect(() => {
        console.log("MakeReservation..");
        getMe()
    }, []);

    const goBack = () => {
        navigate("/Make-A-Reservation", { state: { docList: docList, index: index, promotion_camera: promotion_camera, docListInner: docListInner, docListInnerIndex: docListInnerIndex, RevData: RevData, isCameRaSelect: isCameRaSelect } });
    }

    const getMe = async () => {
        const isUser = firebase.auth().currentUser.uid;
        const docRef = firebase.firestore().collection('users').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                setMe(data);
            }
        });
    }

    const RandomMath = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomCode = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomCode += characters.charAt(randomIndex);
        }
        return randomCode;
    }

    const handleFileChange = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setReciptPic(reader.result);
            };
            reader.readAsDataURL(file);
            setReciptPicName(event.target.files[0].name)
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setReciptPic(null);
            setReciptPicName(null);
        }
    };

    // const onConFirm = async () => {
    //     if (!isReciptPic) {
    //         window.alert("กรุณาอัพโหลดสลิป ค่าใช้จ่าย");
    //         return;
    //     } else {
    //         try {
    //             // Admin
    //             navigate("");
    //             const randomCode = RandomMath(5);
    //             const firestore = firebase.firestore();
    //             const adminRef = firestore.collection('admin').doc(AdminDatabse);
    //             const doc = await adminRef.get();
    //             if (!doc.exists || !doc.data().my_reservation) {
    //                 await adminRef.set({ my_reservation: [] }, { merge: true });
    //             }

    //             const isUser = firebase.auth().currentUser.uid;

    //             const lastItemId = doc.data().my_reservation.length > 0 ? doc.data().my_reservation[doc.data().my_reservation.length - 1].id : 0;
    //             const newItemId = lastItemId + 1;
    //             const storageRef = firebase.storage().ref();
    //             const imageRef = storageRef.child(`${AdminDatabse}/receipt/${newItemId}`);
    //             await imageRef.putString(isReciptPic, 'data_url');
    //             const imageUrl = await imageRef.getDownloadURL();

    //             const formattedCheckIn = moment(RevData?.isCheckIn).format('ll');
    //             const formattedCheckOut = moment(RevData?.isCheckOut).format('ll');

    //             console.log("ดูค่า doclist ก่อนนะ : ", docList);
    //             console.log("ดูค่า RevData ก่อนนะ : ", RevData);

    //             // อัพเดทข้อมูลการจอง
    //             await adminRef.update({
    //                 my_reservation: firebase.firestore.FieldValue.arrayUnion({
    //                     uid_user: isUser,
    //                     id: newItemId,
    //                     //หมายเลขการจอง
    //                     name: randomCode,
    //                     Entry_day: formattedCheckIn,
    //                     Release_date: formattedCheckOut,
    //                     // //รายละเอียดห้องพัก
    //                     roomId: docListInner?.name_room,
    //                     roomType: docList?.name_room,
    //                     Price_per_night: docList?.price_room,
    //                     number_of_days: RevData?.isNumberOfDays,
    //                     number_of_cats: RevData?.selectedCats.length,
    //                     picroomcat: docList?.pic,
    //                     //ข้อมูลลูกค้า
    //                     username: isMe?.name,
    //                     userlastname: isMe?.lastname,
    //                     userphonenumber: isMe?.phone,
    //                     usercatname: RevData?.isArrayCat,
    //                     //รายละเอียดชำระเงิน
    //                     number_of_room: RevData?.isAveragePerRoom, // ห้องพัก 1 ห้อง x 7 คืน (ห้องพัก number_of_room ห้อง x number_of_daysคืน)
    //                     discount: RevData?.isDiscountedRemovePrice,
    //                     isDisCountCamera: RevData?.isDisCountCamera, //ส่วนลดกล้องวงจรปิด
    //                     isPerCentPerRoom: RevData?.isPerCentPerRoom,
    //                     isTotalPrice: RevData?.isTotalPrice,
    //                     promotion_camera: isEmpty(promotion_camera) ? 0 : promotion_camera,
    //                     isAveragePerCamera: RevData?.isAveragePerCamera,
    //                     //ใบเส็จชำระเงิน
    //                     status: "N",
    //                     refund: "N",
    //                     pic_re: imageUrl
    //                 }),
    //             });

    //             // อัพเดท my_dashboard
    //             let adminDashboard = doc.data().my_dashboard || [{ reservations: 0, cats_number: 0 }];
    //             adminDashboard[0].reservations = (adminDashboard[0].reservations || 0) + 1;
    //             adminDashboard[0].cats_number = (adminDashboard[0].cats_number || 0) + (RevData?.isArrayCat.length || 0);

    //             await adminRef.update({ my_dashboard: adminDashboard });

    //             await adminRef.update({ alert: "Y" });

    //             // Users
    //             const userRef = firestore.collection('users').doc(isUser);
    //             const docUser = await userRef.get();
    //             if (!docUser.exists || !docUser.data().my_reservation) {
    //                 await userRef.set({ my_reservation: [] }, { merge: true });
    //             }

    //             await userRef.update({
    //                 my_reservation: firebase.firestore.FieldValue.arrayUnion({
    //                     id: newItemId,
    //                     //หมายเลขการจอง
    //                     name: randomCode,
    //                     Entry_day: formattedCheckIn,
    //                     Release_date: formattedCheckOut,
    //                     // //รายละเอียดห้องพัก
    //                     roomId: docListInner?.name_room,
    //                     roomType: docList?.name_room,
    //                     Price_per_night: docList?.price_room,
    //                     number_of_days: RevData?.isNumberOfDays,
    //                     number_of_cats: RevData?.selectedCats.length,
    //                     //ข้อมูลลูกค้า
    //                     username: isMe?.name,
    //                     userlastname: isMe?.lastname,
    //                     userphonenumber: isMe?.phone,
    //                     usercatname: RevData?.isArrayCat,
    //                     //รายละเอียดชำระเงิน
    //                     number_of_room: RevData?.isNumberOfDays, // ห้องพัก 1 ห้อง x 7 คืน (ห้องพัก number_of_room ห้อง x number_of_daysคืน)
    //                     discount: RevData?.isDiscountedRemovePrice,
    //                     isDisCountCamera: RevData?.isDisCountCamera, //ส่วนลดกล้องวงจรปิด
    //                     isPerCentPerRoom: RevData?.isPerCentPerRoom,
    //                     isTotalPrice: RevData?.isTotalPrice,
    //                     //ใบเส็จชำระเงิน
    //                     status: "N",
    //                     refund: "N",
    //                     pic_re: imageUrl,
    //                     picroomcat: docList?.pic,
    //                 }),
    //             });

    //             navigate("/");
    //         } catch (error) {
    //             console.log("Error: ", error);
    //         }
    //     }
    // };

    const onConFirm = async () => {
        if (!isReciptPic) {
            window.alert("กรุณาอัพโหลดสลิป ค่าใช้จ่าย");
            return;
        } else {
            try {
                const randomCode = RandomMath(5);
                const firestore = firebase.firestore();
                const adminRef = firestore.collection('admin').doc(AdminDatabse);
                const doc = await adminRef.get();

                if (!doc.exists || !doc.data().my_reservation) {
                    await adminRef.set({ my_reservation: [] }, { merge: true });
                }

                const isUser = firebase.auth().currentUser.uid;
                const lastItemId = doc.data().my_reservation.length > 0 ? doc.data().my_reservation[doc.data().my_reservation.length - 1].id : 0;
                const newItemId = lastItemId + 1;
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`${AdminDatabse}/receipt/${newItemId}`);
                await imageRef.putString(isReciptPic, 'data_url');
                const imageUrl = await imageRef.getDownloadURL();

                const Pamentdate = moment(new Date()).format('ll');

                const formattedCheckIn = moment(RevData?.isCheckIn).format('ll');
                const formattedCheckOut = moment(RevData?.isCheckOut).format('ll');

                // อัพเดทข้อมูลการจองใน collection ของ admin
                await adminRef.update({
                    my_reservation: firebase.firestore.FieldValue.arrayUnion({
                        uid_user: isUser,
                        id: newItemId,
                        name: randomCode,
                        Entry_day: formattedCheckIn,
                        Release_date: formattedCheckOut,
                        roomId: docListInner?.name_room,
                        roomType: docList?.name_room,
                        Price_per_night: docList?.price_room,
                        number_of_days: RevData?.isNumberOfDays,
                        number_of_cats: RevData?.selectedCats.length,
                        picroomcat: docList?.pic,
                        username: isMe?.name,
                        userlastname: isMe?.lastname,
                        userphonenumber: isMe?.phone,
                        usercatname: RevData?.isArrayCat,
                        number_of_room: RevData?.isAveragePerRoom,
                        discount: RevData?.isDiscountedRemovePrice,
                        isDisCountCamera: RevData?.isDisCountCamera,
                        isPerCentPerRoom: RevData?.isPerCentPerRoom,
                        isTotalPrice: RevData?.isTotalPrice,
                        promotion_camera: isEmpty(promotion_camera) ? 0 : promotion_camera,
                        isAveragePerCamera: RevData?.isAveragePerCamera,
                        status: "N",
                        refund: "N",
                        refund_req:"N",
                        pic_re: imageUrl,
                        account_bank: "",
                        account_bankID: "",
                        payment_date: Pamentdate,
                    }),
                });

                // อัพเดท my_dashboard
                let adminDashboard = doc.data().my_dashboard || [{ reservations: 0, cats_number: 0, Monthly_income: Array(12).fill(0) }];
                adminDashboard[0].reservations = (adminDashboard[0].reservations || 0) + 1;
                // `cats_number` จะไม่ถูกอัพเดทที่นี่

                // อัพเดท Monthly_income
                const currentMonth = moment().month(); // เดือนปัจจุบัน (0-11)
                let monthlyIncome = adminDashboard[0].Monthly_income || Array(12).fill(0);
                monthlyIncome[currentMonth] = (parseFloat(monthlyIncome[currentMonth]) || 0) + parseFloat(RevData?.isTotalPrice || 0);

                adminDashboard[0].Monthly_income = monthlyIncome;

                await adminRef.update({ my_dashboard: adminDashboard });
                await adminRef.update({ alert: "Y" });

                // อัพเดทข้อมูลการจองใน collection ของ users
                const userRef = firestore.collection('users').doc(isUser);
                const docUser = await userRef.get();
                if (!docUser.exists || !docUser.data().my_reservation) {
                    await userRef.set({ my_reservation: [] }, { merge: true });
                }

                await userRef.update({
                    my_reservation: firebase.firestore.FieldValue.arrayUnion({
                        id: newItemId,
                        name: randomCode,
                        Entry_day: formattedCheckIn,
                        Release_date: formattedCheckOut,
                        roomId: docListInner?.name_room,
                        roomType: docList?.name_room,
                        Price_per_night: docList?.price_room,
                        number_of_days: RevData?.isNumberOfDays,
                        number_of_cats: RevData?.selectedCats.length,
                        username: isMe?.name,
                        userlastname: isMe?.lastname,
                        userphonenumber: isMe?.phone,
                        usercatname: RevData?.isArrayCat,
                        number_of_room: RevData?.isNumberOfDays,
                        discount: RevData?.isDiscountedRemovePrice,
                        isDisCountCamera: RevData?.isDisCountCamera,
                        isPerCentPerRoom: RevData?.isPerCentPerRoom,
                        isCameRaSelect:isCameRaSelect,
                        isTotalPrice: RevData?.isTotalPrice,
                        status: "N",
                        refund: "N",
                        refund_req:"N",
                        pic_re: imageUrl,
                        picroomcat: docList?.pic,
                        account_bank: "",
                        account_bankID: "",
                        payment_date: Pamentdate,
                    }),
                });

                alert("ชำระเงินสำเร็จ กรุณารอการตรวจสอบ")

                if (isCameRaSelect === true) {
                    navigate("/Service-Camera");
                } else {
                    navigate("/");
                }

            } catch (error) {
                console.log("Error: ", error);
            }
        }
    };

    return (
        <>
            <div style={{ marginLeft: 20, marginRight: 20, }}>
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex", justifyContent: "space-between", }}>
                    <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 24, flexDirection: "row",borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        {"<-"} ย้อนกลับ
                    </div>
                </div>
                <div style={{ flexDirection: "row", display: "flex", backgroundColor: "#f8ebe1", borderRadius: 10, fontSize: 24 }}>
                    <div style={{ backgroundColor: "#f8ebe1", flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 60 }}>
                        <div style={{ height: 400, width: 280, backgroundColor: "#FFF", display: "flex", flexDirection: "column", paddingLeft: 90, paddingRight: 70, paddingBottom: 90, paddingTop: 30, fontFamily: "Itim-Regular", borderRadius: 10, fontSize: 30, position: "relative" }}>
                            ช่องทางการชำระเงิน
                            <img src={rec} alt="Brief Screen" className="brief-image" style={{ width: "80%", height: 400, position: "absolute", bottom: 30, left: 40 }} />

                        </div>
                    </div>
                    <div style={{ backgroundColor: "#FFF", flex: 1, marginLeft: 40, fontSize: 30, padding: 30, position: "relative", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontFamily: "Itim-Regular", fontSize: 40 }}>
                            รายละเอียด
                        </div>
                        <div style={{ marginTop: 30, display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: 60, borderBottomStyle: "solid", borderBottomWidth: 2, borderBottomColor: "#EAEAEA" }}>
                            {isCameRaSelect === true ? < div
                                style={{ backgroundColor: "#FB6E6E", position: "absolute", right: 0, top: 20, fontFamily: "Itim-Regular", fontSize: 25, color: "#FFFFFF", padding: "10px 20px" }}>
                                SALE! {isEmpty(promotion_camera) ? 0 : promotion_camera}%
                            </div>
                                : null
                            }
                            <div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 25, }}>
                                    ราคาห้องพัก (ห้องพัก ฿{docList?.price_room} x {RevData?.isNumberOfDays} วัน)
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 25, marginTop: 30, color: "#FE3E3E" }}>
                                    ส่วนลดราคาห้องพัก ({RevData?.isPerCentPerRoom}%)
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 25, marginTop: 30, }}>
                                    บริการเสริม
                                </div>
                                {isEmpty(promotion_camera)
                                    ? null
                                    : <div style={{ fontFamily: "Itim-Regular", fontSize: 25, marginTop: 30, color: "#FE3E3E" }}>
                                        ส่วนลดกล้องวงจรปิด  ({promotion_camera}%)
                                    </div>
                                }
                            </div>
                            <div style={{}}>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 25, }}>
                                    ฿{RevData?.isAveragePerRoom}
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 25, marginTop: 30, color: "#FE3E3E" }}>
                                    ฿{RevData?.isDiscountedRemovePrice}
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 25, marginTop: 30 }}>
                                    ฿{RevData?.isDisCountCamera}
                                </div>
                                {isEmpty(promotion_camera)
                                    ? null
                                    : <div style={{ fontFamily: "Itim-Regular", fontSize: 25, marginTop: 30, color: "#FE3E3E" }}>
                                        ฿{RevData.isAveragePerCamera}
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                            <div style={{ fontFamily: "Itim-Regular", backgroundColor: "#FFF", marginLeft: 40, fontSize: 30, }}>
                                รวม
                            </div >
                            <div style={{ fontFamily: "Itim-Regular", backgroundColor: "#FFF", marginLeft: 40, fontSize: 30, }}>
                                ฿{RevData?.isTotalPrice}
                            </div >
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", marginBottom: 30, flexDirection: "row", }}>
                    <div style={{ display: "flex", flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center", }}>
                        <div style={{}}>
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {isReciptPicName}
                            </div>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="file-upload"
                                    style={{
                                        backgroundColor: "#57DDC5",
                                        padding: "10px 20px",
                                        color: "#FFF",
                                        borderRadius: 10,
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        marginTop: 20,
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        cursor: "pointer"
                                    }}
                                >
                                    <img src={addcat} alt="Brief Screen" className="brief-image" style={{ width: 23, height: 23, }} />
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 40, marginLeft: 20 }}>
                                        อัพโหลดสลิป
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, borderRadius: 15, }}>
                        <div>
                            <div style={{ backgroundColor: "#FFF", display: 'flex', flexDirection: 'row', height: 60, borderRadius: 15, justifyContent: "space-between", paddingLeft: 30, paddingRight: 50, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "88%", marginLeft: 20 }}>
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                                    <img src={code} alt="Brief Screen" className="brief-image" style={{ width: 46, height: 46, }} />
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 30, width: "100%", paddingLeft: 20, height: 50, borderRadius: 15, marginTop: 10 }}>
                                        โค้ดส่วนลดของ กล้องวงจรปิด
                                    </div>
                                </div>
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center", fontFamily: "Itim-Regular", fontSize: 30, color: "#FE3E3E" }}>
                                    ({isEmpty(promotion_camera) ? 0 : promotion_camera}%)
                                </div>
                            </div>
                        </div>
                        <div
                            onClick={() => onConFirm()}
                            style={{ backgroundColor: "#7CD46E", alignSelf: "center", display: 'flex', flexDirection: 'row', height: 60, borderRadius: 15, paddingLeft: 30, paddingRight: 50, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: 560, height: 100, marginLeft: 20, marginTop: 30 }}>
                            <div style={{ flexDirection: "row", display: "flex", alignItems: "center", fontFamily: "Itim-Regular", fontSize: 30, color: "#FFF", justifyContent: "center", textAlign: "center", width: "100%", cursor: "pointer" }}>
                                ยืนยันการชำระเงิน
                            </div>
                        </div>
                        <div
                            onClick={() => goBack()}
                            style={{ backgroundColor: "#C43F3F", alignSelf: "center", display: 'flex', flexDirection: 'row', height: 60, borderRadius: 15, paddingLeft: 30, paddingRight: 50, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: 560, height: 100, marginLeft: 20, marginTop: 30 }}>
                            <div style={{ flexDirection: "row", display: "flex", alignItems: "center", fontFamily: "Itim-Regular", fontSize: 30, color: "#FFF", justifyContent: "center", textAlign: "center", width: "100%", cursor: "pointer" }}>
                                ยกเลิกทำรายการ
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
};