import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Logo from "../assets/scriptify_logo.png";
import { useState } from "react";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const drawerItems = (
    <List>
      {isLoggedIn ? (
        <>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/generate-script"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Generate Script" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/profile"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/how-it-works"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="How it Works" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                onLoginClick();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                onRegisterClick();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#2b2b2b" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box
              component={RouterLink}
              to={isLoggedIn ? "/generate-script" : "/"}
              sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            >
              <Box
                component="img"
                src={Logo}
                alt="Scriptify Logo"
                sx={{ height: 76, width: 76 }}
              />
            </Box>

            {!isMobile && isLoggedIn && (
              <>
                <Button component={RouterLink} to="/generate-script" color="inherit">
                  Generate Script
                </Button>
                <Button component={RouterLink} to="/profile" color="inherit">
                  Profile
                </Button>
              </>
            )}

            {!isMobile && !isLoggedIn && (
              <Button component={RouterLink} to="/how-it-works" color="inherit">
                How it Works
              </Button>
            )}
          </Box>

          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
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
                  <Button variant="outlined" color="inherit" onClick={onRegisterClick}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: "#1e1e1e", color: "#fff" } }}
      >
        {drawerItems}
      </Drawer>
    </>
  );
}

export default Navbar;
