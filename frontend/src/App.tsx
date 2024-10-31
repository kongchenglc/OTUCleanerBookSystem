// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import ListPage from './ListPage';
import RegisterPage from './RegisterPage';
import MainPage from './MainPage';
import AccountSettingPage from './pages/AccountSettingPage';
import SchedulePage from './pages/SchedulePage';
import ReviewPage from './pages/ReviewPage';
import MyJobPage from './pages/MyJobPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mainForCleaner" element={<MainPage />} />
        <Route path="/account-setting" element={<AccountSettingPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/my-job" element={<MyJobPage />} />
      </Routes>
    </Router>
  );
}

export default App;
