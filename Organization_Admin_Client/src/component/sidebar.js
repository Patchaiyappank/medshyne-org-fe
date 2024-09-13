import React, { useState, useContext } from "react";
import debounce from "lodash/debounce";
import home from "../assets/home-2.png";
import { useLocation, useNavigate } from "react-router-dom";
import group from "../assets/Frame.png";
import inventory from "../assets/Frame-1.png";
import wallet from "../assets/Frame-2.png";
import chat from "../assets/messages.png";
import clock from "../assets/Frame-3.png";
import "./sidebar.css";
import { MyContext } from "../ProjectContext";
import logo from "../assets/image.png";
import logotext from "../assets/meshynetext.png";

function Sidebar() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { iconClick, setIconClick } = useContext(MyContext);
  
  const debouncedSetHoveredIcon = debounce((icon) => {
    setHoveredIcon(icon);
  }, 50);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleIconClickSafe = (icon, path) => {
    console.log("Icon Clicked:", icon); // Debugging log
    setIconClick(icon);
    navigate(path);
  };

  return (
    <div className={`sidebar ${expanded ? "expanded" : ""}`}>
      <ul style={{ display: "flex", flexDirection: "column", padding: 0 }}>
        <li style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            style={{
              height: "45px",
              width: "45px",
              marginBottom: "25px",
              marginLeft: "-6px",
            }}
            src={logo}
            alt="Logo Icon"
          />
          {expanded && (
            <span className="menu-text1">
              <img
                style={{
                  height: "45px",
                  marginBottom: "25px",
                  marginLeft: "-16px",
                }}
                src={logotext}
                alt="Logo Text"
              />
            </span>
          )}
        </li>

        <li
          onClick={() => handleIconClickSafe("home", "/Dashboard")}
          onMouseOver={() => debouncedSetHoveredIcon("home")}
          onMouseOut={() => debouncedSetHoveredIcon(null)}
          className={location.pathname === "/Dashboard" ? "active-sidebar" : ""}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              height: "28px",
              marginRight: expanded ? "10px" : "0px",
              transform: "scale(.9)",
              filter:
                location.pathname === "/Dashboard"
                  ? "invert(1) brightness(1000%)"
                  : hoveredIcon === "home"
                  ? "brightness(0) invert(0)"
                  : "none",
            }}
            src={home}
            alt="Home Icon"
          />
          {expanded && <span className="menu-text1">Home</span>}
        </li>

        <li
          onClick={() => handleIconClickSafe("inventory", "/MedicineInventory")}
          onMouseOver={() => debouncedSetHoveredIcon("inventory")}
          onMouseOut={() => debouncedSetHoveredIcon(null)}
          className={location.pathname === "/MedicineInventory" ? "active-sidebar" : ""}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              height: "28px",
              marginRight: expanded ? "10px" : "0",
              transform: "scale(1.5)",
              filter:
                location.pathname === "/MedicineInventory"
                  ? "invert(1) brightness(1000%)"
                  : hoveredIcon === "inventory"
                  ? "brightness(0) invert(0)"
                  : "none",
            }}
            src={inventory}
            alt="Inventory Icon"
          />
          {expanded && <span className="menu-text1">Inventory</span>}
        </li>

        <li
          onClick={() => handleIconClickSafe("group", "/MenuList")}
          onMouseOver={() => debouncedSetHoveredIcon("group")}
          onMouseOut={() => debouncedSetHoveredIcon(null)}
          className={location.pathname === "/MenuList" ? "active-sidebar" : ""}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              height: "28px",
              marginRight: expanded ? "10px" : "0",
              transform: "scale(1.5)",
              filter:
                location.pathname === "/MenuList"
                  ? "invert(1) brightness(1000%)"
                  : hoveredIcon === "group"
                  ? "brightness(0) invert(0)"
                  : "none",
            }}
            src={group}
            alt="Group Icon"
          />
          {expanded && <span className="menu-text1">People</span>}
        </li>

        <li
          onClick={() => handleIconClickSafe("wallet", "/Payments")}
          onMouseOver={() => debouncedSetHoveredIcon("wallet")}
          onMouseOut={() => debouncedSetHoveredIcon(null)}
          className={location.pathname === "/Payments" ? "active-sidebar" : ""}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              height: "28px",
              marginRight: expanded ? "10px" : "0",
              transform: "scale(1.5)",
              filter:
                location.pathname === "/Payments"
                  ? "invert(1) brightness(1000%)"
                  : hoveredIcon === "wallet"
                  ? "brightness(0) invert(0)"
                  : "none",
            }}
            src={wallet}
            alt="Wallet Icon"
          />
          {expanded && <span className="menu-text1">Payments</span>}
        </li>

        <li
          onClick={() => handleIconClickSafe("consulting", "/ConsultingHistory")}
          onMouseOver={() => debouncedSetHoveredIcon("consulting")}
          onMouseOut={() => debouncedSetHoveredIcon(null)}
          className={location.pathname === "/ConsultingHistory" ? "active-sidebar" : ""}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              height: "28px",
              marginRight: expanded ? "10px" : "0",
              transform: "scale(1.5)",
              filter:
                location.pathname === "/ConsultingHistory"
                  ? "invert(1) brightness(1000%)"
                  : hoveredIcon === "consulting"
                  ? "brightness(0) invert(0)"
                  : "none",
            }}
            src={clock}
            alt="Consulting Icon"
          />
          {expanded && <span className="menu-text1">Consultation</span>}
        </li>

        <li
          onClick={() => handleIconClickSafe("chat", "/Chat")}
          onMouseOver={() => debouncedSetHoveredIcon("chat")}
          onMouseOut={() => debouncedSetHoveredIcon(null)}
          className={location.pathname === "/Chat" ? "active-sidebar" : ""}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              height: "28px",
              marginRight: expanded ? "10px" : "0",
              filter:
                location.pathname === "/Chat"
                  ? "invert(1) brightness(1000%)"
                  : hoveredIcon === "chat"
                  ? "brightness(0) invert(0)"
                  : "none",
            }}
            src={chat}
            alt="Chat Icon"
          />
          {expanded && <span className="menu-text1">Message</span>}
        </li>
      </ul>

      <button
        className={expanded ? "toggle-button1" : "toggle-button"}
        onClick={toggleSidebar}
      >
        <div>
          <span
            style={{
              transform: "scaleY(2)",
              display: "inline-block",
              fontWeight: "300",
              fontSize: "15px",
            }}
          >
            {expanded ? "<" : ">"}
          </span>
        </div>
      </button>
    </div>
  );
}

export default Sidebar;
