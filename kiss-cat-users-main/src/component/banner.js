import React, { useEffect, useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { firebase } from "../backend/backend"
import { useNavigate } from "react-router-dom";
import Kiss from '../asset/kisscathotel.png'
import Search from '../asset/search.png'
import profile from '../asset/profile.png'
import iconcat from '../asset/iconcat.png'
import iconrev from '../asset/iconrev.png'
import { SearchContext } from './searchcontext';
import { ModalLogin } from './modal';

export const Banner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isInnerRoom = location.pathname === "/Inner-Room";
    const isDetailProductPage = location.pathname === "/Detail-Product";
    const isProfilePage = location.pathname === "/My-Profile";
    const isCatsPage = location.pathname === "/My-CutieCat";
    const isConFirmedPage = location.pathname === "/Confirmed-A-Reservation";
    const isMyReservation = location.pathname === "/My-Reservation";
    const isMyDetailReservation = location.pathname === "/My-Detail-Reservation";
    const { user, userData } = useContext(UserContext);
    const { setSearchQuery } = useContext(SearchContext);
    const [isUserLogin, setUserLogin] = useState('');
    const [isModalLogin, setModalLogin] = useState(false);
    const [isUsersData, setUsersData] = useState({});


    useEffect(() => {
        console.log("banner..");
        ChecKUserLogin()
    }, []);

    const goHome = () => {
        navigate("/")
    }

    const goProfile = () => {
        navigate("/My-Profile")
    }

    const goMyCutieCat = () => {
        navigate("/My-CutieCat")
    }

    const goMyRev = () => {
        console.log("....");
        navigate("/My-Reservation")
    }

    const ChecKUserLogin = () => {
        const login = localStorage.getItem('login_status');
        console.log("login หรือยัง : ", login);
        setUserLogin(login)
        if (login === "Y") {
            getUsersData()
        };
    }

    const getUsersData = async () => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            const isUser = currentUser.uid;
            console.log("isUser: ", isUser);
            const docRef = firebase.firestore().collection('users').doc(isUser);
            docRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    console.log('เช็คข้อมูล', data);
                    setUsersData(data);
                }
            });
        } else {
            console.log("No user is currently logged in.");
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

    // const Logout = () => {
    //     localStorage.setItem('login_status', "N")
    //     firebase.auth().signOut()
    //     navigate("/")
    //     // ทำการ refresh หน้าเพจหลังจากเข้าสู่ระบบสำเร็จ
    //     window.location.reload();
    // }

    return (
        <>
            <div style={{
                backgroundColor: "#f8ebe1", display: "flex", flexDirection: "column",
                height: isDetailProductPage || isProfilePage || isCatsPage || isMyReservation || isMyDetailReservation ? "100vh" : "auto",
            }}>
                {modalLogin()}
                <div style={{ backgroundColor: "#FFFFFF", marginTop: 10, borderRadius: 20, alignItems: "center", display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: 20, marginRight: 20, padding: "40px 0px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }}>
                    <img
                        src={Kiss} onClick={() => goHome()} alt="Brief Screen" className="brief-image" style={{ width: 80, height: 80, paddingLeft: 40, cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", flexDirection: "row", paddingRight: 40 }}>
                        <div style={{ position: "relative", }}>
                            < img
                                src={Search} alt="Brief Screen" className="brief-image" style={{ width: 32, height: 32, position: "absolute", top: 25, left: 6 }}
                            />
                            <input
                                style={{
                                    paddingTop: 24, paddingBottom: 24, paddingLeft: 60, paddingRight: 10, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", borderStyle: "none", fontFamily: "Itim-Regular", fontSize: 24, color: "#000", width: (isUserLogin === "N") ? 190 : 160
                                }}
                                placeholder='ค้นหาห้อง'
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                        </div>
                        {(isUserLogin === "N")
                            ? <div
                                onClick={() => setModalLogin(true)}
                                style={{ fontFamily: "Itim-Regular", fontSize: 24, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", padding: "20px 70px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                เข้าสู่ระบบ
                            </div>
                            : <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <div
                                    onClick={() => goMyRev()}
                                    style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer", marginRight: 30 }}>
                                    < img
                                        src={iconrev} alt="Brief Screen" className="brief-image" style={{ width: 30, height: 30, borderRadius: 35, marginRight: 10 }}
                                    />
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24 }}>
                                        การจอง
                                    </div>
                                </div>
                                <div
                                    onClick={() => goMyCutieCat()}
                                    style={{
                                        display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer", marginRight: 30
                                    }}>
                                    < img
                                        src={iconcat} alt="Brief Screen" className="brief-image" style={{ width: 30, height: 30, borderRadius: 35, marginRight: 10, marginTop: 2 }}
                                    />
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24 }}>
                                        แมวของฉัน
                                    </div>
                                </div>
                                {(userData ? userData.pic_profile === "" : 'Loading...')
                                    ? < img
                                        onClick={() => goProfile()}
                                        src={profile} alt="Brief Screen" className="brief-image" style={{ width: 64, height: 64, borderRadius: 35, marginRight: 20, cursor: "pointer" }}
                                    />
                                    : < img
                                        onClick={() => goProfile()}
                                        src={userData ? userData.pic_profile : 'Loading...'} alt="Brief Screen" className="brief-image" style={{ width: 64, height: 64, borderRadius: 35, marginRight: 20, cursor: "pointer" }}
                                    />
                                }
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginRight: 5 }}>
                                    {userData ? userData.name : 'Loading...'}
                                </div>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 24 }}>
                                    {userData ? userData.lastname : ''}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    )
}