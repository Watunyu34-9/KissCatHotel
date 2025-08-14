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
        const checkUserRole = async () => {
            try {
                console.log("checkrole..");
                const userDoc = await db.collection('admin').doc(isUser).get();

                console.log("user.exists", userDoc.exists);
                if (userDoc.exists) {
                    const userRole = userDoc.data().role;
                    console.log("userdatarole ", userRole);
                    if (userRole === "admin") {
                        console.log("if...");
                        navigate('/');
                    }
                } else {
                    console.log("else...");
                    await firebase.auth().signOut();
                    alert("บัญชีผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบอีเมลและพาสเวิร์ด...");
                    window.location.reload();
                    navigate('/');
                }
            } catch (error) {
                console.error("Error checking user role: ", error);
            }
        };

        checkUserRole();
    }, [isUser, navigate]);

    return null;
};



