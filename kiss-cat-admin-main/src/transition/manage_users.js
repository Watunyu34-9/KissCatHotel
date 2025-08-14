import React, { useEffect, useState } from 'react';
import '../App.css'
import { firebase } from "../backend/backend"
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import manageuserIcon from '../asset/manageuserIcon.png'
import search from '../asset/search.png'
import Modal from 'react-modal';
import defaultprofile from '../asset/defaultprofile.png'


export default function ManageUsers({ navigation }) {
    const isUser = firebase.auth().currentUser.uid;
    const [tableData, setTableData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsEditOpen, setModalIsEditOpen] = useState(false);
    const [editItem, setEditItem] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [isName, setName] = useState("")
    const [isLastName, setLastName] = useState("")
    const [isEmail, setEmail] = useState("")
    const [isPassword, setPassword] = useState("")
    const [isPhoneNumber, setPhoneNumber] = useState("")
    const [isEditNameUsers, setEditNameUsers] = useState("")
    const [isEditLastNameUsers, setEditLastNameUsers] = useState("")
    const [isEditPhoneNumberUsers, setEditPhoneNumberUsers] = useState("")
    const [isUserData, setUserData] = useState([]);

    useEffect(() => {
        console.log("ManageUsers..");
        getUsersData();
    }, []);

    const getUsersData = async () => {
        const docRef = firebase.firestore().collection('admin').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);

                if (data.my_manageusers && data.my_manageusers.length > 0) {
                    const mergedData = [
                        {
                            id: "รหัสลูกค้า",
                            name: "ชื่อ",
                            lastname: "นามสกุล",
                            email: "อีเมล",
                            pic_profile: "รูปโปรไฟล์",
                            phone: "เบอร์โทร",
                            catdata: "ข้อมูลแมว"
                        },
                        ...data.my_manageusers.map((item, index) => ({
                            id: (index + 1).toString().padStart(2, '0'), //ปรับรหัสลูกค้า เลขที่เป็นหลักหน่วยให้มี 0 นำข้างหน้า
                            name: item.name,
                            lastname: item.lastname,
                            email: item.email,
                            pic_profile: item.pic_profile,
                            phone: item.phone,
                            catdata: item.catdata,
                            users_uid: item.users_uid
                        }))
                    ];
                    setTableData(mergedData);
                    setUserData(data.my_manageusers);
                } else {
                    setUserData([]);
                }
            }
        });
    }

    //แสดงค่าที่คนใช้ป้อนเข้ามา
    const handleNameChange = (event) => {
        console.log("name: ", event.target.value);
        setName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        console.log("name: ", event.target.value);
        setLastName(event.target.value);
    };

    const handleEmailChange = (event) => {
        console.log("name: ", event.target.value);
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        console.log("name: ", event.target.value);
        setPassword(event.target.value);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // กรองเฉพาะตัวเลข
        const numericValue = value.replace(/\D/g, '');
        setPhoneNumber(numericValue);
    };

    const handleEditNameUsers = (event) => {
        setEditNameUsers(event.target.value);
    };

    const handleEditLastNameUsers = (event) => {
        setEditLastNameUsers(event.target.value);
    };

    const handleEditPhoneUsers = (event) => {
        const value = event.target.value;
        // กรองเฉพาะตัวเลข
        const numericValue = value.replace(/\D/g, '');
        setEditPhoneNumberUsers(numericValue);
    };

    const registerUsers = async () => {
        console.log("isName=> ", isName);
        console.log("isLastName=> ", isLastName);
        console.log("isEmail=> ", isEmail);
        console.log("password=> ", isPassword);
        console.log("isPhoneNumber=> ", isPhoneNumber.length);
        if (isName == '') {
            window.alert('แจ้งเตือน กรุณากรอกชื่อ')
            return
        } else if (isLastName == '') {
            window.alert('แจ้งเตือน กรุณากรอกนามสกุล')
            return
        } else if (isEmail == '') {
            window.alert('แจ้งเตือน กรุณากรอกอีเมล')
            return
        } else if (isPassword == '') {
            window.alert('แจ้งเตือน กรุณากรอกรหัสผ่าน')
            return
        } else if (isPassword.length < 5) {
            window.alert('แจ้งเตือน กรุณากรอกรหัสผ่านตั้งแต่6ตัวขึ้นไป')
            return
        } else if (isPhoneNumber == '') {
            window.alert('แจ้งเตือน กรุณากรอกเบอร์โทร')
        } else if (isPhoneNumber.length <= 9 || isPhoneNumber.length >= 11) {
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
            secondaryApp.auth().createUserWithEmailAndPassword(isEmail, isPassword)
                .then(async userCredential => {
                    const newUser = userCredential.user;
                    console.log("newUser uid: ", newUser.uid);

                    firebase.firestore().collection('users').doc(newUser.uid).set({
                        name: isName, //ซ้ายคอลัม ขวาข้อมูลfirebaseที่คนป้อนเข้ามา
                        lastname: isLastName, //ซ้ายคอลัม ขวาข้อมูลfirebaseที่คนป้อนเข้ามา
                        email: isEmail,
                        // password: isPassword,
                        phone: isPhoneNumber,
                        role: "users",
                        pic_profile: "",
                        address: "",
                    });

                    await firebase.firestore().collection('users').doc(newUser.uid)
                        .update({
                            "my_cat": firebase.firestore.FieldValue.arrayUnion()//สร้าง array เปล่าที่ชื่อมายเมนู
                        })

                    await firebase.firestore().collection('users').doc(newUser.uid)
                        .update({
                            "my_reservation": firebase.firestore.FieldValue.arrayUnion()
                        })

                    //อัพเดทเว็ป admin หน้า dashboard ในส่วนของจำนวนผู้ใช้

                    const adminDocRef = firebase.firestore().collection('admin').doc(isUser);

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
                            name: isName,
                            lastname: isLastName,
                            email: isEmail,
                            // password: isPassword,
                            phone: isPhoneNumber,
                            users_uid: newUser.uid,
                            catdata: [],
                            pic_profile: ""
                        }),
                    });


                    // let msg = window.alert("ลงทะเบียนสำเร็จ คุณสามารถเข้าสู๋ระบบได้แล้ว");
                    // if (msg) {
                    //     navigate('/');
                    // }
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

    const EditUsers = async (item, index) => {
        console.log("item EditUsers: ", item);
        console.log("index EditUsers: ", index);
        let i = index - 1
        if (i < 0) {
            console.error('ตรวจสอบว่าค่า i ไม่เป็นค่าลบก่อนใช้งาน (i < 0)');
            return;
        }
        try {

            const firestore = firebase.firestore();
            const AdminRef = firestore.collection('admin').doc(isUser);
            const userRef = firestore.collection('users').doc(item.users_uid);

            // ค้นหาเมนูที่ต้องการแก้ไข
            const snapshot = await AdminRef.get();
            if (snapshot.exists) {
                const userData = snapshot.data();
                const manageusers = userData.my_manageusers;

                if (i >= manageusers.length) {
                    console.error('ตรวจสอบว่าค่า i ไม่เกินขอบเขตของ array manageusers (i >= manageusers.length)');
                    return;
                }

                let phone;
                if (isEditPhoneNumberUsers !== "") {
                    if (isEditPhoneNumberUsers.length <= 9 || isEditPhoneNumberUsers.length >= 11) {
                        window.alert('แจ้งเตือน กรุณากรอกเบอร์โทรให้ถูกต้อง')
                        return;
                    } else {
                        phone = "edited"
                    }
                } else {
                    phone = "default"
                }


                const updatedMs = manageusers.map((manageusers, idx) => {
                    if (idx === i) {
                        return {
                            ...manageusers,
                            name: isEditNameUsers || manageusers.name,
                            lastname: isEditLastNameUsers || manageusers.lastname,
                            phone: (phone === "edited") ? isEditPhoneNumberUsers : manageusers.phone,
                        };
                    }
                    return manageusers;
                });

                // อัปเดตข้อมูลใน Firestore collection 'admin'
                await AdminRef.update({
                    my_manageusers: updatedMs,
                });

                // อัปเดตข้อมูลใน Firestore collection 'users'
                await userRef.update({
                    name: isEditNameUsers || item.name,
                    lastname: isEditLastNameUsers || item.lastname,
                    phone: (phone === "edited") ? isEditPhoneNumberUsers : item.phone,
                });


                closeEditModal();
            } else {
                console.log('ไม่พบข้อมูลผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
        }
    }

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const modal = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsOpen}//const [modalIsOpen, setModalIsOpen] = useState(false);ถ้า setตัวหลัง ทรู อันนี้จะขึ้นมา โดยการเชื่อมตัวหน้า Modal เพิ่มเมนู
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '60%',
                                height: '60%',
                                margin: 'auto',
                                zIndex: 999999,
                                borderRadius: 10,
                                padding: 20,

                            },

                        }}
                    >
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                            <button onClick={closeModal} style={{ position: "absolute", right: 10, }}>X</button>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                                เพิ่มผู้ใช้
                            </div>
                            <div style={{ flexDirection: "row", display: 'flex', marginTop: 20, justifyContent: "space-between" }}>
                                <div style={{ flexDirection: "column", display: 'flex', flex: 1 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                        ชื่อ
                                    </div>
                                    <input
                                        type="text"
                                        value={isName}
                                        onChange={handleNameChange}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    >
                                    </input>
                                </div>
                                <div style={{ flexDirection: "column", display: 'flex', flex: 1, marginLeft: 15 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                        นามสกุล
                                    </div>
                                    <input
                                        type="text"
                                        value={isLastName}
                                        onChange={handleLastNameChange}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    >
                                    </input>
                                </div>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    อีเมล
                                </div>
                                <input
                                    type="text"
                                    value={isEmail}
                                    onChange={handleEmailChange}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    รหัสผ่าน
                                </div>
                                <input
                                    type="password"
                                    value={isPassword}
                                    onChange={handlePasswordChange}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    เบอร์โทร
                                </div>
                                <input
                                    type="text"
                                    value={isPhoneNumber}
                                    onChange={handlePhoneChange}
                                    maxLength={10}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 30 }}>
                                <div onClick={() => registerUsers()} style={{ width: 60, height: 40, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", fontFamily: "Prompt-Medium", fontSize: 20, width: 156, height: 46, cursor: "pointer" }}>
                                    เพิ่ม
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    const openEditModal = (item, index) => {
        setModalIsEditOpen(true);
        setEditItem(item); // เก็บข้อมูล item ที่ต้องการแก้ไข
        setEditIndex(index); // 
    }

    const closeEditModal = () => {
        setModalIsEditOpen(false);
        setEditNameUsers("")
        setEditLastNameUsers("")
        setEditPhoneNumberUsers("")
        setEditItem({});
        setEditIndex(null);
    }

    const modalEdit = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsEditOpen}//const [modalIsOpen, setModalIsOpen] = useState(false);ถ้า setตัวหลัง ทรู อันนี้จะขึ้นมา โดยการเชื่อมตัวหน้า Modal เพิ่มเมนู
                        onRequestClose={closeEditModal}
                        contentLabel="Example Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '60%',
                                height: '40%',
                                margin: 'auto',
                                zIndex: 999999,
                                borderRadius: 10,
                                padding: 20,

                            },

                        }}
                    >
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                            <button onClick={closeEditModal} style={{ position: "absolute", right: 10, }}>X</button>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                                แก้ไขผู้ใช้
                            </div>
                            <div style={{ flexDirection: "row", display: 'flex', marginTop: 20, justifyContent: "space-between" }}>
                                <div style={{ flexDirection: "column", display: 'flex', flex: 1 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                        ชื่อ
                                    </div>
                                    <input
                                        type="text"
                                        value={isEditNameUsers}
                                        onChange={handleEditNameUsers}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                        placeholder={`${editItem.name}`}
                                    >
                                    </input>
                                </div>
                                <div style={{ flexDirection: "column", display: 'flex', flex: 1, marginLeft: 15 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                        นามสกุล
                                    </div>
                                    <input
                                        type="text"
                                        value={isEditLastNameUsers}
                                        onChange={handleEditLastNameUsers}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                        placeholder={`${editItem.lastname}`}
                                    >
                                    </input>
                                </div>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 25 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    เบอร์โทร
                                </div>
                                <input
                                    type="text"
                                    value={isEditPhoneNumberUsers}
                                    onChange={handleEditPhoneUsers}
                                    maxLength={10}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                    placeholder={`${editItem.phone}`}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 30 }}>
                                <div onClick={() => EditUsers(editItem, editIndex)} style={{ width: 60, height: 40, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", fontFamily: "Prompt-Medium", fontSize: 20, width: 156, height: 46, cursor: "pointer" }}>
                                    แก้ไข
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    return (
        <>
            <div style={{ width: "100%" }}>
                {modal()}
                {modalEdit()}
                <div style={{ flexDirection: "row", display: "flex", paddingLeft: 20, paddingTop: 20, alignItems: "center" }}>
                    <img
                        src={manageuserIcon} alt="Brief Screen" className="brief-image" style={{ width: 46, height: 46, }}
                    />
                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}>
                        จัดการผู้ใช้
                    </div>
                </div >
                <div style={{ flexDirection: "row", display: "flex", paddingLeft: 20, paddingTop: 20, alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                        <div
                            onClick={openModal}
                            style={{
                                fontFamily: "Prompt-Medium", fontSize: 20, width: 120, height: 40, backgroundColor: "#63E834", color: "#FFF", alignItems: "center", justifyContent: "center", borderRadius: 10, display: "flex", cursor: "pointer"
                            }}>
                            เพิ่มผู้ใช้
                        </div>
                        {/* <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, width: 120, height: 40, backgroundColor: "#FF553E", color: "#FFF", alignItems: "center", justifyContent: "center", borderRadius: 10, display: "flex", marginLeft: 10, cursor: "pointer" }}>
                            เลือกลบ
                        </div> */}
                    </div>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                        <input
                            style={{
                                width: 337, height: 47, display: "flex", alignItems: "center", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingLeft: 30, fontFamily: "Prompt-Light", fontSize: 18, borderColor: "#808080", borderStyle: "solid", borderWidth: 1
                            }}
                            placeholder='ค้นหา'
                        />
                        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#714B1C", borderTopRightRadius: 10, borderBottomRightRadius: 10, width: 81, justifyContent: "center", cursor: "pointer" }}>
                            <img
                                src={search} alt="Brief Screen" className="brief-image" style={{ width: 19, height: 19, }}
                            />
                        </div>
                    </div>
                </div >
                {isUserData.length === 0
                    ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 30, marginTop: 40, marginLeft: 40 }}>
                        ยังไม่มีบัญชีผู้ใช้ในขณะนี้ ...
                    </div>
                    : <div style={{ backgroundColor: "#D5EEBB", marginLeft: 20, marginRight: 20, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>

                        <table style={{ marginTop: 30, width: "100%", marginRight: 20 }}>
                            {tableData.map((row, rowIdx) => (
                                [rowIdx == 0 ?
                                    <tr key={rowIdx} style={{}}>
                                        <td style={{ color: "#000", textAlign: "center" }}>
                                            <h3 style={{ fontFamily: "Prompt-Light" }}>
                                                {row.id}
                                            </h3>
                                        </td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.name}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.lastname}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.email}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.pic_profile}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.phone}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.catdata}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}></h3></td>
                                    </tr> :
                                    <tr key={rowIdx} style={{ borderBottomWidth: 1, backgroundColor: "#FFF" }} >
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.id}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.name}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.lastname}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.email}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}>
                                            {(row.pic_profile === "")
                                                ? <img
                                                    src={defaultprofile} alt="Brief Screen" className="brief-image" style={{ width: 50, height: 50, }}
                                                />
                                                : <img
                                                    src={row.pic_profile} alt="Brief Screen" className="brief-image" style={{ width: 50, height: 50, borderRadius: 25 }}
                                                />
                                            }
                                        </td>
                                        <td style={{ color: "#000", textAlign: "center" }}><h3 style={{ fontFamily: "Prompt-Light" }}>{row.phone}</h3></td>
                                        <td style={{ color: "#000", textAlign: "center" }}>
                                            <h3 style={{ fontFamily: "Prompt-Light" }}>
                                                {(row.catdata && row.catdata.length !== 0)
                                                    ? row.catdata.slice(0, 3).map((item, index) => (
                                                        <img
                                                            key={index}
                                                            src={item.pic_cat}
                                                            alt="Brief Screen"
                                                            className="brief-image"
                                                            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5 }}
                                                        />
                                                    ))
                                                    : "ยังไม่มีแมว"
                                                }
                                            </h3>
                                        </td>
                                        <td
                                            onClick={() => openEditModal(row, rowIdx)}
                                            style={{
                                                color: "#FFF", textAlign: "center", backgroundColor: "#FFF73A", alignItems: "center", cursor: "pointer"
                                            }}>
                                            <h3 style={{ fontFamily: "Prompt-Light" }}>แก้ไข
                                            </h3>
                                        </td>
                                        {/* <td style={{ color: "#FFF", textAlign: "center", backgroundColor: "#FF553E", alignItems: "center", cursor: "pointer" }}><h3 style={{ fontFamily: "Prompt-Light" }}>ลบ</h3></td> */}
                                    </tr>
                                ]
                            ))}
                        </table>
                    </div>
                }
            </div>
        </>
    )


}