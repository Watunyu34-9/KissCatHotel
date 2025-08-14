import React, { useState } from 'react';
import Modal from 'react-modal';
import Kiss from '../asset/kisscathotel.png'
import Close from '../asset/close.png'
import Back from '../asset/back.png'
import { firebase } from "../backend/backend"
import { useNavigate } from 'react-router-dom'

export const ModalLogin = ({ isOpen, onRequestClose }) => {
    const navigate = useNavigate();
    const [isRegister, setRegister] = useState(false)
    const [isForgotPassword, setForgotPassword] = useState(false)
    //login
    const [isEmailLogin, setEmailLogin] = useState("")
    const [isPasswordLogin, setPasswordLogin] = useState("")
    //register
    const [isNameRegister, setNameRegister] = useState("")
    const [isLastNameRegister, setLastNameRegister] = useState("")
    const [isEmailRegister, setEmailRegister] = useState("")
    const [isPasswordRegister, setPasswordRegister] = useState("")
    const [isPasswordConRegister, setPasswordConRegister] = useState("")
    const [isPhoneNumberRegister, setPhoneNumberRegister] = useState("")
    //forgotpass
    const [isEmailForgot, setEmailForgot] = useState("")

    const goLogin = async () => {
        console.log("gologin....");
        console.log("นี่คืออีเมล", isEmailLogin);
        console.log("นี่คือพสเวิด", isPasswordLogin);
        try {
            await firebase.auth().signInWithEmailAndPassword(isEmailLogin, isPasswordLogin)
            navigate("/Check-Role")
            onCloseModal()
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

    const goRegister = async () => {
        if (isNameRegister == '') {
            window.alert('แจ้งเตือน กรุณากรอกชื่อ')
            return
        } else if (isLastNameRegister == '') {
            window.alert('แจ้งเตือน กรุณากรอกนามสกุล')
            return
        } else if (isEmailRegister == '') {
            window.alert('แจ้งเตือน กรุณากรอกอีเมล')
            return
        } else if (isPasswordRegister == '') {
            window.alert('แจ้งเตือน กรุณากรอกรหัสผ่าน')
            return
        } else if (isPasswordRegister.length < 6) {
            window.alert('แจ้งเตือน กรุณากรอกรหัสผ่านตั้งแต่6ตัวขึ้นไป')
            return
        } else if (isPasswordConRegister !== isPasswordRegister) {
            window.alert('แจ้งเตือน กรุณายืนยันพาสเวิร์ดให้ถูกต้อง')
            return
        } else if (isPhoneNumberRegister == '') {
            window.alert('แจ้งเตือน กรุณากรอกเบอร์โทร')
        } else if (isPhoneNumberRegister.length <= 9 || isPhoneNumberRegister.length >= 11) {
            window.alert('แจ้งเตือน กรุณากรอกเบอร์โทรให้ถูกต้อง')
            return
        } else {
            console.log('ผ่านแล้วจ้า');
            var config = {
                apiKey: "AIzaSyCOA_ImU_3XQSVLx_UdJmg6qwAfD_NuyQ0",
                authDomain: "kiss-cat-hotel.firebaseapp.com",
                databaseURL: "https://kiss-cat-hotel.firebaseapp.com"
            };
            var secondaryApp = firebase.initializeApp(config, "Secondary"); //ทำให้สมัครเสร็จแล้วไม่ให้เข้าสู่ระบบเอง
            secondaryApp.auth().createUserWithEmailAndPassword(isEmailRegister, isPasswordRegister)
                .then(async userCredential => {
                    const newUser = userCredential.user;
                    console.log("newUser uid: ", newUser.uid);

                    firebase.firestore().collection('users').doc(newUser.uid).set({
                        name: isNameRegister, //ซ้ายคอลัม ขวาข้อมูลfirebaseที่คนป้อนเข้ามา
                        lastname: isLastNameRegister, //ซ้ายคอลัม ขวาข้อมูลfirebaseที่คนป้อนเข้ามา
                        email: isEmailRegister,
                        // password: isPasswordRegister,
                        phone: isPhoneNumberRegister,
                        role: "users",
                        pic_profile:"",
                        address:"",
                    });

                    await firebase.firestore().collection('users').doc(newUser.uid)
                        .update({
                            "my_cat": firebase.firestore.FieldValue.arrayUnion()//สร้าง array เปล่าที่ชื่อ my_cat
                        })

                    await firebase.firestore().collection('users').doc(newUser.uid)
                        .update({
                            "my_reservation": firebase.firestore.FieldValue.arrayUnion()
                        })

                    //อัพเดทเว็ป admin หน้า dashboard ในส่วนของจำนวนผู้ใช้

                    const adminDocRef = firebase.firestore().collection('admin').doc("QvmmP2ELa7cgkgC9MCGzy5xjTy73");

                    firebase.firestore().runTransaction(async (transaction) => {
                        const doc = await transaction.get(adminDocRef);
                        if (!doc.exists) {
                            throw "Document does not exist!";
                        }

                        let my_dashboard = doc.data().my_dashboard || [];
                        let users_number_found = false;

                        my_dashboard = my_dashboard.map(item => {
                            if (item.hasOwnProperty('users_number')) {
                                item.users_number += 1;
                                users_number_found = true;
                            }
                            return item;
                        });

                        if (!users_number_found) {
                            my_dashboard.push({ users_number: 1 });
                        }

                        transaction.update(adminDocRef, { my_dashboard: my_dashboard });
                    });

                    //อัพเดทเว็ป admin หน้า จัดการผู้ใช้ ในส่วนของจำนวนผู้ใช้

                    await adminDocRef.update({
                        my_manageusers: firebase.firestore.FieldValue.arrayUnion({
                            name: isNameRegister,
                            lastname: isLastNameRegister,
                            email: isEmailRegister,
                            // password: isPasswordRegister,
                            phone: isPhoneNumberRegister,
                            users_uid: newUser.uid,
                            catdata: [],
                            pic_profile:""
                        }),
                    });

                    onFinishRegis();
                }).catch(error => {
                    console.log("error นะ: ", error);
                    // MessageBox.Alert("","",error)
                    if (error.code === 'auth/missing-email') {
                        window.alert("แจ้งเตือน ไม่พบ Email");
                    }
                    if (error.code === 'auth/email-already-in-use') {
                        window.alert("แจ้งเตือน Email นี้ถูกใช้งานไปแล้ว");
                    }
                    if (error.code === 'auth/invalid-email') {
                        window.alert("แจ้งเตือน รูปแบบ Email นี้ไม่ถูกต้อง");
                    }
                    if (error.code === 'auth/weak-password') {
                        window.alert("แจ้งเตือน โปรดตั้ง Password 6 ตัวขึ้นไป");
                    }
                })
        }
    }

    const onCloseModal = () => {
        setEmailLogin("")
        setPasswordLogin("")
        setNameRegister("")
        setLastNameRegister("")
        setEmailRegister("")
        setPasswordRegister("")
        setPasswordConRegister("")
        setPhoneNumberRegister("")
        onRequestClose();
    }

    const onFinishRegis = () => {
        setEmailLogin("")
        setPasswordLogin("")
        setNameRegister("")
        setLastNameRegister("")
        setEmailRegister("")
        setPasswordRegister("")
        setPasswordConRegister("")
        setPhoneNumberRegister("")
        setRegister(false)
        setForgotPassword(false)
    }

    const goForgotPassword = () => {
        firebase.auth().sendPasswordResetEmail(isEmailForgot)
            .then(() => {
                alert("ยินดีด้วย ส่งรีเซ็ต Password ไปที่ email เรียบร้อย โปรดเช็คที่ กล่องจดหมาย หรือจดหมายขยะ")
            }).catch((error) => {
                console.log("error: ", error);
                if (error.code === 'auth/user-not-found') {
                    alert("แจ้งเตือน", "ไม่พบบัญชีผู้ใช้นี้");
                }
            })
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => onCloseModal()}
                contentLabel="Example Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        width: '60%',
                        height: (isForgotPassword) ? '30%' : '60%',
                        margin: 'auto',
                        zIndex: 999999,
                        borderRadius: 10,
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "#FFF"
                    },
                }}
            >
                {(isRegister === false && isForgotPassword === false)
                    ? <div>
                        <div onClick={() => onCloseModal()} style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}>
                            <img
                                src={Close} alt="Brief Screen" className="brief-image" style={{ width: 35, height: 35 }}
                            />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "row", width: '100%', height: '100%', justifyContent: 'space-between' }}>
                            <div style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <img
                                    src={Kiss} alt="Brief Screen" className="brief-image" style={{ width: 400, height: 400 }}
                                />
                            </div>
                            <div style={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                marginLeft: 60,
                                marginRight: 60,
                            }}>
                                <div style={{
                                    fontFamily: "Itim-Regular",
                                    color: "#714B1C",
                                    fontSize: 40,
                                    alignSelf: "center"
                                }}>
                                    เข้าสู่ระบบ
                                </div>
                                <div style={{
                                    fontFamily: "Itim-Regular",
                                    color: "#714B1C",
                                    fontSize: 20,
                                    marginTop: 40,
                                }}>
                                    อีเมล
                                </div>
                                <input
                                    type="text"
                                    value={isEmailLogin}
                                    onChange={(e) => setEmailLogin(e.target.value)}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                />
                                <div style={{
                                    fontFamily: "Itim-Regular",
                                    color: "#714B1C",
                                    fontSize: 20,
                                    marginTop: 10,
                                }}>
                                    รหัสผ่าน
                                </div>
                                <input
                                    type="password"
                                    value={isPasswordLogin}
                                    onChange={(e) => setPasswordLogin(e.target.value)}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                />
                                <div
                                    onClick={() => goLogin()}
                                    style={{
                                        fontFamily: "Itim-Regular",
                                        color: "#FFF",
                                        fontSize: 24,
                                        marginTop: 50,
                                        backgroundColor: "#714B1C",
                                        borderRadius: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingTop: 20,
                                        paddingBottom: 20,
                                        cursor: "pointer"
                                    }}>
                                    ล็อกอิน
                                </div>
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        fontSize: 18,
                                    }}>
                                        หากยังไม่มีบัญชีสามารถ
                                    </div>
                                    <div
                                        onClick={() => setRegister(true)}
                                        style={{
                                            fontFamily: "Itim-Regular",
                                            fontSize: 20,
                                            color: "#714B1C",
                                            marginLeft: 10,
                                            cursor: "pointer",
                                        }}>
                                        สมัครสมาชิก
                                    </div>
                                </div>
                                <div
                                    onClick={() => setForgotPassword(true)}
                                    style={{
                                        fontFamily: "Itim-Regular",
                                        fontSize: 20,
                                        color: "#714B1C",
                                        alignSelf: "center",
                                        marginTop: 30,
                                        opacity: "70%",
                                        cursor: "pointer",
                                    }}>
                                    ลืมรหัสผ่าน ?
                                </div>
                            </div>
                        </div>
                    </div>
                    : (isRegister)
                        ? <div>
                            <div onClick={() => setRegister(false)} style={{ position: "absolute", left: 20, top: 20, cursor: "pointer", padding: 10, borderRadius: 10, borderWidth: 1, borderStyle: "solid" }}>
                                <img
                                    src={Back} alt="Brief Screen" className="brief-image" style={{}}
                                />
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", width: '100%', height: '100%' }}>
                                <div style={{ flexDirection: "row", display: "flex", alignSelf: "center" }}>
                                    <img
                                        src={Kiss} alt="Brief Screen" className="brief-image" style={{ width: 60, height: 60 }}
                                    />
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        color: "#714B1C",
                                        fontSize: 40,
                                        marginLeft: 20
                                    }}>
                                        สมัครสมาชิก
                                    </div>
                                </div>
                                <div style={{ marginTop: 40, flexDirection: "row", justifyContent: "space-between", display: "flex" }}>
                                    <div>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            color: "#714B1C",
                                            fontSize: 24,
                                        }}>
                                            ชื่อ
                                        </div>
                                        <input
                                            type="text"
                                            value={isNameRegister}
                                            onChange={(e) => setNameRegister(e.target.value)}
                                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                        />
                                    </div>
                                    <div style={{ marginLeft: 20 }}>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            color: "#714B1C",
                                            fontSize: 24,
                                        }}>
                                            นามสกุล
                                        </div>
                                        <input
                                            type="text"
                                            value={isLastNameRegister}
                                            onChange={(e) => setLastNameRegister(e.target.value)}
                                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        color: "#714B1C",
                                        fontSize: 24,
                                    }}>
                                        อีเมล
                                    </div>
                                    <input
                                        type="text"
                                        value={isEmailRegister}
                                        onChange={(e) => setEmailRegister(e.target.value)}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                    />
                                </div>
                                <div style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between", display: "flex" }}>
                                    <div>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            color: "#714B1C",
                                            fontSize: 24,
                                        }}>
                                            รหัสผ่าน
                                        </div>
                                        <input
                                            type="password"
                                            value={isPasswordRegister}
                                            onChange={(e) => setPasswordRegister(e.target.value)}
                                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                        />
                                    </div>
                                    <div>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            color: "#714B1C",
                                            fontSize: 24,
                                        }}>
                                            รหัสผ่านอีกครั้ง
                                        </div>
                                        <input
                                            type="password"
                                            value={isPasswordConRegister}
                                            onChange={(e) => setPasswordConRegister(e.target.value)}
                                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        color: "#714B1C",
                                        fontSize: 24,
                                    }}>
                                        เบอร์โทร
                                    </div>
                                    <input
                                        type="text"
                                        value={isPhoneNumberRegister}
                                        onChange={(e) => setPhoneNumberRegister(e.target.value)}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                        maxLength={10}
                                    />
                                </div>
                                <div style={{
                                    marginTop: 20,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end"
                                }}
                                    onClick={() => goRegister()}
                                >
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        backgroundColor: "#714B1C",
                                        fontSize: 22,
                                        color: "#FFF",
                                        borderRadius: 10,
                                        padding: "10px 50px",
                                        cursor: "pointer"
                                    }}>
                                        สมัคร
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div style={{ width: "70%", height: "100%", }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", width: '100%', height: '100%' }}>
                                <div style={{ flexDirection: "row", display: "flex", alignSelf: "center", justifyContent: "space-around" }}>
                                    <div onClick={() => setForgotPassword(false)}
                                        style={{ cursor: "pointer", padding: 10, borderRadius: 10, borderWidth: 1, borderStyle: "solid", position: "absolute", top: 20, left: 20 }}>
                                        <img
                                            src={Back} alt="Brief Screen" className="brief-image" style={{}}
                                        />
                                    </div>
                                    <img
                                        src={Kiss} alt="Brief Screen" className="brief-image" style={{ width: 60, height: 60 }}
                                    />
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        color: "#714B1C",
                                        fontSize: 40,
                                        marginLeft: 20
                                    }}>
                                        ลืมรหัสผ่าน
                                    </div>
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        color: "#714B1C",
                                        fontSize: 24,
                                    }}>
                                        อีเมล
                                    </div>
                                    <input
                                        type="text"
                                        value={isEmailForgot}
                                        onChange={(e) => setEmailForgot(e.target.value)}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                                    />
                                </div>
                                <div style={{
                                    marginTop: 30,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignSelf: "center"
                                }}>
                                    <div 
                                    onClick={() => goForgotPassword()}
                                    style={{
                                        fontFamily: "Itim-Regular",
                                        backgroundColor: "#714B1C",
                                        fontSize: 22,
                                        color: "#FFF",
                                        borderRadius: 10,
                                        padding: "10px 50px",
                                        cursor: "pointer"
                                    }}>
                                        รีเซ็ตรหัสผ่าน
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </Modal>
        </>
    );
};
