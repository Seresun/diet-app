import React from "react";
import { useLocation, Link } from "react-router-dom";
import DailyMenu from "../components/DailyMenu";

export default function DailyMenuPage() {
  const location = useLocation();
  // menu should be passed via location.state.menu
  const menu = location.state?.menu || [];

  return (
    <div className="daily-menu-page">
      <h1>Daily Menu</h1>
      <Link to="/">← Back</Link>
      <DailyMenu menu={menu} />
    </div>
  );
} 