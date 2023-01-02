import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../presentation/Home";

export default function Router() {
  return (
    <BrowserRouter>
      {
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/form" element={<userForm />}></Route>
        </Routes>
      }
    </BrowserRouter>
  );
}
