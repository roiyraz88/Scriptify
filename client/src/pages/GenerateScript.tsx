import { useState, useEffect } from "react";
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
  const [hasExistingScript, setHasExistingScript] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    API.get("/profile/my-scripts", {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.scripts.length > 0) {
          setHasExistingScript(true);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to check existing scripts", err);
      });
  }, [token]);

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
        executionTime: answers.executionTime,
        weeklyDay: answers.weeklyDay,
        customization: answers.customization || "",
      };

      const res = await API.post("/scripts/generate", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        setError("📭 No jobs found. Please try different keywords.");
        return;
      }

      if (res.data.script) {
        setSuccess(true);
      } else {
        setError("⚠️ Something went wrong. Script was not created.");
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 409
      ) {
        setError(
          "⚠️ You already have a script. You can edit it from your profile."
        );
      } else {
        setError("🚫 Something went wrong. Please try again later.");
      }
      console.error(error);
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
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
          <Button
            variant="outlined"
            onClick={() => {
              setError("");
              setSuccess(false);
            }}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      )}

      {hasExistingScript ? (
        <Box mt={4}>
          <Alert severity="info">
            📌 You already have a script. You can manage it in your{" "}
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
      ) : success ? (
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
        !loading && !error && <ChatWizard onComplete={handleJobAlertSubmit} />
      )}
    </Container>
  );
}

export default GenerateScriptPage;
