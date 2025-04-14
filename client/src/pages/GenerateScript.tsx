import { useState } from "react";
import ChatWizard from "../components/ChatWizard";
import API from "../api/axios";
import {
  Typography,
  Container,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

function GenerateScriptPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);

  const token = localStorage.getItem("accessToken");

  const handleJobAlertSubmit = async (answers: Record<string, string>) => {
    if (!token) {
      setError("❌ You must be logged in to generate a script.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const payload = {
        category: "job_alerts",
        emailRecipient: answers.email,
        query: answers.query,
        resultLimit: answers.resultLimit,
        frequencyType: answers.frequencyType,
        executionTime: answers.dailyTime || answers.weeklyTime,
        weeklyDay: answers.weeklyDay,
        customization: answers.customization || "",
      };

      await API.post("/scripts/generate", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
    } catch (err) {
      setError("❌ Failed to generate job alert script.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Your Custom Script
      </Typography>

      <Dialog open={showIntroModal} onClose={() => setShowIntroModal(false)}>
        <DialogTitle>👋 Welcome to Scriptify</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This short chat will help you generate a custom job alert script.
            You'll answer a few simple questions about your preferences — like
            the keywords you're searching for, how often you want the script to
            run, and where you'd like to get alerts.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowIntroModal(false)}
            autoFocus
            variant="contained"
          >
            Let's Get Started
          </Button>
        </DialogActions>
      </Dialog>

      {loading && <CircularProgress sx={{ mt: 4 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success ? (
        <Box mt={4}>
          <Alert severity="success">
            ✅ Script created successfully! You can view it on your{" "}
            <strong>profile</strong>.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            href="/profile"
          >
            Go to Profile
          </Button>
        </Box>
      ) : (
        <ChatWizard onComplete={handleJobAlertSubmit} />
      )}
    </Container>
  );
}

export default GenerateScriptPage;
