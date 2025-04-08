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
} from "@mui/material";

function GenerateScriptPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleComplete = async (answers: Record<string, string>) => {
    try {
      setLoading(true);
      setError("");
  
      const token = localStorage.getItem("accessToken");
  
      const payload = {
        emailRecipient: answers.email,
        query: answers.query,
        resultLimit: answers.resultLimit,
        frequencyType: answers.frequencyType,
        dailyTime: answers.dailyTime, // אם Every day
        weeklyDay: answers.weeklyDay, // אם Every week
        weeklyTime: answers.weeklyTime, // אם Every week
      };
  
      console.log("📦 Sending payload:", payload);
  
      const res = await API.post("/scripts/run-script", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSuccess(true);
      console.log("✅ Script ran successfully:", res.data);
    } catch (err) {
      setError("❌ Failed to run the script.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Your Job Alert Script:
      </Typography>

      {loading && <CircularProgress sx={{ mt: 4 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && success && (
        <Box mt={4}>
          <Alert severity="success">
            ✅ Script created successfully! You can edit it anytime from your{" "}
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
      )}

      {!loading && !success && <ChatWizard onComplete={handleComplete} />}
    </Container>
  );
}

export default GenerateScriptPage;
