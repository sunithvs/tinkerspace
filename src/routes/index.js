import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../presentation/Home";
import SignIn from "../presentation/SignIn";

export default function Router() {
    return (
        <BrowserRouter>
            {
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/login" element={<SignIn/>}></Route>
                </Routes>
            }
        </BrowserRouter>
    );
}
