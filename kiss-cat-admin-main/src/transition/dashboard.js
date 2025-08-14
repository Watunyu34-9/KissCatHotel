import React, { useEffect, useState } from 'react';
import '../App.css'
import { isEmpty } from '../component/empty';

//pic
import Kiss from '../asset/kisscathotel.png'
import dashboardtab from '../asset/dashboardtab.png'
import manageusertab from '../asset/manageusertab.png'
import manageroomtab from '../asset/manageroomtab.png'
import managepromotiontab from '../asset/managepromotiontab.png'
import reservetab from '../asset/reservetab.png'
import notification from '../asset/notification.png'
import defaultprofile from '../asset/defaultprofile.png'
import logout from '../asset/logout.png'

//page
import ManageUsers from "./manage_users"
import ManageRoom from './manage_room';
import ManagePromotion from './manage_promotion';
import Reserve from './reserve';


import { useNavigate } from "react-router-dom";
import { firebase } from "../backend/backend"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


//isนำไปใช้ setนำค่าเข้ามา
export default function Dashboard({ navigation }) {
    const navigate = useNavigate();
    const isUser = firebase.auth().currentUser.uid;
    const [isDashBoardPage, setDashBoardPage] = useState(true);
    const [isManageUsersPage, setManageUsersPage] = useState(false);
    const [isManageRoomPage, setManageRoomPage] = useState(false);
    const [isManageRoomPageAnyClick, setManageRoomPageAnyClick] = useState(false);
    const [isManageRoomType, setManageRoomPageType] = useState(true);
    const [isManageRoomAnyTypeArr, setManageRoomAnyTypeArr] = useState([]);
    const [isNameTypeRoom, setNameTypeRoom] = useState("");
    const [isIdTypeRoom, setIdTypeRoom] = useState(null);
    const [isManagePromotionPage, setManagePromotionPage] = useState(false);
    const [isReserve, setReservePage] = useState(false);
    const [isDocList, setDocList] = useState([]);
    const [isTypeRoomData, setTypeRoomData] = useState([]);
    const [isAlert, setAlert] = useState("");


    useEffect(() => {
        console.log("home..");
        getDashBoardData();
    }, []);

    const selectDashBoardTab = () => {
        setDashBoardPage(true)
        setManageUsersPage(false)
        setManageRoomPage(false)
        setManageRoomPageAnyClick(false)
        setManageRoomPageType(false)
        setManagePromotionPage(false)
        setReservePage(false)
    }

    const selectManageUsersTab = () => {
        setDashBoardPage(false)
        setManageUsersPage(true)
        setManageRoomPage(false)
        setManageRoomPageAnyClick(false)
        setManageRoomPageType(false)
        setManagePromotionPage(false)
        setReservePage(false)
    }

    const selectManageRoomTab = () => { //ปุ่มแท็บจัดการห้องพัก
        setDashBoardPage(false)
        setManageUsersPage(false)
        setManageRoomPage(true)
        setManageRoomPageAnyClick(!isManageRoomPageAnyClick)
        setManagePromotionPage(false)
        setReservePage(false)
        if (isManageRoomAnyTypeArr.length === 0) {
            setManageRoomPageType(true)
        } else {
            setManageRoomPageType(false);
        }

    }

    const selectManageAllRoomType = () => { //ปุ่มจัดการประเภทห้อง
        setManageRoomPageType(true);
        setManageRoomAnyTypeArr([]);
    };

    const selectManageRoomAnyType = (item, index) => { //ปุ่มประเภทห้องต่างๆ
        console.log("indexselectManageRoomAnyType: ", index);
        setManageRoomPageType(false);
        const newManageRoomAnyTypeArr = isTypeRoomData.map((_, idx) => idx === index);
        setManageRoomAnyTypeArr(newManageRoomAnyTypeArr);
        setNameTypeRoom(item.name_room)
        setIdTypeRoom(item.id)
    };

    const selectManagePromotionTab = () => {
        setDashBoardPage(false)
        setManageUsersPage(false)
        setManageRoomPage(false)
        setManageRoomPageAnyClick(false)
        setManageRoomPageType(false)
        setManagePromotionPage(true)
        setReservePage(false)
    }

    const setNotiToN = async () => {
        try {
            const firestore = firebase.firestore();
            const adminRef = firestore.collection('admin').doc(isUser);
            await adminRef.update({ alert: "N" });
            console.log("Alert set to 'N' successfully");
            selectReserveTab()
        } catch (error) {
            console.error("Error setting alert: ", error);
        }
    };

    const selectReserveTab = () => {
        setDashBoardPage(false)
        setManageUsersPage(false)
        setManageRoomPage(false)
        setManageRoomPageAnyClick(false)
        setManageRoomPageType(false)
        setManagePromotionPage(false)
        setReservePage(true)
    }

    const handleRoomSelect = (item, index) => {
        console.log("isSelectedRoomData from ManageRoom: ", index);
        setManageRoomPageType(false);
        const newManageRoomAnyTypeArr = isTypeRoomData.map((_, idx) => idx === index);
        setManageRoomAnyTypeArr(newManageRoomAnyTypeArr);
        setNameTypeRoom(item.name_room)
        setIdTypeRoom(item.id)
    };

    const getDashBoardData = async () => {
        const docRef = firebase.firestore().collection('admin').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                setAlert(data.alert)
                if (data.my_dashboard && data.my_dashboard.length > 0) {
                    setDocList(data.my_dashboard[0]);

                } else {
                    setDocList([]);
                } if (data.my_catroom && data.my_catroom.length > 0) {
                    setTypeRoomData(data.my_catroom)
                } else {
                    setTypeRoomData([])
                }
            }
        });
    }


    const BarChart = () => {
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: '',
                    data: (isEmpty(isDocList.Monthly_income)) ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : isDocList.Monthly_income,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',  // January
                        'rgba(54, 162, 235, 0.2)',  // February
                        'rgba(255, 206, 86, 0.2)',  // March
                        'rgba(75, 192, 192, 0.2)',  // April
                        'rgba(153, 102, 255, 0.2)', // May
                        'rgba(255, 159, 64, 0.2)',  // June
                        'rgba(255, 99, 132, 0.2)',  // July
                        'rgba(54, 162, 235, 0.2)',  // August
                        'rgba(255, 206, 86, 0.2)',  // September
                        'rgba(75, 192, 192, 0.2)',  // October
                        'rgba(153, 102, 255, 0.2)', // November
                        'rgba(255, 159, 64, 0.2)',  // December
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,  // ซ่อน legend ทั้งหมด
                    // position: 'top',
                },
                title: {
                    display: true,
                    // text: 'Monthly Data',
                },
            },
            scales: {
                y: {
                    beginAtZero: true, // เริ่มต้นที่ศูนย์
                    suggestedMin: 0, // ค่าต่ำสุดที่แนะนำ
                    suggestedMax: 90, // ค่าสูงสุดที่แนะนำ
                    ticks: {
                        stepSize: 10, // ขนาดของแต่ละขั้น
                        callback: function (value, index, values) {
                            return value + ' บาท'; // การตั้งค่าให้แสดงหน่วย
                        }
                    },
                },
            },
        };

        return <Bar data={data} options={options} />;
    };

    const Logout = () => {
        firebase.auth().signOut()
        // navigate('/');
    }


    return (
        <>
            <div style={{ backgroundColor: "#f5f5f5", display: "flex", height: "100vh", width: "100vw", flexDirection: "column" }}>
                <div style={{ backgroundColor: "#FFFFFF", width: "98%", marginTop: 10, borderRadius: 20, height: "19%", alignItems: "center", display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: 20, marginRight: 20 }}>
                    <img
                        src={Kiss} alt="Brief Screen" className="brief-image" style={{ width: 80, height: 80, paddingLeft: 40 }}
                    />
                    <div style={{ display: "flex", flexDirection: "row", paddingRight: 40, alignItems: "center" }}>
                        <div
                            onClick={() => setNotiToN()}
                            style={{
                                position: "relative", marginRight: 25, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer"
                            }}>
                            < img
                                src={notification} alt="Brief Screen" className="brief-image" style={{ width: 32, height: 32 }}
                            // onClick={() => Logout()}
                            />
                            {(isAlert === "Y")
                                ? <div style={{ position: "absolute", zIndex: 999, right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyItems: "center", display: "flex", flexDirection: "row", marginLeft: 20, backgroundColor: "red" }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, alignItems: "center", justifyItems: "center", display: "flex", flexDirection: "row", marginLeft: 13, color: "white" }}>
                                        !
                                    </div>
                                </div>
                                : null}
                        </div>
                        <div style={{ marginRight: 20 }}>
                            < img
                                src={defaultprofile} alt="Brief Screen" className="brief-image" style={{ width: 80, height: 80 }}
                            // onClick={() => Logout()}
                            />
                        </div>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20 }}>
                            Admeaw
                        </div>
                    </div>

                </div>
                <div style={{ justifyContent: "space-between", flexDirection: "row", display: "flex", height: "79%", }}>
                    <div style={{ backgroundColor: "#FFFFFF", width: "20%", marginTop: 20, borderRadius: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: 20, }}>
                        <div style={{ width: "100%", flexDirection: "column", display: "flex", justifyContent: "space-between", overflow: (isManageRoomPage) ? "scroll" : null, height: (isManageRoomPage) ? "100%" : null }}>
                            <div style={{}}>
                                <button style={{
                                    backgroundColor: (isDashBoardPage) ? "#714B1C" : "#FFF", height: 80, width: "100%", border: "none", borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 20, cursor: (isDashBoardPage) ? null : "pointer"
                                }}
                                    onClick={() => selectDashBoardTab()}
                                    disabled={(isDashBoardPage) ? true : false}
                                >
                                    <img
                                        src={dashboardtab} alt="Brief Screen" className="brief-image" style={{ width: 40, height: 40, }}
                                    />
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: (isDashBoardPage) ? "#FFF" : "#000" }}>
                                        แดชบอร์ด
                                    </div>
                                </button>
                                <button
                                    style={{ backgroundColor: (isManageUsersPage) ? "#714B1C" : "#FFF", height: 80, width: "100%", border: "none", alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 20, cursor: (isManageUsersPage) ? null : "pointer" }}
                                    onClick={() => selectManageUsersTab()}
                                    disabled={(isManageUsersPage) ? true : false}
                                >
                                    <img
                                        src={manageusertab} alt="Brief Screen" className="brief-image" style={{ width: 40, height: 40, }}
                                    />
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: (isManageUsersPage) ? "#FFF" : "#000" }}>
                                        จัดการผู้ใช้
                                    </div>
                                </button>
                                <button
                                    style={{ backgroundColor: (isManageRoomPage) ? "#714B1C" : "#FFF", height: 80, width: "100%", border: "none", alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 20, cursor: "pointer" }}
                                    onClick={() => selectManageRoomTab()}
                                // disabled={(isManageRoomPage) ? true : false}
                                >
                                    <img
                                        src={manageroomtab} alt="Brief Screen" className="brief-image" style={{ width: 40, height: 40, }}
                                    />
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: (isManageRoomPage) ? "#FFF" : "#000" }}>
                                        จัดการห้องพัก
                                    </div>
                                    {(isManageRoomPageAnyClick)
                                        ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 16, marginLeft: 30, color: "#FFF", rotate: 180 }}>
                                            V
                                        </div>
                                        : null
                                    }
                                </button>
                                {(isManageRoomPageAnyClick)
                                    ? <div style={{ borderWidth: 1, borderStyle: "solid", borderColor: "#714B1C" }}>
                                        <button
                                            onClick={selectManageAllRoomType}
                                            style={{
                                                backgroundColor: isManageRoomType ? "#BCAB95" : "#EEE5DB",
                                                height: 80,
                                                width: "100%",
                                                border: "none",
                                                alignItems: "center",
                                                display: "flex",
                                                flexDirection: "row",
                                                paddingLeft: 20,
                                                cursor: isManageRoomType ? "default" : "pointer",
                                            }}>
                                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: isManageRoomType ? "#FFF" : "#714B1C" }}>
                                                จัดการประเภทห้อง
                                            </div>
                                        </button>
                                        {isTypeRoomData.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => selectManageRoomAnyType(item, index)}
                                                // disabled={isManageRoomAnyTypeArr[index] || false}
                                                style={{
                                                    backgroundColor: isManageRoomAnyTypeArr[index] ? "#BCAB95" : "#EEE5DB",
                                                    height: 80,
                                                    width: "100%",
                                                    border: "none",
                                                    alignItems: "center",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    paddingLeft: 20,
                                                    cursor: isManageRoomAnyTypeArr[index] ? "default" : "pointer",
                                                }}>
                                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: isManageRoomAnyTypeArr[index] ? "#FFF" : "#714B1C" }}>
                                                    ห้อง {item.name_room}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    : null
                                }
                                <button style={{ backgroundColor: (isManagePromotionPage) ? "#714B1C" : "#FFF", height: 80, width: "100%", border: "none", alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 20, cursor: (isManagePromotionPage) ? null : "pointer" }}
                                    onClick={() => selectManagePromotionTab()}
                                    disabled={(isManagePromotionPage) ? true : false}
                                >
                                    <img
                                        src={managepromotiontab} alt="Brief Screen" className="brief-image" style={{ width: 40, height: 40, }}
                                    />
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: (isManagePromotionPage) ? "#FFF" : "#000" }}>
                                        จัดการโปรโมชั่น
                                    </div>
                                </button>
                                <button style={{ backgroundColor: (isReserve) ? "#714B1C" : "#FFF", height: 80, width: "100%", border: "none", alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 20, cursor: (isReserve) ? null : "pointer" }}
                                    onClick={() => selectReserveTab()}
                                    disabled={(isReserve) ? true : false}
                                >
                                    <img
                                        src={reservetab} alt="Brief Screen" className="brief-image" style={{ width: 40, height: 40, }}
                                    />
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20, color: (isReserve) ? "#FFF" : "#000" }}>
                                        รายการจอง
                                    </div>
                                </button>
                            </div>
                            <div style={{ flexDirection: "row", alignItems: "center", display: "flex", cursor: "pointer", marginLeft: 28, marginBottom: 24, justifySelf: "flex-end" }}>
                                <img
                                    src={logout} alt="Brief Screen" className="brief-image" style={{ width: 25, height: 25, }}
                                />
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}
                                    onClick={() => Logout()}
                                >
                                    ออกจากระบบ
                                </div>
                            </div>
                        </div>
                    </div>
                    {(isDashBoardPage)
                        ?
                        <div style={{ width: "100%" }}>
                            <div style={{ flexDirection: "row", display: "flex" }}>
                                <div style={{ backgroundColor: "#FFF", borderRadius: 20, height: "25%", marginLeft: 20, marginTop: 20, marginRight: 20, width: "20%", flex: 1, display: "flex", flexDirection: "column", }}>
                                    <div style={{ marginTop: 19, marginLeft: 19, fontFamily: "Prompt-Medium", fontSize: 20 }}>
                                        ผู้ใช้ทั้งหมด
                                    </div>
                                    <div style={{ flexDirection: "row", display: "flex", alignSelf: "center", marginTop: 20, alignItems: "center" }}>
                                        {(isEmpty(isDocList.users_number))
                                            ? <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                0
                                            </div>
                                            : <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                {isDocList.users_number}
                                            </div>
                                        }
                                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginBottom: -25 }}>
                                            คน
                                        </div>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#FFF", borderRadius: 20, height: "25%", marginTop: 20, marginRight: 20, width: "20%", flex: 1, display: "flex", flexDirection: "column", }}>
                                    <div style={{ marginTop: 19, marginLeft: 19, fontFamily: "Prompt-Medium", fontSize: 20 }}>
                                        แมวทั้งหมด
                                    </div>
                                    <div style={{ flexDirection: "row", display: "flex", alignSelf: "center", marginTop: 16, alignItems: "center" }}>
                                        {(isEmpty(isDocList.cats_number))
                                            ? <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                0
                                            </div>
                                            : <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                {isDocList.cats_number}
                                            </div>
                                        }
                                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginBottom: -25 }}>
                                            ตัว
                                        </div>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#FFF", borderRadius: 20, height: "25%", marginTop: 20, marginRight: 20, width: "20%", flex: 1, display: "flex", flexDirection: "column", }}>
                                    <div style={{ marginTop: 19, marginLeft: 19, fontFamily: "Prompt-Medium", fontSize: 20 }}>
                                        จำนวนห้องพักทั้งหมด
                                    </div>
                                    <div style={{ flexDirection: "row", display: "flex", alignSelf: "center", marginTop: 16, alignItems: "center" }}>
                                        {(isEmpty(isDocList.rooms_number))
                                            ? <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                0
                                            </div>
                                            : <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                {isDocList.rooms_number}
                                            </div>
                                        }
                                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginBottom: -25 }}>
                                            ห้อง
                                        </div>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#FFF", borderRadius: 20, height: "25%", marginTop: 20, marginRight: 20, width: "20%", flex: 1, display: "flex", flexDirection: "column", }}>
                                    <div style={{ marginTop: 19, marginLeft: 19, fontFamily: "Prompt-Medium", fontSize: 20 }}>
                                        รายการจอง
                                    </div>
                                    <div style={{ flexDirection: "row", display: "flex", alignSelf: "center", marginTop: 16, alignItems: "center" }}>
                                        {(isEmpty(isDocList.reservations))
                                            ? <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                0
                                            </div>
                                            : <div style={{ marginRight: 10, fontFamily: "Prompt-Medium", fontSize: 60 }}>
                                                {isDocList.reservations}
                                            </div>
                                        }
                                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginBottom: -25 }}>
                                            รายการ
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginLeft: 20, marginTop: 20, backgroundColor: "#FFF", borderRadius: 20, marginRight: 20, height: "73%", }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, paddingTop: 20, marginLeft: 20 }}>
                                    รายได้ต่อเดือน
                                </div>
                                <div style={{ height: 488, justifyContent: "center", display: "flex", alignSelf: "center", width: "100%", marginTop: -20 }}>
                                    <BarChart />
                                </div>
                            </div>
                        </div>
                        : (isManageUsersPage)
                            ? <div style={{ backgroundColor: "#FFFFFF", width: "100%", marginTop: 20, borderRadius: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 20, marginLeft: 20 }}>
                                <ManageUsers />
                            </div>
                            : (isManageRoomPage)
                                ? < div style={{ backgroundColor: "#FFFFFF", width: "100%", marginTop: 20, borderRadius: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 20, marginLeft: 20 }}>
                                    <ManageRoom allRoomm={isManageRoomType} selectRoom={isManageRoomAnyTypeArr} nameTypeRoom={isNameTypeRoom} nameRoomidTopic={isIdTypeRoom} onRoomSelect={handleRoomSelect} />
                                </div>
                                : (isManagePromotionPage)
                                    ? < div style={{ backgroundColor: "#FFFFFF", width: "100%", marginTop: 20, borderRadius: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 20, marginLeft: 20 }}>
                                        <ManagePromotion />
                                    </div>
                                    : <Reserve />
                    }
                </div >
            </div >
        </>

    );
};