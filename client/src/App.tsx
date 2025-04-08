import { useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import GenerateScript from "./pages/GenerateScript";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar
          onLoginClick={() => setLoginOpen(true)}
          onRegisterClick={() => setRegisterOpen(true)}
        />
        <Box flex={1}>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  onLoginClick={() => setLoginOpen(true)}
                  onRegisterClick={() => setRegisterOpen(true)}
                />
              }
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route
              path="/generate-script"
              element={
                <ProtectedRoute>
                  <GenerateScript />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSwitchToRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />{" "}
        <RegisterModal
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onSwitchToLogin={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />
      </Box>
    </Router>
  );
}

export default App;
