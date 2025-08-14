import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';
import addcat from '../asset/addcat.png'
import trash from '../asset/trash.png'
// import picroomcat from '../asset/picroomcat.png'

export default function DetailRes({ navigation }) {
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const isUser = firebase.auth().currentUser.uid;
    const [ReserveData, setReserveData] = useState([]);;
    const location = useLocation();
    const { item } = location.state || {};


    useEffect(() => {
        console.log("DetailRes..");
    }, []);

    const goBack = () => {
        navigate("/My-Reservation")
    }


    return (
        <>
            <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", fontSize: 24, position: "absolute", left: 10, top: 200 }}>
                {"<-"} ย้อนกลับ
            </div>
            <div style={{ flexDirection: "row", marginTop: 40, display: "flex", paddingLeft: 29, paddingBottom: 20, justifyContent: "center" }}>

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
                                {(item.status === "N")
                                    ? <div
                                        style={{ marginTop: 10, color: "#FFF", fontFamily: "Prompt-Medium", fontSize: 20, alignSelf: "center", backgroundColor: "#ECE431", borderRadius: 7, padding: 6 }}>
                                        รอยืนยันการจอง
                                    </div>
                                    : <div style={{ marginTop: 10, color: "#5E5B5B", fontFamily: "Prompt-Medium", fontSize: 20, alignSelf: "center" }}>
                                        ยืนยันการจองแล้ว
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {/* รายละเอียดชำระเงิน */}
                    <div style={{ backgroundColor: "#FFF", marginTop: 15, marginLeft: 25, borderRadius: 10, paddingBottom: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}>
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

                </div>
            </div>

        </>

    );
};