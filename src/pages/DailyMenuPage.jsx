import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import DailyMenu from "../components/DailyMenu";
import CalorieSelector from "../components/CalorieSelector";
import diagnosesData from "../data/diagnoses.json";

export default function DailyMenuPage() {
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [diet, setDiet] = useState(null);

  useEffect(() => {
    // Get diet data from location state or find by diagnosis ID
    const diagnosisId = location.state?.diagnosisId;
    
    if (diagnosisId) {
      const foundDiet = diagnosesData.find(d => d.id === diagnosisId);
      if (foundDiet) {
        setDiet(foundDiet);
        setMenu(foundDiet.dailyPlan);
      }
    } else if (location.state?.menu) {
      // Fallback to direct menu data
      setMenu(location.state.menu);
    }
  }, [location.state]);

  const handleMenuUpdate = (updatedMenu) => {
    setMenu(updatedMenu);
  };

  if (!diet && !menu.length) {
    return (
      <div className="daily-menu-page">
        <h1>Daily Menu</h1>
        <Link to="/">← Back</Link>
        <p>No menu data available. Please go back and select a diet.</p>

      </div>
    );
  }

  return (
    <div className="daily-menu-page">
      <h1>Daily Menu</h1>
      <Link to="/">← Back</Link>
      
      {diet && (
        <CalorieSelector 
          diet={diet} 
          onMenuUpdate={handleMenuUpdate} 
        />
      )}
      
      <DailyMenu menu={menu} />
    </div>
  );
} 