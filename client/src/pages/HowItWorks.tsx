import { Box, Container, Typography, Grid } from "@mui/material";
import { Bolt, Edit, Download } from "@mui/icons-material";

function HowItWorks() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        py: 10,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom fontWeight={600}>
          How It Works
        </Typography>

        <Typography variant="h6" align="center" color="text.secondary" mb={6}>
          In just 3 simple steps, Scriptify helps you turn ideas into working Python scripts.
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} md={4} textAlign="center">
            <Bolt sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h5" mt={2} gutterBottom>
              Step 1: Choose
            </Typography>
            <Typography color="text.secondary">
              Pick an action like sending an email or tracking job posts.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} textAlign="center">
            <Edit sx={{ fontSize: 60, color: "secondary.main" }} />
            <Typography variant="h5" mt={2} gutterBottom>
              Step 2: Customize
            </Typography>
            <Typography color="text.secondary">
              Fill in a simple form with your preferences – no coding needed.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} textAlign="center">
            <Download sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h5" mt={2} gutterBottom>
              Step 3: Download
            </Typography>
            <Typography color="text.secondary">
              Instantly get a downloadable Python script, ready to run.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HowItWorks;
