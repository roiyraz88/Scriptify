import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import FadeInSection from "../components/FadeInSection";
import { motion } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import pythonVideo from "../assets/python_code_running.mp4";

function LandingPage({
  onLoginClick,
  onRegisterClick,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) navigate("/generate-script");
  }, []);

  return (
    <Box>
      {/* Hero Section with Video Background */}
      <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          src={pythonVideo}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: -1,
          }}
        />
        <Container
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
            px: 3,
          }}
        >
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Scriptify
              </Typography>
              <Typography variant="h5" sx={{ color: "#ddd", mb: 4 }}>
                Easily generate Python scripts without writing code.
              </Typography>
            </motion.div>
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="contained" size="large" onClick={onLoginClick}>
                  Get Started
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onRegisterClick}
                  color="inherit"
                >
                  Register
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* What is a Python script? */}
      <FadeInSection>
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            bgcolor: "#1e1e1e",
            px: 3,
            py: 10,
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
              What is a Python script?
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
              A Python script is a simple, readable program that tells the
              computer to perform a task — like sending emails, collecting data
              from websites, or reminding you of deadlines. It’s like giving
              your computer a to-do list that runs automatically.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              Scriptify helps anyone build these smart scripts without needing
              to learn programming.
            </Typography>
          </Container>
        </Box>
      </FadeInSection>

      {/* No Code? No Problem. */}
      <FadeInSection>
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="background.paper"
          sx={{
            px: 3,
            py: 10,
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
              No Code? No Problem.
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
              With Scriptify, you can build Python scripts for real-world
              automation without writing a single line of code. Just choose a
              task, fill in your details, and download your ready-to-use script.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                component={RouterLink}
                to="/how-it-works"
              >
                See how it works
              </Button>
            </motion.div>
          </Container>
        </Box>
      </FadeInSection>

      {/* Generate Section */}
      <FadeInSection>
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            bgcolor: "#1e1e1e",
            px: 3,
            py: 10,
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
              Generate Python scripts instantly.
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
              Whether it's automating emails, job alerts, or daily tasks –
              Scriptify builds the Python code for you in seconds. Just fill a
              form and click “Generate”.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="contained" size="large" color="primary" onClick={onLoginClick}>
                Try it now
              </Button>
            </motion.div>
          </Container>
        </Box>
      </FadeInSection>
    </Box>
  );
}

export default LandingPage;