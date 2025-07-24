import TestButtons from "../TestButtons/TestButtons";
import "./Navbar.css"

export default function Navbar() {
    return (
        <div className="navbar">
        <div className="menu">
            <ul className="menu-list">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Contact</li>
            <TestButtons />
            </ul>
        </div>
        </div>
    );
}
