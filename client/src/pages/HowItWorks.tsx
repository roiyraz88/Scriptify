import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import { Bolt, Edit, Download } from "@mui/icons-material";

function HowItWorks() {
  const cardStyle = {
    p: 4,
    textAlign: "center",
    borderRadius: 4,
    backgroundColor: "#1e1e1e",
    boxShadow: "0 0 10px rgba(156, 39, 176, 0.3)",
    minHeight: 220,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "white",
        py: 10,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          fontWeight={700}
          sx={{ color: "#fff" }}
        >
          How It Works
        </Typography>

        <Typography variant="h6" align="center" color="gray" mb={6}>
          Scriptify turns your ideas into working job scripts – effortlessly.
        </Typography>

        <Grid container spacing={4}>
          <Grid>
            <Paper sx={cardStyle}>
              <Bolt sx={{ fontSize: 50, color: "#9c27b0" }} />
              <Typography variant="h5" mt={2} gutterBottom>
                Step 1: Choose
              </Typography>
              <Typography color="gray">
                Select an action like tracking job posts or sending emails.
              </Typography>
            </Paper>
          </Grid>

          <Grid>
            <Paper sx={cardStyle}>
              <Edit sx={{ fontSize: 50, color: "#f50057" }} />
              <Typography variant="h5" mt={2} gutterBottom>
                Step 2: Customize
              </Typography>
              <Typography color="gray">
                Fill in a smart chat form with your preferences – no coding
                needed.
              </Typography>
            </Paper>
          </Grid>

          <Grid paddingLeft={17}>
            <Paper sx={cardStyle}>
              <Download sx={{ fontSize: 50, color: "#03a9f4" }} />
              <Typography variant="h5" mt={2} gutterBottom>
                Step 3: Automate
              </Typography>
              <Typography color="gray">
                Your script runs automatically on our servers and sends you
                alerts – no downloads needed.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HowItWorks;
