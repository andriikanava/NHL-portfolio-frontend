import React, { useContext } from "react";
import "./banner.css";
import { AuthContext } from "../../context/AuthContext";

function Banner() {
    const { user } = useContext(AuthContext);

    return (
        <div className="banner-container">
            <h1>Welcome{user ? `, ${user.username}` : ""} 👋</h1>
            <h3>Andrii's Portfolio</h3>
        </div>
    );
}

export default React.memo(Banner);
