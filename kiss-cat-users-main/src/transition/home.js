import React, { useEffect, useState, useContext } from 'react';
import '../App.css'
import breaking from '../asset/breaking.png'
import produc1 from '../asset/รูปสินค้า1.png'
import product2 from '../asset/รูปสินค้า2.png'
import product3 from '../asset/รูปสินค้า3.png'
import product4 from '../asset/รูปสินค้า4.png'
import { firebase } from "../backend/backend"
import { useNavigate } from "react-router-dom";
import { Footer } from '../component/footer';
import { SearchContext } from '../component/searchcontext';
import { isEmpty } from '../component/empty';


export default function Home({ navigation }) {
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const [isCatRoomData, setCatRoomData] = useState([])
    const { searchQuery } = useContext(SearchContext);
    console.log("searchQuery ค้นหาาา : ", searchQuery);
    const [filteredRooms, setFilteredRooms] = useState(isCatRoomData);
    const [isPromotionIson, setPromotionIson] = useState(null);
    const isProduct = [{
        name: "PETTOSAN ทรายแมวเต้าหู้ ชาโคล (6 ลิตร)",
        price: "165",
        pic: produc1,
        detail: [
            "จับเป็นก้อน",
            "ดูดซับสูง",
            "การควบคุมกลิ่น",
            "ทิ้งลงชักโครกได้",
        ],
        id: 1,
        detail_product: [
            "ผลิตจารกวัตถุดิบธรรมชาติ 100%",
            "ปลอดภัยต่อสัตว์เลี้ยง",
            "ขนาดแท่งเล็ก 1.5 mm ช่วยประหยัดทรายในการใช้งาน",
            "ดูดซับจับก้อนได้อย่างรวดเร็ว",
            "ไม่แต่งกลิ่น เพิ่มประสิทธิภาพการดูดซับกลิ่นได้ดี",
            "ปราศจากฝุ่นและเชื้อรา",
            "สามารถย่อยสลาย ละลายน้ำ และทิ้งลงชักโครกได้",
        ],
        weight: "4.54"
    },
    {
        name: "PETTOSAN ทรายแมวเต้าหู้ กลิ่นสตอเบอร์รี่ (6 ลิตร)",
        price: "165",
        pic: product2,
        detail: [
            "จับเป็นก้อน",
            "ดูดซับสูง",
            "การควบคุมกลิ่น",
            "ทิ้งลงชักโครกได้",
        ],
        id: 2,
        detail_product: [
            "ผลิตจารกวัตถุดิบธรรมชาติ 100%",
            "ปลอดภัยต่อสัตว์เลี้ยง",
            "ขนาดแท่งเล็ก 1.5 mm ช่วยประหยัดทรายในการใช้งาน",
            "ดูดซับจับก้อนได้อย่างรวดเร็ว",
            "ไม่แต่งกลิ่น เพิ่มประสิทธิภาพการดูดซับกลิ่นได้ดี",
            "ปราศจากฝุ่นและเชื้อรา",
            "สามารถย่อยสลาย ละลายน้ำ และทิ้งลงชักโครกได้",
        ],
        weight: "4.54"
    },
    {
        name: "PETTOSAN ทรายแมวเต้าหู้ กลิ่นนมฮอกไกโด (6 ลิตร)",
        price: "165",
        pic: product3,
        detail: [
            "จับเป็นก้อน",
            "ดูดซับสูง",
            "การควบคุมกลิ่น",
            "ทิ้งลงชักโครกได้",
        ],
        id: 3,
        detail_product: [
            "ผลิตจารกวัตถุดิบธรรมชาติ 100%",
            "ปลอดภัยต่อสัตว์เลี้ยง",
            "ขนาดแท่งเล็ก 1.5 mm ช่วยประหยัดทรายในการใช้งาน",
            "ดูดซับจับก้อนได้อย่างรวดเร็ว",
            "ไม่แต่งกลิ่น เพิ่มประสิทธิภาพการดูดซับกลิ่นได้ดี",
            "ปราศจากฝุ่นและเชื้อรา",
            "สามารถย่อยสลาย ละลายน้ำ และทิ้งลงชักโครกได้",
        ],
        weight: "4.54"
    },
    {
        name: "PETTOSAN ทรายแมวเต้าหู้ กลิ่นสตอเบอร์รี่ (6 ลิตร)",
        price: "165",
        pic: product4,
        detail: [
            "จับเป็นก้อน",
            "ดูดซับสูง",
            "การควบคุมกลิ่น",
            "ทิ้งลงชักโครกได้",
        ],
        id: 4,
        detail_product: [
            "ผลิตจารกวัตถุดิบธรรมชาติ 100%",
            "ปลอดภัยต่อสัตว์เลี้ยง",
            "ขนาดแท่งเล็ก 1.5 mm ช่วยประหยัดทรายในการใช้งาน",
            "ดูดซับจับก้อนได้อย่างรวดเร็ว",
            "ไม่แต่งกลิ่น เพิ่มประสิทธิภาพการดูดซับกลิ่นได้ดี",
            "ปราศจากฝุ่นและเชื้อรา",
            "สามารถย่อยสลาย ละลายน้ำ และทิ้งลงชักโครกได้",
        ],
        weight: "4.54"
    }
    ]

    useEffect(() => {
        console.log("home..");
        getRoomsData()
        getPromotionIson()
    }, []);

    const getRoomsData = async () => {
        const docRef = firebase.firestore().collection('admin').doc(AdminDatabse);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                if (data.my_catroom && data.my_catroom.length > 0) {
                    setCatRoomData(data.my_catroom);
                } else {
                    setCatRoomData([]);
                }
            }
        });
    }

    const getPromotionIson = async () => {
        const docRef = firebase.firestore().collection('admin').doc(AdminDatabse);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                if (data.my_promotion && data.my_promotion.length > 0) {
                    const promotion = data.my_promotion.find(promo => promo.promotion_ison === 'Y');
                    console.log("promotion: ", promotion);
                    if (promotion) {
                        setPromotionIson(promotion.discount);
                    } else {
                        console.log("ไม่มีโปรโมชั่นที่ใช้งานอยู่....");
                        setPromotionIson(null);
                    }
                } else {
                    console.log("ไม่มีโปรโมชั่น....");
                    setPromotionIson(null);
                }
            } else {
                console.log("ไม่พบข้อมูลในเอกสาร....");
                setPromotionIson(null);
            }
        });
    };


    const goInnerRoom = (item, index) => {
        console.log("item goInnerRoom: ", item);
        console.log("index goInnerRoom: ", index);
        navigate("/Inner-Room", { state: { docList: item, index: index, promotion_camera: isPromotionIson } });
    }
    const goDetailProduct = (item, index) => {
        console.log("item goInnerRoom: ", item);
        navigate("/Detail-Product", { state: { item: item, } });
    }

    return (
        <>
            <div style={{ backgroundColor: "#FFFFFF", marginTop: 40, borderRadius: 20, alignItems: "center", display: "flex", flexDirection: "row", marginLeft: 20, marginRight: 20, paddingLeft: 40, overflow: "hidden", position: "relative" }}>
                <img
                    src={breaking} alt="Brief Screen" className="brief-image" style={{ width: 56, height: 54, position: 'relative', zIndex: 1 }}
                />
                <div style={{
                    position: 'absolute',
                    left: 'calc(56px + 40px)',
                    right: 0,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    {isEmpty(isPromotionIson)
                        ? <div className="marquee" style={{ fontFamily: "Itim-Regular", fontSize: 32, marginLeft: 30 }}>
                            ยังมีไม่มีส่วนลดกล้องวงจรปิดในขณะนี้ ...
                        </div>
                        : <div className="marquee" style={{ fontFamily: "Itim-Regular", fontSize: 32, marginLeft: 30 }}>
                            โปรโมชั่น!! จองวันนี้ ได้รับส่วนลดราคากล้องวงจรปิด {isPromotionIson}% ไปเลย!!
                        </div>
                    }
                </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", marginTop: 40, borderRadius: 20, display: "flex", flexDirection: "column", marginLeft: 20, marginRight: 20, paddingLeft: 40, paddingBottom: 40, position: "relative", overflow: "hidden", }}>
                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginLeft: 30, marginTop: 20 }}>
                    ประเภทห้องพัก
                </div>
                {isCatRoomData.length === 0
                    ? <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginTop: 20, flexDirection: "row", display: "flex", paddingBottom: 20, paddingLeft: 200, color: "red" }}>
                        ยังไม่มีห้องพักพร้อมใช้งานในขณะนี้...
                    </div>
                    : <div style={{ marginTop: 20, flexDirection: "row", display: "flex", overflowX: "auto", paddingBottom: 20 }}>
                        {isCatRoomData.map((item, index) => (
                            <div
                                onClick={() => goInnerRoom(item, index)}
                                style={{
                                    backgroundColor: "#FFF", padding: 20, borderRadius: 10, marginRight: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer", flex: "0 0 auto", maxWidth: 317
                                }}>
                                <img
                                    src={item.pic} alt="Brief Screen" className="brief-image" style={{ width: 317, height: 174, borderRadius: 5 }}
                                />
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        {item.name_room} ({item.size_room} ม.)
                                    </div>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 16, backgroundColor: "#714B1C", borderRadius: 5, paddingLeft: 5, paddingRight: 5, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                                        {item.price_room} ฿
                                    </div>
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 16, marginTop: 10, wordWrap: "break-word", whiteSpace: "normal" }}>
                                    รายละเอียด
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 16, wordWrap: "break-word", whiteSpace: "normal" }}>
                                    {item.detail_room}
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, backgroundColor: "#714B1C", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", padding: "10px 0px" }}>
                                    เลือก
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div style={{ backgroundColor: "#FFFFFF", marginTop: 40, borderRadius: 20, display: "flex", flexDirection: "column", marginLeft: 20, marginRight: 20, paddingLeft: 40, paddingBottom: 40, position: "relative", overflow: "hidden", }}>
                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginLeft: 30, marginTop: 20 }}>
                    สินค้า
                </div>
                <div style={{ marginTop: 20, flexDirection: "row", display: "flex", overflowX: "auto", paddingBottom: 20 }}>
                    {isProduct.map((item, index) => (
                        <div
                            onClick={() => goDetailProduct(item, index)}
                            style={{ backgroundColor: "#FFFFFF", padding: 20, borderRadius: 10, marginRight: 20, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer", flex: "0 0 auto", maxWidth: 317 }}
                        >
                            <img
                                src={item.pic} alt="Brief Screen" className="brief-image" style={{ width: 317, height: 174, borderRadius: 5 }}
                            />
                            {(item.id === 1)
                                ? <div>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        PETTOSAN ทรายแมวเต้าหู้ ชาโคล
                                    </div>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        (6 ลิตร)
                                    </div>
                                </div>
                                : (item.id === 2)
                                    ? <div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                            PETTOSAN ทรายแมวเต้าหู้
                                        </div>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                            กลิ่นสตอเบอร์รี่ (6 ลิตร)
                                        </div>
                                    </div>
                                    : (item.id === 3)
                                        ? <div>
                                            <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                                PETTOSAN ทรายแมวเต้าหู้
                                            </div>
                                            <div style={{ fontFamily: "Itim-Regular", fontSize: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                                กลิ่นนมฮอกไกโด (6 ลิตร)
                                            </div>
                                        </div>
                                        : <div>
                                            <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                                PETTOSAN ทรายแมวเต้าหู้
                                            </div>
                                            <div style={{ fontFamily: "Itim-Regular", fontSize: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                                กลิ่นสตอเบอร์รี่ (6 ลิตร)
                                            </div>
                                        </div>
                            }
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 36, wordWrap: "break-word", whiteSpace: "normal", marginTop: 10 }}>
                                {item.price} ฿
                            </div>
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 20, marginTop: 10, backgroundColor: "#714B1C", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", padding: "10px 0px" }}>
                                ดู
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            < Footer />
        </>

    );
};