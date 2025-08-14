import React, { useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { Footer } from '../component/footer';
import detailproduc1 from '../asset/รายละเอียดสินค้า1.png'
import detailproduc2 from '../asset/รายละเอียดสินค้า2.png'
import detailproduc3 from '../asset/รายละเอียดสินค้า3.png'
import detailproduc4 from '../asset/รายละเอียดสินค้า4.png'
import correct from '../asset/correct.png'


export default function DetailProduct({ navigation }) {
    // const isUser = firebase.auth().currentUser.uid;
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const location = useLocation();
    const { item } = location.state || {};
    console.log("รัับค่า: ", item);

    useEffect(() => {
        console.log("DetailProduct..");

    }, []);

    const goBack = () => {
        navigate("/")
    }

    const checkPicProduct = (item) => {
        if (item.id === 1) {
            return detailproduc1
        } else if (item.id === 2) {
            return detailproduc2
        } else if (item.id === 3) {
            return detailproduc3
        } else if (item.id === 4) {
            return detailproduc4
        }
    }


    return (
        <>
            <div style={{ marginLeft: 20, marginRight: 20, }}>
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex" }}>
                    <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}>
                        {"<-"} ย้อนกลับ
                    </div>
                </div>
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex", gap: 20 }}>
                    <img
                        src={checkPicProduct(item)} alt="Brief Screen" className="brief-image" style={{ width: 456, height: 492, marginRight: 20, borderRadius: 15, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}
                    />
                    <div style={{ backgroundColor: "#FFF", display: "flex", marginRight: 20, width: 450, height: 536, flexDirection: "column", borderRadius: 15, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}>
                        <div style={{ marginTop: 30, marginLeft: 26 }}>
                            <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 36, }}>
                                {item.name}
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignItems: "center", marginTop: 10 }}>
                                <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 24 }}>
                                    ราคา
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 32, color: "#714B1C", marginLeft: 10 }}>
                                    ฿{item.price}
                                </div>
                            </div>
                            <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 24, marginTop: 20 }}>
                                ข้อมูลจำเพาะของสินค้า
                            </div>
                            <div style={{ flexDirection: "column", display: "flex" }}>
                                {item.detail.map((detailItem, index) => (
                                    <div style={{ flexDirection: "row", display: "flex" }}>
                                        <div key={index} style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 20, marginTop: 30, color: "#714B1C" }}>
                                            •
                                        </div>
                                        <div key={index} style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 20, marginTop: 30, color: "#714B1C", marginLeft: 20 }}>
                                            {detailItem}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignItems: "center", marginTop: 30, marginLeft: 10 }}>
                                <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 24 }}>
                                    น้ำหนัก :
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 20, color: "#714B1C", marginLeft: 10 }}>
                                    {item.weight}
                                </div>
                            </div>

                        </div>

                    </div>
                    <div style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", display: "flex", justifyContent: "center", alignItems: "center", width: 558, height: 536, borderRadius: 15, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 32 }}>
                                รายละเอียดสินค้า
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 20 }}>
                                {item.detail_product.map((detailprodct, index) => (
                                    <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                        <img
                                            src={correct} alt="Brief Screen" className="brief-image" style={{ width: 43, height: 43 }}
                                        />
                                        <div style={{ fontFamily: "Itim-Regular", wordWrap: "break-word", whiteSpace: "normal", fontSize: 20, color: "#714B1C", marginLeft: 20 }}>
                                            {detailprodct}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>

    );
};