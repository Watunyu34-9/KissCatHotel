import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';
import calendar from '../asset/selectcalendar.png'
import Calendar from 'react-calendar';
import cat from '../asset/selectcat.png'
import camera from '../asset/camera.png'
import promotion from '../asset/promotion.png'
import promotionbig from '../asset/promotionbig.png'
import { isEmpty } from '../component/empty';
const moment = require('moment');
require('moment/locale/th');

export default function MakeReservation({ navigation }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { docList } = location.state || {};
    const { index } = location.state || {};
    const { docListInnerIndex } = location.state || {};
    const { promotion_camera } = location.state || {};
    const { docListInner } = location.state || {};
    console.log("promotion_camera: ", promotion_camera);
    console.log("docListInner: ", docListInner);
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const [isDetailPromotion, setDetailPromotion] = useState(false)
    // เช็ค me
    const [isMe, setMe] = useState([])
    //เช็คแมว
    const [isMyCat, setMyCat] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCats, setSelectedCats] = useState([]);
    const [isArrayCat, setArrayCat] = useState([]);
    console.log("isArrayCat: ", isArrayCat);
    const dropdownRef = useRef(null);
    //date
    const [isShowCalendar, setShowCalendar] = useState(false);
    const [isShowCalendarCheckOut, setShowCalendarCheckOut] = useState(false);
    const [maxSelectableDate, setMaxSelectableDate] = useState(new Date()); // ตั้งค่า maxSelectableDate เริ่มต้นเป็นวันปัจจุบัน
    const [isCheckIn, setCheckIn] = useState("") //ค่าเอาไปเช็ค
    const [isCheckOut, setCheckOut] = useState("") //ค่าเอาไปเช็ค
    const [isCheckInThaiShow, setCheckInThaiShow] = useState("") //ค่าเอาไปโชว์
    const [isCheckOutThaiShow, setCheckOutThaiShow] = useState("") //ค่าเอาไปโชว์
    const [isNumberOfDays, setNumberOfDays] = useState(0);
    //
    const [isCameRaSelect, setCameRaSelect] = useState(false) //ค่าเอาไปโชว์
    //รายละเอียดราคา
    const [isNormalPrice, setNormalprice] = useState(null)
    const [isAveragePerRoom, setAveragePerRoom] = useState(null)
    const [isAveragePerCamera, setAveragePerCamera] = useState(null)
    const [isDisCountCamera, setDisCountCamera] = useState(null)
    const [isPerCentPerRoom, setPercentPerRoom] = useState(0)
    const [isDiscountedPrice, setDiscountedPrice] = useState(null)
    const [isDiscountedRemovePrice, setDiscountedRemovePrice] = useState(null)
    const [isTotalPrice, setTotalPrice] = useState(null)

    useEffect(() => {
        console.log("MakeReservation..");
        CalculateMoney()
        getMyCat()
    }, [isNumberOfDays, isCameRaSelect, isNormalPrice, isAveragePerRoom, isAveragePerCamera, isDisCountCamera, isDiscountedPrice, isTotalPrice]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const goBack = () => {
        if (isDetailPromotion === true) {
            setDetailPromotion(false)
        } else {

            navigate("/Inner-Room", { state: { docList: docList, index: index, promotion_camera: promotion_camera, docListInner: docListInner, docListInnerIndex: docListInnerIndex, } });
        }
    }

    const convertToNumber = (value) => {
        if (!isNaN(value)) {
            return Number(value);
        } else {
            return null;
        }
    };



    const handleCheckboxChange = (event, catName, cat) => {
        const isChecked = event.target.checked;
        let catmax = convertToNumber(docList.capacity_room);

        if (isChecked && selectedCats.length < catmax) {
            setSelectedCats([...selectedCats, catName]);
            setArrayCat([...isArrayCat, cat])
        } else if (!isChecked) {
            setSelectedCats(selectedCats.filter(cat => cat !== catName));
            setArrayCat(isArrayCat.filter(cat => cat !== cat));
        } else if (isChecked && selectedCats.length >= catmax) {
            window.alert("ความจุแมวมากเกินไป...");
            event.preventDefault();
        }
    };

    const getReserv = async () => {
        if (selectedCats.length === 0) {
            window.alert("กรุณาทำการเลือกแมวที่จะเข้ามาในห้องพัก");
        } else if (!isCheckIn || !isCheckOut) {
            window.alert("กรุณาเลือก วันเช็คอิน กับ วันเช็คเอาท์ให้เรียบร้อย");
        } else {
            const RevData = {
                isCheckOut: isCheckIn,
                isCheckOut, isCheckOut,
                selectedCats, selectedCats,
                isMe: isMe,
                isArrayCat: isArrayCat,
                isNumberOfDays: isNumberOfDays,
                isDiscountedRemovePrice: isDiscountedRemovePrice,
                selectedCats: selectedCats,
                //ค่าแค่เอาไปแสดง
                isAveragePerRoom: isAveragePerRoom,
                isPerCentPerRoom: isPerCentPerRoom,
                isAveragePerCamera: isAveragePerCamera,
                isDisCountCamera: isDisCountCamera,
                isDiscountedRemovePrice: isDiscountedRemovePrice,
                isTotalPrice: isTotalPrice

            }
            navigate("/Confirmed-A-Reservation", { state: { docList: docList, index: index, promotion_camera: promotion_camera, docListInner: docListInner, docListInnerIndex: docListInnerIndex, RevData: RevData, isCameRaSelect: isCameRaSelect } });
        }
    };




    // const getReserv = async () => {
    //     console.log("วันเช็คอิน: ", isCheckIn); //วันเช็คอิน
    //     console.log("วันเช็คเอาท์t: ", isCheckOut); //วันเช็คเอาท์
    //     console.log("แมวที่เลือกมา: ", selectedCats); //แมวที่เลือกมา
    //     console.log("เอากล้องวงจรหรือไม่ ", isCameRaSelect); //เอากล้องวงจรหรือไม่isNumberOfDays
    //     console.log("ตอนนี้มีส่วนลดค่ากล้องเท่าไหร่", promotion_camera); //ตอนนี้มีส่วนลดค่ากล้องเท่าไหร่
    //     console.log("ตอนนี้ฉันจองกี่วันแล้ว ", isNumberOfDays); //ตอนนี้ฉันจองกี่วันแล้ว 

    //     if (selectedCats.length === 0) {
    //         window.alert("กรุณาทำการเลือกแมวที่จะเข้ามาในห้องพัก");
    //     } else if (!isCheckIn || !isCheckOut) {
    //         window.alert("กรุณาเลือก วันเช็คอิน กับ วันเช็คเอาท์ให้เรียบร้อย");
    //     } else {
    //         const randomCode = RandomMath(8)
    //         const isUser = firebase.auth().currentUser.uid;
    //         const adminRef = firebase.firestore().collection('admin');
    //         adminRef.doc(AdminDatabse).get().then((doc) => {
    //             if (doc.exists) {
    //                 // ตรวจสอบว่ามีข้อมูล my_catroom และมีข้อมูลภายใน
    //                 if (doc.data().my_catroom && doc.data().my_catroom.length > 0) {
    //                     const catroomIndex = doc.data().my_catroom.findIndex(catroom => catroom.id === docList.id);
    //                     const InnerRoomIndex = doc.data().my_catroom[catroomIndex].inner_room.findIndex(catroom => catroom.id === docListInner.id);
    //                     if (catroomIndex !== -1) {
    //                         let reservationData = {
    //                             //หมายเลขการจอง
    //                             rev_number: randomCode,
    //                             date_checkin: isCheckIn,
    //                             date_checkout: isCheckOut,
    //                             //รายละเอียดห้องพัก
    //                             type_room: docList.name_room,
    //                             name_room: docListInner.name_room,
    //                             cat_number: selectedCats,
    //                             price_room: docList.price_room,
    //                             price_toal: isTotalPrice
    //                         }
    //                         const innerRoomIndex = doc.data().my_catroom[catroomIndex].inner_room[InnerRoomIndex].my_reservation.findIndex(innerRoom => innerRoom.date_checkin === isCheckIn);
    //                         console.log("innerRoomIndex: ",innerRoomIndex);
    //                         if (innerRoomIndex !== -1) {
    //                             console.log("มีการจองในวันเดียวกันอยู่แล้ว");
    //                             // ทำตามขั้นตอนที่ต้องการเมื่อมีการจองในวันเดียวกันอยู่แล้ว
    //                         } else {
    //                             console.log("ยังไม่มีการจองในวันเดียวกัน");
    //                             // เพิ่มข้อมูลการจองลงในฟิลด์ my_reservation ของ inner_room
    //                             adminRef.doc(AdminDatabse).update({
    //                                 [`my_catroom.${catroomIndex}.inner_room`]: firebase.firestore.FieldValue.arrayUnion({
    //                                     status_inner: 'Y',
    //                                     my_reservation: [reservationData]
    //                                 })
    //                             }).then(() => {
    //                                 console.log("เพิ่มข้อมูลการจองเรียบร้อยแล้ว");
    //                                 navigate("/")
    //                                 // ทำตามขั้นตอนที่ต้องการหลังจากการเพิ่มข้อมูล
    //                             }).catch((error) => {
    //                                 console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลการจอง: ", error);
    //                             });
    //                         }
    //                     } else {
    //                         console.log("ไม่พบ catroom ที่ต้องการ");
    //                         // ทำตามขั้นตอนที่ต้องการหากไม่พบ catroom ที่ต้องการ
    //                     }
    //                 } else {
    //                     console.log("ไม่พบข้อมูล my_catroom");
    //                     // ทำตามขั้นตอนที่ต้องการหากไม่พบข้อมูล my_catroom
    //                 }
    //             } else {
    //                 console.log("ไม่พบเอกสาร admin ที่ต้องการ");
    //                 // ทำตามขั้นตอนที่ต้องการหากไม่พบเอกสาร admin
    //             }
    //         }).catch((error) => {
    //             console.error("เกิดข้อผิดพลาดในการดึงข้อมูล admin: ", error);
    //         });
    //     };

    // }

    const CalculateMoney = () => {
        let normal_price = convertToNumber(docList.price_room); //ราคามาตรฐาน
        setNormalprice(normal_price.toFixed(2));

        let days_number = convertToNumber(isNumberOfDays);  //จำนวนวันที่จอง
        let average_per_room = normal_price * days_number;
        setAveragePerRoom(average_per_room.toFixed(2));

        let discountCam = 0
        let discountCamera = 0

        let camera_per_room = 0
        if (isCameRaSelect) {//ติ๊กเอากล้อง
            if (isEmpty(promotion_camera)) {//ถ้าปิดโปรโมชั่น
                camera_per_room = 50 * days_number; //ราคากล้องวงจรปิด 50 บาท/วัน
                setDisCountCamera(camera_per_room.toFixed(2));

            } else {//ถ้าเปิดโปรโมชั่น
                camera_per_room = 50 * days_number; //ราคากล้องวงจรปิด 50 บาท/วัน
                setDisCountCamera(camera_per_room.toFixed(2));
                //คำนวณส่วนลด
                discountCam = convertToNumber(promotion_camera)
                discountCamera = camera_per_room * (discountCam / 100)
                console.log("discountCamera: ", discountCamera);
                setAveragePerCamera(discountCamera.toFixed(2))
            }

        } else {//ไม่เอากล้อง
            setAveragePerCamera(camera_per_room.toFixed(2))
            setDisCountCamera(camera_per_room.toFixed(2))
        }


        // คำนวณส่วนลดโปรโมชั่น
        let discount = 0;
        if (days_number >= 5 && days_number < 10) {
            discount = 0.05; // 5% ส่วนลด
            setPercentPerRoom(5)
        } else if (days_number >= 10 && days_number < 15) {
            discount = 0.1; // 10% ส่วนลด
            setPercentPerRoom(10)
        } else if (days_number >= 15) {
            discount = 0.15; // 15% ส่วนลด
            setPercentPerRoom(15)
        }


        // คำนวณราคาที่ต้องจ่ายหลังหักส่วนลด

        //average_per_room 3000 จำนวนราคาคูณห้อง 
        let final_discount = (average_per_room * discount);
        let discounted_price = average_per_room * (1 - discount);
        setDiscountedRemovePrice(final_discount.toFixed(2));
        setDiscountedPrice(discounted_price.toFixed(2)); //2700

        // ยอดรวมที่ต้องจ่าย
        let total_price

        if (isCameRaSelect) {//ติ๊กเอากล้อง
            if (isEmpty(promotion_camera)) {// ถ้าไม่มีโปรโมชั่นลดกล้อง
                total_price = discounted_price + camera_per_room;
            } else { // ถ้ามีโปรโมชั่นลดกล้อง
                total_price = (discounted_price + camera_per_room) - discountCamera;
            }
        } else { //ไม่เอากล้อง
            total_price = discounted_price
        }

        setTotalPrice(total_price.toFixed(2));
    }


    const getMyCat = async () => {
        const isUser = firebase.auth().currentUser.uid;
        const docRef = firebase.firestore().collection('users').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                setMe(data);
                if (data.my_cat && data.my_cat.length > 0) {
                    setMyCat(data.my_cat);
                } else {
                    setMyCat([]);
                }
            }
        });
    }

    //date
    //checkin
    const handleFilterClick = () => {

        setShowCalendar(!isShowCalendar) // เมื่อคลิกที่รูปภาพตัวกรอง ให้แสดงปฏิทิน
    };
    const handleDateClick = (value) => {
        setCheckIn(value);
        const thaiDate = moment(value).locale('th').format('DD MMM YYYY', 'th');
        console.log("Thai date: ", thaiDate);
        setCheckInThaiShow(thaiDate)
        updateNumberOfDays(value, isCheckOut);
        setShowCalendar(false);
        CalculateMoney();
    };
    const handlePrevMonthClick = () => {
        setMaxSelectableDate(new Date(maxSelectableDate.getFullYear(), maxSelectableDate.getMonth() - 1, maxSelectableDate.getDate()));
    };

    const handleNextMonthClick = () => {
        setMaxSelectableDate(new Date(maxSelectableDate.getFullYear(), maxSelectableDate.getMonth() + 1, maxSelectableDate.getDate()));
    };
    const handleDropdownToggle = () => {
        console.log("isMyCat: ", isMyCat);

        if (isMyCat.length === 0) {
            alert('ท่านยังไม่มีข้อมูลแมวของท่าน กรุณาทำการเพิ่มข้อมูลแมวก่อน');
        } else {
            setIsOpen(!isOpen);
        }

    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    //Checkout
    const handleFilterClickCheckout = () => {
        setShowCalendarCheckOut(!isShowCalendarCheckOut) // เมื่อคลิกที่รูปภาพตัวกรอง ให้แสดงปฏิทิน
        CalculateMoney();
    };
    const handleDateClickCheckout = (value) => {
        setCheckOut(value);
        const thaiDate = moment(value).locale('th').format('DD MMM YYYY', 'th');
        console.log("Thai date: ", thaiDate);
        setCheckOutThaiShow(thaiDate)
        CalculateMoney()
        updateNumberOfDays(isCheckIn, value);
        setShowCalendarCheckOut(false)
    };
    const tileClassName = ({ date }) => {
        // ตรวจสอบว่าวันที่ตรงกับวันเช็คอินหรือเช็คเอาท์หรือไม่
        if (isCheckIn && date.toDateString() === isCheckIn.toDateString()) {
            if (isCheckOut && date.toDateString() === isCheckOut.toDateString()) {
                // ถ้าวันที่เป็นเช็คอินและเช็คเอาท์ในวันเดียวกันให้สีเป็นเขียว
                return 'check-in-out';
            } else {
                // ถ้าเป็นเฉพาะเช็คอินให้สีเป็นแดง
                return 'check-in-date';
            }
        }
        if (isCheckOut && date.toDateString() === isCheckOut.toDateString()) {
            // ถ้าเป็นเฉพาะเช็คเอาท์ให้สีเป็นน้ำเงิน
            return 'check-out-date';
        }
        return null;
    };

    const updateNumberOfDays = (checkInDate, checkOutDate) => {
        if (!checkInDate || !checkOutDate) return;

        // แปลงวันที่เป็นวัตถุ Date
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);

        // ลบวันที่เช็คอินออกจากวันที่เช็คเอาท์ แล้วเพิ่ม 1 เพื่อนับวันแรกด้วย
        const differenceInDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

        // ถ้าคำนวณเป็น 0 ให้เปลี่ยนเป็น 1
        const numberOfDays = Math.max(Math.ceil(differenceInDays), 1);

        // เซ็ตจำนวนวันลง state
        setNumberOfDays(numberOfDays);
    };

    const onSelctCamera = () => {
        setCameRaSelect(!isCameRaSelect)
        CalculateMoney();
    }

    return (
        <>
            <div style={{ marginLeft: 20, marginRight: 20, marginBottom: 30 }}>
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ flex: 1, marginRight: 40 }}>
                        <div style={{ flexDirection: "row", display: "flex" }}>
                            <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", fontSize: 24 }}>
                                {"<-"} ย้อนกลับ
                            </div>
                        </div>
                        {(isDetailPromotion)
                            ? <div style={{
                                backgroundColor: "#FFF",
                                borderRadius: 10,
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                marginTop: 40,
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                flexDirection: "column",
                                width: "100%",
                                height: 560,
                                cursor: "pointer",
                                paddingBottom: 40
                            }}
                                onClick={() => setDetailPromotion(false)}
                            >
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center", width: "100%", justifyContent: "center", paddingBottom: 30, borderBottomWidth: 2, borderBottomColor: "#EAEAEA", borderBottomStyle: "solid", }}>
                                    <img src={promotionbig} alt="Brief Screen" className="brief-image" style={{ width: 113, height: 113 }} />
                                    <div style={{ fontSize: 36, fontFamily: "Itim-Regular", marginLeft: 60 }}>
                                        โปรโมชั่น
                                    </div>
                                </div>
                                <div style={{ flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                                    <div style={{ flexDirection: "column", display: "flex", alignItems: "center", marginTop: 50 }}>

                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", }}>
                                            เงื่อนไข
                                        </div>
                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", }}>
                                            • ลดราคา 5 %
                                        </div>
                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", marginBottom: 40 }}>
                                            หากจากครบ 5 วัน ได้รับส่วนลด 5 %
                                        </div>
                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", }}>
                                            • ลดราคา 10 %
                                        </div>
                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", marginBottom: 40 }}>
                                            หากจากครบ 10 วัน ได้รับส่วนลด 10 %
                                        </div>
                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", }}>
                                            •  ลดราคา 15 %
                                        </div>
                                        <div style={{ fontSize: 22, fontFamily: "Itim-Regular", }}>
                                            หากจากครบ 15 วัน ได้รับส่วนลด 15 %
                                        </div>
                                    </div>
                                </div>

                            </div>
                            : <div style={{
                                backgroundColor: "#FFF",
                                borderRadius: 10,
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                marginTop: 40,
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 40,
                                        height: 200,
                                        boxSizing: "border-box",
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#EAEAEA",
                                        position: "relative",
                                        cursor: "pointer",
                                        // backgroundColor: "red"
                                    }}
                                        onClick={() => handleFilterClick()}
                                    >
                                        <div style={{
                                            content: '""',
                                            position: 'absolute',
                                            right: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 1,
                                            height: '80%',
                                            backgroundColor: '#EAEAEA',

                                        }}></div>
                                        <img src={calendar} alt="Brief Screen" className="brief-image" style={{ width: 76, height: 76 }} />
                                        <div style={{ flexDirection: "column", display: "flex" }}>
                                            <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 20, justifyContent: "center", display: "flex" }}>เช็คอิน</div>
                                            {(isCheckInThaiShow !== "") ? <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 16 }}>{isCheckInThaiShow}</div> : null}
                                        </div>

                                    </div>
                                    {(isShowCalendar === true) && ( // แสดงปฏิทินเมื่อ showCalendar เป็น true
                                        <div
                                            style={{
                                                position: "absolute", zIndex: 99999, width: "100%", height: 0, right: 0, top: 40, backgroundColor: "red"
                                            }}
                                        >
                                            <Calendar className="custom-calendar"
                                                onClickDay={handleDateClick}
                                                value={isCheckIn}
                                                minDate={new Date()}
                                                maxDate={isCheckOut}
                                                onClickMonthPrev={handlePrevMonthClick}
                                                onClickMonthNext={handleNextMonthClick} // เพิ่มการกำหนดฟังก์ชันที่จะเรียกเมื่อผู้ใช้คลิกปุ่ม ">"
                                                tileClassName={tileClassName}
                                            />
                                        </div>
                                    )}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 40,
                                        height: 200,
                                        boxSizing: "border-box",
                                        position: "relative",
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#EAEAEA"
                                    }}>
                                        <div style={{
                                            content: '""',
                                            position: 'absolute',
                                            right: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 1,
                                            height: '80%',
                                            backgroundColor: '#EAEAEA',

                                        }}></div>
                                        <img src={calendar} alt="Brief Screen" className="brief-image" style={{ width: 76, height: 76 }} />

                                        {(isNumberOfDays === 0)
                                            ? <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 20 }}>จำนวนวัน</div>
                                            : <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 20, marginBottom: 10 }}>จำนวนวัน</div>
                                                <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 17 }}>{isNumberOfDays} วัน</div>
                                            </div>}
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 40,
                                        height: 200,
                                        boxSizing: "border-box",
                                        position: "relative"
                                    }}>
                                        < div style={{
                                            content: '""',
                                            position: 'absolute',
                                            right: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 1,
                                            height: '80%',
                                            backgroundColor: '#EAEAEA',
                                        }}></div>
                                        <img src={camera} alt="Brief Screen" className="brief-image" style={{ width: 68, height: 68, fontFamily: "Itim-Regular" }} />
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                            <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 20 }}>กล้องวงจรปิด</div>
                                            <div style={{ marginLeft: 25, display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                                <label style={{ position: "relative", display: "inline-block", width: 26, height: 26 }}>
                                                    <span onClick={() => onSelctCamera()} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#FFF", transition: ".4s", borderRadius: 4, borderWidth: 2, borderStyle: "solid", borderColor: "#000", cursor: "pointer" }}></span>
                                                    {isCameRaSelect && <span onClick={() => onSelctCamera()} style={{ position: "absolute", bottom: -4, left: 2, color: "#000", fontSize: 26, cursor: "pointer", width: 22 }}>✓</span>}
                                                </label>
                                                <div
                                                    style={{
                                                        marginLeft: 5, fontFamily: "Itim-Regular", fontSize: 20
                                                    }}>
                                                    50 ฿ / วัน
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 40,
                                        height: 200,
                                        boxSizing: "border-box",
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#EAEAEA",
                                        position: "relative",
                                        cursor: "pointer",
                                    }}
                                        onClick={handleFilterClickCheckout}
                                    >

                                        <div style={{
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 1,
                                            height: '80%',
                                            backgroundColor: '#EAEAEA',
                                        }}></div>
                                        <img src={calendar} alt="Brief Screen" className="brief-image" style={{ width: 76, height: 76 }} />
                                        <div style={{ flexDirection: "column", display: "flex" }}>
                                            <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 20, justifyContent: "center", display: "flex" }}>เช็คเอาท์</div>
                                            {(isCheckOutThaiShow !== "") ? <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 16 }}>{isCheckOutThaiShow}</div> : null}
                                        </div>
                                    </div>
                                    {isShowCalendarCheckOut && ( // แสดงปฏิทินเมื่อ showCalendar เป็น true
                                        <div style={{ position: "absolute", zIndex: 99999, left: 0, top: 40, backgroundColor: "red", height: 0 }}>
                                            <Calendar className="custom-calendar"
                                                onClickDay={handleDateClickCheckout}
                                                onClickMonthPrev={handlePrevMonthClick} // เพิ่มการกำหนดฟังก์ชันที่จะเรียกเมื่อผู้ใช้คลิกปุ่ม "<"
                                                onClickMonthNext={handleNextMonthClick} // เพิ่มการกำหนดฟังก์ชันที่จะเรียกเมื่อผู้ใช้คลิกปุ่ม ">"
                                                minDate={(isCheckIn === "") ? new Date() : isCheckIn}
                                                tileClassName={tileClassName}
                                                value={isCheckOut}
                                            />
                                        </div>
                                    )}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 40,
                                        height: 200,
                                        boxSizing: "border-box",
                                        position: "relative",
                                        borderBottomWidth: 2,
                                        borderBottomStyle: "solid",
                                        borderBottomColor: "#EAEAEA",
                                    }}>
                                        <div style={{
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 1,
                                            height: '80%',
                                            backgroundColor: '#EAEAEA',
                                        }}></div>
                                        <img src={cat} alt="Brief Screen" className="brief-image" style={{ width: 71, height: 71 }} />
                                        <div style={{ position: 'relative', marginLeft: 20 }}>
                                            <div
                                                style={{
                                                    fontFamily: 'Itim-Regular',
                                                    fontSize: 16,
                                                    backgroundColor: '#848484',
                                                    color: '#FFF',
                                                    padding: '10px 20px',
                                                    borderRadius: 5,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                                onClick={handleDropdownToggle}
                                            >
                                                <span>
                                                    เลือกแมว
                                                </span>
                                                <span style={{ marginLeft: 'auto', paddingLeft: 10 }}>▼</span>
                                            </div>
                                            {isOpen && (
                                                <div
                                                    ref={dropdownRef}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        backgroundColor: '#FFF',
                                                        border: '1px solid #ccc',
                                                        borderRadius: 5,
                                                        marginTop: 5,
                                                        zIndex: 1,
                                                        width: '100%'
                                                    }}
                                                >
                                                    {isMyCat.map((cat, index) => (
                                                        <label key={index} style={{
                                                            display: 'block', padding: '10px', cursor: 'pointer', userSelect: 'none', fontFamily: 'Itim-Regular',
                                                            fontSize: 16,
                                                        }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedCats.includes(cat.name_cat)}
                                                                onChange={(e) => handleCheckboxChange(e, cat.name_cat, cat)}
                                                                style={{
                                                                    marginRight: 8,
                                                                    fontFamily: 'Itim-Regular',
                                                                    fontSize: 16,
                                                                }}
                                                            />
                                                            {cat.name_cat}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 40,
                                        height: 200,
                                        boxSizing: "border-box",
                                        position: "relative",
                                        cursor: "pointer",
                                    }}
                                        onClick={() => setDetailPromotion(true)}
                                    >
                                        < div style={{
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 1,
                                            height: '80%',
                                            backgroundColor: '#EAEAEA',
                                        }}></div>
                                        <img src={promotion} alt="Brief Screen" className="brief-image" style={{ width: 66, height: 66, fontFamily: "Itim-Regular" }} />
                                        <div style={{ marginLeft: 20, fontFamily: "Itim-Regular", fontSize: 20 }}>โปรโมชั่น</div>
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                    <div style={{ backgroundColor: "#FFF", flex: 1, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", padding: 20, paddingBottom: 50, borderBottomWidth: 2, borderBottomColor: "#EAEAEA", borderBottomStyle: "solid" }}>
                            <div style={{ width: "50%", justifyContent: "space-between", boxSizing: "border-box", }}>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <div style={{ boxSizing: "border-box", display: "flex" }}>
                                        <img src={docList.pic} alt="Brief Screen" className="brief-image" style={{ width: "100%", height: 262, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, marginRight: 20 }} />
                                    </div>
                                    <div style={{ flexDirection: "column", display: "flex", marginLeft: 20, justifyContent: "space-between" }}>
                                        {(docList.pic_component2) ? <img src={docList.pic_component2} alt="Brief Screen" className="brief-image" style={{ width: 97, height: 77, borderTopRightRadius: 15 }} /> : null}
                                        {(docList.pic_component3) ? <img src={docList.pic_component3} alt="Brief Screen" className="brief-image" style={{ width: 97, height: 77, borderTopRightRadius: 15 }} /> : null}
                                        {(docList.pic_component4) ? <img src={docList.pic_component4} alt="Brief Screen" className="brief-image" style={{ width: 97, height: 77, borderTopRightRadius: 15 }} /> : null}
                                    </div>
                                </div>
                            </div>
                            <div style={{ justifyContent: "space-between", display: "flex", width: "50%", paddingLeft: 30, boxSizing: "border-box", flexDirection: "column", alignItems: "flex-start" }}>
                                <div style={{ fontSize: 30, fontFamily: "Itim-Regular" }}>
                                    {docList.name_room}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", flexDirection: "row", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "10px 40px" }}>
                                    <img src={cat} alt="Brief Screen" className="brief-image" style={{ width: 37, height: 37 }} />
                                    {selectedCats.length === 0
                                        ? <div style={{ fontSize: 20, fontFamily: "Prompt-Bold", marginLeft: 10 }}>
                                            0
                                        </div>
                                        : <div style={{ fontSize: 20, fontFamily: "Prompt-Bold", marginLeft: 10 }}>
                                            {selectedCats.length}
                                        </div>
                                    }
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", }}>
                                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", flexShrink: 0 }}>
                                        ความจุ :
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginLeft: 10 }}>
                                        {docList.capacity_room} ตัว
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", }}>
                                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", flexShrink: 0 }}>
                                        ขนาด :
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginLeft: 10 }}>
                                        {docList.size_room} เมตร
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", }}>
                                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", flexShrink: 0 }}>
                                        รายละเอียด :
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginLeft: 10 }}>
                                        {docList.detail_room}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", marginTop: 30 }}>
                            <div style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 30, borderBottomWidth: 2, borderBottomColor: "#EAEAEA", borderBottomStyle: "solid" }}>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 32 }}>
                                    รายละเอียดราคา
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10 }}>
                                            ราคามาตรฐาน (฿{isNormalPrice} ต่อ วัน)
                                        </div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10 }}>
                                            ราคาเฉลี่ยต่อห้อง (฿{isNormalPrice} x {isNumberOfDays} วัน)
                                        </div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10 }}>
                                            บริการเสริม (฿50 x {(isCameRaSelect) ? isNumberOfDays : 0} วัน)
                                        </div>
                                        {(isCameRaSelect)
                                            ? (isEmpty(promotion_camera))
                                                ? < div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, color: "#FE3E3E" }}>
                                                    ส่วนลดกล้องวงจรปิด (0%)
                                                </div>
                                                : < div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, color: "#FE3E3E" }}>
                                                    ส่วนลดกล้องวงจรปิด ({promotion_camera}%)
                                                </div>
                                            : null
                                        }
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, color: "#FE3E3E" }}>
                                            ส่วนลดราคาห้องพัก ({isPerCentPerRoom}%)
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10 }}>
                                            ฿{isNormalPrice}
                                        </div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10 }}>
                                            ฿{isAveragePerRoom}
                                        </div>
                                        {/* บริการเสริม */}
                                        {(isCameRaSelect)//ติํกเอากล้อง
                                            ? (isEmpty(promotion_camera))//ถ้าปิดโปรโมชั่น
                                                ? <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, }}>
                                                    ฿{isDisCountCamera}
                                                </div>
                                                //ถ้าเปิดโปรโมชั่น
                                                : < div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10 }}>
                                                    ฿{isDisCountCamera}
                                                </div>
                                            // ไม่เอากล้อง
                                            : <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, }}>
                                                ฿{isDisCountCamera}
                                            </div>//
                                        }
                                        {/* ส่วนลดกล้องวงจรปิด  */}
                                        {(isCameRaSelect)
                                            ? (isEmpty(promotion_camera))
                                                ? < div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, color: "#FE3E3E" }}>
                                                    ฿ {isAveragePerCamera}
                                                </div>
                                                : < div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, color: "#FE3E3E" }}>
                                                    ฿{isAveragePerCamera}
                                                </div>
                                            : null
                                        }
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, color: "#FE3E3E" }}>
                                            ฿{isDiscountedRemovePrice}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", marginTop: 50, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 26, marginTop: (isCameRaSelect) ? -10 : null, marginLeft: 40, }}>
                                ราคารวม  (1 x {docList.name_room})
                            </div>
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: (isCameRaSelect) ? -10 : null, marginRight: 40 }}>
                                ฿{isTotalPrice}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end", flexDirection: "row" }}>
                    <div
                        onClick={() => getReserv()}
                        style={{ cursor: "pointer", backgroundColor: "#714B1C", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", padding: "30px 120px", marginRight: "14%", borderRadius: 10, fontSize: 20, fontFamily: "Itim-Regular", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        บันทึกการจอง
                    </div>
                </div>
            </div >

        </>

    );
};