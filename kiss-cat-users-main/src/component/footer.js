import React from "react";
import contract from '../asset/contract.png'

export const Footer = () => {
    return (
        <>
            <div style={{ backgroundColor: "#714B1C", marginTop: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, display: "flex", flexDirection: "row", marginLeft: 20, marginRight: 20, paddingLeft: 40, paddingBottom: 40, justifyContent: "space-around", paddingTop: 40 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF" }}>
                        ที่อยู่ :
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        33/102 ซอยบุญคุ้ม 3
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        อำเภอลำลูกกา
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        ปทุมธานี
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        12130
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF" }}>
                        เวลาทำการ :
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันจันทร์ 8:00-20:00
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันศุกร์ 8:00-20:00
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันอังคาร 8:00-20:00
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันเสาร์ 8:00-20:00
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันพุธ 8:00-20:00
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันอาทิตย์ 8:00-20:00
                        </div>
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        วันพฤหัสบดี 8:00-20:00
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF" }}>
                        ติดต่อ
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF", marginTop: 20 }}>
                        โทรศัพท์: 098 444 6388
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <img
                            src={contract} alt="Brief Screen" className="brief-image" style={{ width: 140, height: 60, }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export const FooterInnerRoom = () => {
    return (
        <>
            <footer style={{ backgroundColor: "#714B1C", borderTopLeftRadius: 20, borderTopRightRadius: 20, display: "flex", flexDirection: "row", justifyContent: "space-around", padding: "40px 20px", position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF" }}>
                        ที่อยู่ :
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        33/102 ซอยบุญคุ้ม 3
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        อำเภอลำลูกกา
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        ปทุมธานี
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        12130
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF" }}>
                        เวลาทำการ :
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันจันทร์ 8:00-20:00
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF", marginLeft: 20 }}>
                            วันศุกร์ 8:00-20:00
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันอังคาร 8:00-20:00
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF", marginLeft: 20 }}>
                            วันเสาร์ 8:00-20:00
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                            วันพุธ 8:00-20:00
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF", marginLeft: 20 }}>
                            วันอาทิตย์ 8:00-20:00
                        </div>
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", marginTop: 15, color: "#FFF" }}>
                        วันพฤหัสบดี 8:00-20:00
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF" }}>
                        ติดต่อ
                    </div>
                    <div style={{ fontSize: 20, fontFamily: "Itim-Regular", color: "#FFF", marginTop: 20 }}>
                        โทรศัพท์: 098 444 6388
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <img
                            src={contract} alt="Brief Screen" className="brief-image" style={{ width: 140, height: 60, }}
                        />
                    </div>
                </div>
            </footer>
        </>
    )
}