import React, { useEffect, useState } from "react";
import { firebase } from "./backend/backend"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Dashboard from "./transition/dashboard";
import CheckRole from "./transition/checkrole";

// import ReserveDetail from './transition/reserve_detail'

export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  //สถานะผู้ใช้
  function onAuthStateChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    console.log("initializing: ", initializing);
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("appjs..");
      // await SplashScreen.preventAutoHideAsync();
      console.log("userrrrrr: ", user);
      const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChange)
      if (user) {
        console.log("user กำลัง login อยู่");
        // console.log("user appjs: ",user);
      } else {
        console.log("ไม่มีคน login ตอนนี้");
      }

      return subscriber;
    };
    fetchData();
  }, []);

  if (initializing) {
    return undefined;
  }

  if (!user) {//หน้าที่ยังไม่login
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return (//หน้าที่loginแล้ว
    <BrowserRouter>
      <Routes>
        <Route path='CheckRole' element={<CheckRole />} />
        <Route path='/' element={<Dashboard />} />
        {/* <Route path='/ReserveDetail' element={<ReserveDetail />} /> */}
      </Routes>
    </BrowserRouter>
  );
}