import { Box, Button, Container, Typography } from "@mui/material";
import FadeInSection from "../components/FadeInSection";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    if (token) {
      navigate("/generate-script");
    }
  }, []);
  return (
    <Box>
      {/* Hero Section */}
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "linear-gradient(to bottom, #121212, #1e1e1e)",
          color: "text.primary",
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            gap={6}
          >
            {/* טקסט */}
            <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
              <Typography
                variant="h2"
                sx={{ fontWeight: 700, letterSpacing: 1, mb: 2 }}
              >
                Scriptify
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  maxWidth: "500px",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Easily generate Python scripts without writing a single line of
                code.
              </Typography>

              <Box
                display="flex"
                justifyContent={{ xs: "center", md: "flex-start" }}
                gap={2}
              >
                <Button variant="contained" size="large" onClick={onLoginClick}>
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onRegisterClick}
                >
                  Register
                </Button>
              </Box>
            </Box>

            {/* תמונה מונפשת */}
            <motion.img
              src="/python_script.jpg"
              alt="Python script preview"
              style={{
                width: "100%",
                maxWidth: "750px",
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </Box>
        </Container>
      </Box>

      {/* Scroll Reveal Sections */}
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
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
              }}
            >
              No Code? No Problem.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 4,
              }}
            >
              With Scriptify, you can build Python scripts for real-world
              automation without writing a single line of code. Just choose a
              task, fill in your details, and download your ready-to-use script.
            </Typography>

            <Button
              variant="outlined"
              size="large"
              color="secondary"
              component={RouterLink}
              to="/how-it-works"
            >
              See how it works
            </Button>
          </Container>
        </Box>
      </FadeInSection>

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
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
              }}
            >
              Generate Python scripts instantly.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 4,
              }}
            >
              Whether it's automating emails, job alerts, or daily tasks –
              Scriptify builds the Python code for you in seconds. Just fill a
              form and click “Generate”.
            </Typography>

            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={onLoginClick}
            >
              Try it now
            </Button>
          </Container>
        </Box>
      </FadeInSection>
    </Box>
  );
}

export default LandingPage;
