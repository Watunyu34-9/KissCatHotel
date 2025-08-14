import React, { useState, useEffect } from "react";
import { firebase } from "../backend/backend"
import { useNavigate } from "react-router-dom";
export default function CheckRole({ route, navigation }) {
    const isUser = firebase.auth().currentUser.uid;
    const [user, setUser] = useState("")
    const [CheckRole, setCheckRole] = useState("")
    const [loading, setLoading] = useState(false);
    const db = firebase.firestore()
    const navigate = useNavigate();

    useEffect(() => {
        console.log("checkrole..");
        db.collection('users')
            .doc(isUser) // change to the current user id 
            .get().then((user) => {
                console.log("user.exists", user.exists);
                if (user.exists) {
                    console.log("userdatarole ", user.data().role)
                    let u = user.data().role;
                    if (u == "users") {
                        console.log("if...");
                        localStorage.setItem('login_status', "Y");
                        // ทำการ refresh หน้าเพจหลังจากเข้าสู่ระบบสำเร็จ
                        navigate('/');
                        window.location.reload();
                    }
                } else {
                    console.log("else...");
                    firebase.auth().signOut()
                    navigate('/');
                    localStorage.setItem('login_status', "N");
                    alert("บัญชีผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบอีเมลและพาสเวิร์ด...")
                }
            })
    }, []);


    return (
        <>
            <div style={{ alignItems: "center", flexDirection: "column" }}>
                <div >
                    <div style={{ alignItems: "center", flexDirection: "column" }}>
                        <div>
                            <h1 style={{ fontSize: 80, marginBottom: 50 }}>กำลังตรวจสอบบัญชี...</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}