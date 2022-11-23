import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //   Navigate,
} from "react-router-dom";
import Login from "../views/Login/Login";
import NewsSandBox from "../views/SandBox/NewsSandBox";
export default function indexRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="*"
          //   element={
          //     localStorage.getItem("token") ? (
          //       <NewsSandBox />
          //     ) : (
          //       <Navigate to="/login" />
          //     )
          //   }
          element={<NewsSandBox></NewsSandBox>}
        ></Route>
      </Routes>
    </Router>
  );
}
