import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Logo from "../assets/scriptify_logo.png";

function Navbar({
  onLoginClick,
  onRegisterClick,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#2b2b2b" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box
            component={RouterLink}
            to={isLoggedIn ? "/generate-script" : "/"}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Scriptify Logo"
              sx={{ height: 76, width: 76 }}
            />
          </Box>

          {isLoggedIn ? (
            <>
              <Button
                component={RouterLink}
                to="/generate-script"
                color="inherit"
              >
                Generate Script
              </Button>
              <Button component={RouterLink} to="/profile" color="inherit">
                Profile
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/how-it-works" color="inherit">
              How it Works
            </Button>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {isLoggedIn ? (
            <>
              <Typography variant="body1">Hi, {user?.name}</Typography>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={onLoginClick}>
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={onRegisterClick}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
