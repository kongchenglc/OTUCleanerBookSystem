// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import SchedulePage from "./pages/SchedulePage";
import ReviewPage from "./pages/ReviewPage";
import MyJobPage from "./pages/MyJobPage";
import AccountSettingPage from "./pages/AccountSettingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/my-job" element={<MyJobPage />} />
        <Route path="/account-setting" element={<AccountSettingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
