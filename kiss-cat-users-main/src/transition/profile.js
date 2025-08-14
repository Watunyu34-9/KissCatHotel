import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';


export default function Profile({ navigation }) {
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const [isUsersData, setUsersData] = useState({})
    const [isNameEdit, setNameEdit] = useState("")
    const [isLastNameEdit, setLastNameEdit] = useState("")
    const [isAddressEdit, setAddressEdit] = useState("")
    const [isPhoneEdit, setPhoneEdit] = useState("")
    const [isPicProfile, setPicProfile] = useState("")
    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log("Profile..");
        getUsersData();
    }, []);

    const goBack = () => {
        navigate("/")
    }

    const Logout = () => {
        localStorage.setItem('login_status', "N")
        firebase.auth().signOut()
        navigate("/")
        // ทำการ refresh หน้าเพจหลังจากเข้าสู่ระบบสำเร็จ
        window.location.reload();
    }

    const getUsersData = async () => {
        const isUser = firebase.auth().currentUser.uid;
        const docRef = firebase.firestore().collection('users').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                setUsersData(data)
            }
        });
    }

    const handleFileChangeProfileEdit = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicProfile(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicProfile(null);
        }
    };

    const goEditData = async () => {
        const isUser = firebase.auth().currentUser.uid;
        try {
            const firestore = firebase.firestore();
            const userRef = firestore.collection('users').doc(isUser);
            const adminRef = firestore.collection('admin').doc(AdminDatabse);

            // อ่านข้อมูลปัจจุบันจากฐานข้อมูล
            const doc = await userRef.get();
            const userData = doc.data();

            // เตรียมข้อมูลที่จะอัปเดตใน admin collection
            let updateFields = {};

            // ตรวจสอบว่ามีการเปลี่ยนแปลงชื่อหรือไม่ และค่าใหม่ไม่เท่ากับค่าปัจจุบัน
            if (isNameEdit && isNameEdit !== userData.name) {
                await userRef.update({ name: isNameEdit });
                updateFields['name'] = isNameEdit;
            }

            if (isLastNameEdit && isLastNameEdit !== userData.lastname) {
                await userRef.update({ lastname: isLastNameEdit });
                updateFields['lastname'] = isLastNameEdit;
            }

            if (isAddressEdit && isAddressEdit !== userData.address) {
                await userRef.update({ address: isAddressEdit });
                updateFields['address'] = isAddressEdit;
            }

            // ตรวจสอบว่ามีการเปลี่ยนแปลงเบอร์โทรศัพท์หรือไม่ และค่าใหม่ไม่เท่ากับค่าปัจจุบัน
            if (isPhoneEdit && isPhoneEdit !== userData.phone) {
                // ตรวจสอบความยาวของหมายเลขโทรศัพท์
                if (isPhoneEdit.length !== 10) {
                    alert('กรุณาใส่เบอร์โทรศัพท์ 10 หลัก');
                    return;
                }
                await userRef.update({ phone: isPhoneEdit });
                updateFields['phone'] = isPhoneEdit;
            }

            // ตรวจสอบว่ามีการเปลี่ยนแปลงรูปภาพหรือไม่ และค่าใหม่ไม่เท่ากับค่าปัจจุบัน
            if (isPicProfile && isPicProfile !== userData.pic_profile) {
                const storageRef = firebase.storage().ref();
                const newImageRef = storageRef.child(`${isUser}/pic`);

                // อัปโหลดรูปภาพใหม่
                await newImageRef.putString(isPicProfile, 'data_url');

                // ดึง URL ของรูปภาพใหม่
                const imageUrl = await newImageRef.getDownloadURL();

                // อัปเดต URL ของรูปภาพใน Firestore
                await userRef.update({ pic_profile: imageUrl });
                updateFields['pic_profile'] = imageUrl;
            }

            // อัปเดตข้อมูลใน admin collection
            if (Object.keys(updateFields).length > 0) {
                const adminDoc = await adminRef.get();
                if (adminDoc.exists) {
                    const adminData = adminDoc.data();
                    const myManageUsers = adminData.my_manageusers || [];

                    const updatedManageUsers = myManageUsers.map(user => {
                        if (user.users_uid === isUser) {
                            return { ...user, ...updateFields };
                        }
                        return user;
                    });

                    await adminRef.update({ my_manageusers: updatedManageUsers });
                }
            }

            setNameEdit("");
            setLastNameEdit("");
            setAddressEdit("");
            setPhoneEdit("");
            setPicProfile("");
            window.location.reload();
            alert('การเปลี่ยนแปลงข้อมูลเสร็จสมบูรณ์');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        }
    };


    return (
        <>
            <div style={{ marginLeft: 20, marginRight: 20 }}>
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex", justifyContent: "space-between" }}>
                    <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", fontSize: 24 }}>
                        {"<-"} ย้อนกลับ
                    </div>
                    <div style={{ fontFamily: "Itim-Regular", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 32 }}>
                        โปรไฟล์
                    </div>
                    <div onClick={() => Logout()} style={{ backgroundColor: "#FF5580", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", color: "#FFF", fontSize: 24 }}>
                        ล็อกเอาท์
                    </div>
                </div>
                <div style={{ marginTop: 40, flexDirection: "column", display: "flex", backgroundColor: "#FFF", width: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: 10 }}>
                    <div style={{ fontFamily: "Itim-Regular", fontSize: 32, marginTop: 20, marginLeft: 100, marginRight: 100, marginBottom: 30, paddingBottom: 30, borderBottomWidth: 1, borderBottomStyle: "solid", paddingLeft: 30 }}>
                        รายละเอียด
                    </div>
                    <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-around", marginTop: 20, marginBottom: 50 }}>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChangeProfileEdit}
                                accept="image/*"
                            />
                            {(isPicProfile === "")
                                ? (isUsersData.pic_profile === "")
                                    ? <div
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            width: 366, height: 385, fontFamily: "Itim-Regular", fontSize: 32, display: "flex",
                                            alignItems: "center", justifyContent: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            flex: 1, marginLeft: 50, marginRight: 50, cursor: "pointer"
                                        }}>
                                        + รูป
                                    </div >
                                    : <div style={{ flex: 1, marginLeft: 50, marginRight: 50, }}>
                                        <img
                                            onClick={() => fileInputRef.current.click()}
                                            src={isUsersData.pic_profile} alt="Brief Screen" className="brief-image"
                                            style={{
                                                width: 366, height: 385, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </div>
                                : <div style={{ flex: 1, marginLeft: 50, marginRight: 50, }}>
                                    <img
                                        onClick={() => fileInputRef.current.click()}
                                        src={isPicProfile} alt="Brief Screen" className="brief-image"
                                        style={{
                                            width: 366, height: 385, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            cursor: "pointer"
                                        }}
                                    />
                                </div>
                            }
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 50, marginRight: 50, justifyContent: "space-between", }}>
                            <div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                    ชื่อ :
                                </div>
                                <input
                                    type="text"
                                    value={isNameEdit}
                                    onChange={(e) => setNameEdit(e.target.value)}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                    placeholder={`${isUsersData.name}`}
                                />
                            </div>
                            <div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                    อีเมล :
                                </div>
                                <div
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", alignItems: "center", display: "flex" }}
                                >
                                    {isUsersData.email}
                                </div>
                            </div>
                            <div >
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                    เบอร์โทร :
                                </div>
                                <input
                                    type="text"
                                    value={isPhoneEdit}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // กรองเฉพาะตัวเลข
                                        const numericValue = value.replace(/\D/g, '');
                                        setPhoneEdit(numericValue);
                                    }}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                    placeholder={`${isUsersData.phone}`}
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 50, marginRight: 50, justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                    นามสกุล :
                                </div>
                                <input
                                    type="text"
                                    value={isLastNameEdit}
                                    onChange={(e) => setLastNameEdit(e.target.value)}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                    placeholder={`${isUsersData.lastname}`}
                                />
                            </div>
                            <div style={{ marginBottom: 38 }}>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                    ที่อยู่ :
                                </div>
                                <input
                                    type="text"
                                    value={isAddressEdit}
                                    onChange={(e) => setAddressEdit(e.target.value)}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                    placeholder={`${isUsersData.address}`}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div
                                    onClick={() => goEditData()}
                                    style={{ fontFamily: "Itim-Regular", fontSize: 24, backgroundColor: "#40A578", borderRadius: 10, color: "#FFF", padding: "15px 65px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
                                    บันทึก
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>

    );
};