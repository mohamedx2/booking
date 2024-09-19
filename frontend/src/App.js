import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./css/animate.css";
import "./css/animate.min.css";
import "./App.css";
import {
  Home,
  Contact,
  PageNotFound,
  Room,
  Services,
  LoginForm,
  Register,
  OwnerPage,
  ReservationTable,
  UserReservation,
} from "./pages/index";
import AppLayout from "./Layouts/AppLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import {
  User,
  Comments,
  Dashhome
} from "./Dashboardpages";

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIslogin] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const Token = localStorage.getItem("token");
      const idCompte = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${idCompte}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');  throw new Error('Network response was not ok');}
        
      const data = await response.json();
      setIslogin(true)        
      setIsOwner( data.role === "proprietaire" && data.verife)
      setIsAdmin(data.role === "admin")  ;console.log(isOwner)
      setUserInfo(data);
      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
  

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <Router>
  
      <Routes>
        <Route path="/" element={isAdmin ? <Navigate to="/dashhome/home" /> : <AppLayout><Home /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
        <Route path="/owner" element={isOwner?<AppLayout><OwnerPage /></AppLayout> :<Navigate to="/" />} />
        <Route path="/owner/reservation" element={isOwner ? <AppLayout><ReservationTable /></AppLayout>:<Navigate to="/" />} />
        <Route path="/userreservation" element={isAdmin?<Navigate to="/" />:<AppLayout><UserReservation /></AppLayout>} />
        <Route path="/*" element={<AppLayout><PageNotFound /></AppLayout>} />
        <Route path="/offers" element={isAdmin?<Navigate to="/" />:<AppLayout><Room /></AppLayout>} />
        <Route path="/services" element={isAdmin?<Navigate to="/" />:<AppLayout><Services /></AppLayout>} />
        <Route path="/login" element={!isLogin?<AppLayout><LoginForm /></AppLayout>:<Navigate to="/" />} />
        <Route path="/register" element={!isLogin?<AppLayout><Register /></AppLayout>:<Navigate to="/" />} />
        <Route path="/dashhome" element={isAdmin ? <DashboardLayout><Dashhome /></DashboardLayout> : <Navigate to="/" />} >
          <Route path="home" element={<Dashhome />} />
          <Route path="user" element={<User />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </Router>
  );
}


