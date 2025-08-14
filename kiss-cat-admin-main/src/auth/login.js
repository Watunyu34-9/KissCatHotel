import React, { useEffect, useState } from 'react';
import '../App.css'
import Kiss from '../asset/kisscathotel.png'
import { useNavigate } from "react-router-dom";
import { firebase } from "../backend/backend"


//isนำไปใช้ setนำค่าเข้ามา
export default function Login({ navigation }) {
    const navigate = useNavigate();
    const [isName, setName] = useState("")
    const [isPassword, setPassword] = useState("")

    useEffect(() => {
        console.log("login..");
        // onLogin();
    }, []);


    const gologin = async () => {
        console.log("gologin....");
        console.log("นี่คืออีเมล", isName);
        console.log("นี่คือพสเวิด", isPassword);
        try {
            await firebase.auth().signInWithEmailAndPassword(isName, isPassword)
            navigate('/CheckRole')
        } catch (error) {
            console.log("error: ", error);
            if (error.code === 'auth/internal-error') {
                window.alert("Email หรือ รหัสผ่านของคุณไม่ถูกต้อง");
            }
            if (error.code === 'auth/user-not-found') {
                window.alert("ไม่พบบัญชีผู้ใช้นี้");
            }
            if (error.code === 'auth/wrong-password') {
                window.alert("กรุณากรอกรหัสผ่านของคุณให้ถูกต้อง");
            }
            if (error.code === 'auth/invalid-email') {
                window.alert("Email ของคุณไม่ถูกต้อง");
            } else {
                window.alert("เข้าสู่ระบบไม่ได้ โปรดตรวจสอบอีเมลและพาสเวิร์ด");
            }
        }
    }

    // const goregis = () => {
    //     navigate("/Register"); 
    // }

    const handleNameChange = (event) => {
        console.log("=new: ", event.target.value); //แสดงค่าที่คนใช้ป้อนเข้ามาให้อยู่ในsetName
        setName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        console.log("pass: ", event.target.value); //แสดงค่าที่คนใช้ป้อนเข้ามาให้อยู่ในsetPassword
        setPassword(event.target.value);
    };

    return (
        <>
            <div style={{ backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}>
                <div style={{ backgroundColor: "#ffffff", display: "flex", alignItems: "center", height: "65%", width: "70%", display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <img src={Kiss} alt="Brief Screen" className="brief-image" />
                    </div>
                    <div style={{ flex: 1, display: "flex", display: "flex", justifyContent: "center", flexDirection: 'column' }}>
                        <div style={{ color: "#714B1C", fontSize: 40, fontFamily: "Prompt-Medium", alignSelf: "center" }}>
                            เข้าสู่ระบบแอดมิน
                        </div>
                        <div style={{ marginTop: 30, paddingLeft: 90 }}>
                            <div>
                                <div style={{ color: "#714B1C", fontSize: 18, fontFamily: "Prompt-Medium", }}>
                                    อีเมล
                                </div>
                                <input //นี้คือช่องอีเมล
                                    type="text"
                                    value={isName} //ค่าที่ผู้ใช้กรอกจะอยู่ในนี้
                                    onChange={handleNameChange} //แสดงค่าที่คนใช้ป้อนเข้ามา
                                    style={{ borderRadius: 8, marginTop: 6, height: 30, width: 360, paddingLeft: 20, fontSize: 15, fontFamily: "Prompt-Medium", }}
                                />
                            </div>
                            <div>
                                <div style={{ color: "#714B1C", fontSize: 18, fontFamily: "Prompt-Medium", marginTop: 10 }}>
                                    รหัสผ่าน
                                </div>
                                <input //นี้คือช่อง password
                                    type="password"
                                    value={isPassword} //ค่าที่ผู้ใช้กรอกจะอยู่ในนี้
                                    onChange={handlePasswordChange} //แสดงค่าที่คนใช้ป้อนเข้า
                                    style={{ borderRadius: 8, marginTop: 15, height: 30, width: 360, paddingLeft: 20, fontSize: 16, fontFamily: "Prompt-Medium", }}
                                />
                            </div>
                            <div
                                style={{
                                    borderRadius: 10, marginTop: 40, height: 60, width: 380, backgroundColor: "#714B1C", alignItems: "center", justifyContent: "center", display: "flex", color: "#FFFFFF", fontSize: 24, fontFamily: "Prompt-Medium", cursor: "pointer"
                                }}
                                onClick={() => gologin()}
                            >
                                ล็อกอิน
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};