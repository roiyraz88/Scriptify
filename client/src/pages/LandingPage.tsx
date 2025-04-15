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
                Get notified about new job postings automatically.
              </Typography>
            </motion.div>
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="contained" size="large" onClick={onLoginClick}>
                  Get Job Alerts
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

      {/* What Scriptify Does */}
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
              Never miss a job opportunity.
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
              Scriptify scans top job boards like LinkedIn, Glassdoor, and Comeet for new openings that match your keywords – and sends them straight to your inbox.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              All you need to do is tell us what you're looking for.
            </Typography>
          </Container>
        </Box>
      </FadeInSection>

      {/* No Code Needed */}
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
              No experience needed.
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
              You don’t need to know Python or how to code. Scriptify builds your custom job alert script based on your answers in a friendly chat wizard.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                component={RouterLink}
                to="/how-it-works"
              >
                Learn How It Works
              </Button>
            </motion.div>
          </Container>
        </Box>
      </FadeInSection>

      {/* Call to Action */}
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
              Start your job hunt the smart way.
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
              No more refreshing job sites every day. Scriptify will notify you the moment your dream job appears online.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="contained" size="large" color="primary" onClick={onLoginClick}>
                Start Now
              </Button>
            </motion.div>
          </Container>
        </Box>
      </FadeInSection>
    </Box>
  );
}

export default LandingPage;
