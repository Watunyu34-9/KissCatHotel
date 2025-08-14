import React, { useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { ModalLogin } from '../component/modal';
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';


export default function InnerRoom({ navigation }) {
    // const isUser = firebase.auth().currentUser.uid;
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const location = useLocation();
    const { docList } = location.state || {};
    const { index } = location.state || {};
    const { promotion_camera } = location.state || {};
    console.log("รัับค่า: ", docList);
    const [isModalLogin, setModalLogin] = useState(false);

    useEffect(() => {
        console.log("InnerRoom..");

    }, [index]);

    const goBack = () => {
        navigate("/")
    }

    const MakeReservation = (item, innerindex) => {
        const login = localStorage.getItem('login_status');
        console.log("login หรือยัง : ", login);
        if (login === "N") {
            setModalLogin(true)
            return;
        } else {
            navigate("/Make-A-Reservation", { state: { docList: docList, index: index, promotion_camera: promotion_camera, docListInner: item, docListInnerIndex: innerindex } })
        }
    }

    const modalLogin = () => {
        return (
            <>
                <ModalLogin
                    isOpen={isModalLogin}
                    onRequestClose={() => setModalLogin(false)}
                // onConfirm={() => goLogin()}
                />
            </>
        )
    }


    return (
        <>
            <div style={{ marginLeft: 20, marginRight: 20, height: (docList.inner_room.length === 0) ? "100vh" : null }}>
                {modalLogin()}
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex" }}>
                    <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", fontSize: 24 }}>
                        {"<-"} ย้อนกลับ
                    </div>
                </div>
                {(docList.inner_room.length === 0)
                    ? <div style={{ marginTop: 40, flexDirection: "row", display: "flex", fontFamily: "Itim-Regular", fontSize: 32, paddingLeft: 40, justifyContent: "center" }}>
                        ห้องพัก {docList.name_room} ยังไม่มีห้องที่พร้อมใช้งานในขณะนี้
                        < FooterInnerRoom />
                    </div>
                    : <div style={{ backgroundColor: "#FFF", marginTop: 40, flexDirection: "column", display: "flex", overflowY: "auto", paddingTop: 30, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 30, wordWrap: "break-word", whiteSpace: "normal" }}>
                                {docList.name_room}
                            </div>
                            <div style={{ fontFamily: "Itim-Regular", fontSize: 30, wordWrap: "break-word", whiteSpace: "normal", marginLeft: 10 }}>
                                {`(X${docList.inner_room.length})`}
                            </div>
                        </div>
                        <div style={{
                            marginTop: 20,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(317px, 1fr))",
                            gap: "30px",
                            paddingBottom: 50,
                            paddingLeft: 50,
                            paddingRight: 40,
                        }}>
                            {docList.inner_room.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => MakeReservation(item, index)}
                                    style={{
                                        backgroundColor: "#FFF",
                                        padding: 20,
                                        borderRadius: 10,
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        maxWidth: 317
                                    }}>
                                    <img
                                        src={item.pic} alt="Brief Screen" className="brief-image" style={{ width: 257, height: 174, borderRadius: 5 }}
                                    />
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        fontSize: 20,
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        textAlign: "center",
                                        marginTop: 10
                                    }}>
                                        {item.name_room}
                                    </div>
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        fontSize: 20,
                                        marginTop: 10,
                                        backgroundColor: "#714B1C",
                                        borderRadius: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#FFF",
                                        padding: "10px 0",
                                        width: "257px",
                                        boxSizing: "border-box",
                                        textAlign: "center"
                                    }}>
                                        เลือก
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                }
            </div>
            {docList.inner_room.length !== 0 ? < Footer /> : null}
        </>

    );
};