// Import necessary modules from React and react-router-dom
import React, { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";

// Define the main App component
const App = () => {
  // Declare a state variable 'sidebar' with its setter 'setSidebar', initialized to true
  const [sidebar, setSidebar] = useState(true);
  
  return (
    <div>
      {/* Render the Navbar component and pass the 'setSidebar' function as a prop */}
      <Navbar setSidebar={setSidebar} />
      {/* Define the routes for the application */}
      <Routes>
        {/* Route for the Home component with 'sidebar' state passed as a prop */}
        <Route path="/" element={<Home sidebar={sidebar} />} />
        {/* Route for the Video component with dynamic parameters 'categoryId' and 'videoId' */}
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
    </div>
  );
};

export default App;
