import React, { useContext } from "react";
import "./navbar.css";
import { AuthContext  } from "../../context/AuthContext";

function Navbar() {
    const { user } = useContext(AuthContext);
    return (
        <nav className="navbar">
        <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/projects">Projects</a></li>
        </ul>
        <a className="user" href={user ? "/profile" : "/login"}>{user ? user.username : "Login"}</a>
        </nav>
    )
}

export default Navbar;