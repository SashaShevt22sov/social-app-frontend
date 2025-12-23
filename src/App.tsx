import "./App.css";

import PrivatePage from "./pages/Private/PrivatePage";
import OtpPage from "./pages/otpPage/OtpPage";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Landing from "./pages/Landing/Landing";
import HomePage from "./pages/HomePage/HomePage";

import { Route, Routes } from "react-router-dom";

import { PrivateRouter } from "./Router/PrivateRouter";
import ResetPasswordPage from "./pages/resetPassword/ResetPasswordPage";
import { useAppDispatch } from "./hooks/hooksStore";
import { useEffect } from "react";
import { authMe } from "./store/authSlice";
import FindFriendsPage from "./pages/findFriendsPage/FindFriendsPage";
import FindFriends from "./features/findFriends/FindFriends";
import PendingFriends from "./features/pendingFriends/PendingFriends";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authMe());
  }, [dispatch]);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<PrivateRouter />}>
          <Route path="/main" element={<PrivatePage />}>
            <Route index element={<HomePage />} />
            <Route path="find-friends" element={<FindFriendsPage />}>
              <Route index element={<FindFriends />} />
              <Route path="find" element={<FindFriends />} />
              <Route path="pending" element={<PendingFriends />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
