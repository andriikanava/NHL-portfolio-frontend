import React, { useContext, useState } from "react";
import "./banner.css"
import { AuthContext } from "../../context/AuthContext";

function Banner() {
    const { user } = useContext(AuthContext);
    if (user) {
        return (
            <div class="banner-container">
                <h1>Welcome, {user.username} 👋</h1>
                <h3>Andrii's Portfolio</h3>
            </div>
        )
    }
    else {
        return (
            <div class="banner-container">
                <h1>Welcome 👋</h1>
                <h3>Andrii's Portfolio</h3>
            </div>
        )
    }
}

export default Banner;