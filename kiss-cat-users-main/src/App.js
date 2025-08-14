import React, { useEffect, useState, createContext } from "react";
import { firebase } from "./backend/backend"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//component
import { Banner } from "./component/banner";
import { SearchProvider } from "./component/searchcontext";
//checkrole
import CheckRole from "./transition/checkrole";
//page
import Home from "./transition/home";
import InnerRoom from "./transition/innerroom";
import DetailProduct from "./transition/detailproduct";
import Profile from "./transition/profile";
import MyCats from "./transition/mycats";
import MakeReservation from "./transition/makereservation";
import ConfirmedReservation from "./transition/confirm";
import MyReservation from "./transition/myreservation"
import DetailRes from "./transition/detailreservation";
import ServiceCamera from "./transition/servicecamera";


export const UserContext = createContext();

export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState(null);
  //สถานะผู้ใช้
  function onAuthStateChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    console.log("initializing: ", initializing);
  }



  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(async (user) => {
      // localStorage.setItem('login_status', "N");
      if (user) {
        console.log("User is logged in");
        setUser(user);
        localStorage.setItem('login_status', "Y");
        // Fetch user data immediately
        const docRef = firebase.firestore().collection('users').doc(user.uid);
        const doc = await docRef.get();
        if (doc.exists) {
          setUserData(doc.data());
        }
      } else {
        console.log("No user is logged in");
        setUser(null);
        setUserData(null);
        localStorage.setItem('login_status', "N");
      }
      setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, userData }}>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Banner />}>
              <Route index element={<Home />} />
              <Route path="/Inner-Room" element={<InnerRoom />} />
              <Route path="/Detail-Product" element={<DetailProduct />} />
              <Route path="/My-Profile" element={<Profile />} />
              <Route path="/My-CutieCat" element={<MyCats />} />
              <Route path="/My-Reservation" element={<MyReservation />} />
              <Route path="/My-Detail-Reservation" element={<DetailRes />} />
              <Route path="/Make-A-Reservation" element={<MakeReservation />} />
              <Route path="/Confirmed-A-Reservation" element={<ConfirmedReservation />} />
              <Route path="/Service-Camera" element={<ServiceCamera />} />
              <Route path="/Check-Role" element={<CheckRole />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </UserContext.Provider>
  );
}