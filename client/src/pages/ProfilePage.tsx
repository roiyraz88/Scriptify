import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import API from "../api/axios";

interface Script {
  _id: string;
  query: string;
  resultLimit: number;
  frequencyType: string;
  dailyTime?: string;
  weeklyDay?: string;
  weeklyTime?: string;
  createdAt: string;
}

function ProfilePage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Script>>({});

  const fetchScripts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.get("/profile/my-scripts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScripts(res.data.scripts);
    } catch (err) {
      console.error("Failed to fetch scripts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scriptId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await API.delete(`/profile/my-scripts/${scriptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScripts((prev) => prev.filter((s) => s._id !== scriptId));
    } catch (err) {
      console.error("Failed to delete script:", err);
    }
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Enhance query to limit results to job postings only
      const updatedQuery = `site:linkedin.com/jobs OR site:glassdoor.com OR site:indeed.com "${editData.query}"`;

      const res = await API.put(
        `/profile/my-scripts/${selectedScriptId}`,
        { ...editData, query: updatedQuery },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setScripts((prev) =>
        prev.map((s) => (s._id === selectedScriptId ? res.data.script : s))
      );
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update script:", err);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const hourOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#fff", display: "flex", alignItems: "center", gap: 1 }}
      >
        🎬 My Scripts
      </Typography>

      {loading ? (
        <CircularProgress sx={{ color: "#9c27b0" }} />
      ) : scripts.length === 0 ? (
        <Typography sx={{ color: "#ccc" }}>No scripts found.</Typography>
      ) : (
        scripts.map((script) => (
          <Paper
            key={script._id}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "#1e1e1e",
              boxShadow: "0 0 10px rgba(156, 39, 176, 0.2)",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ color: "#fff" }}><strong>🔍 Query:</strong> {script.query}</Typography>
                <Typography sx={{ color: "#fff" }}><strong>📬 Results:</strong> {script.resultLimit}</Typography>
                <Typography sx={{ color: "#fff" }}><strong>⏰ Frequency:</strong> {script.frequencyType}</Typography>
                {script.dailyTime && <Typography sx={{ color: "#fff" }}><strong>🕐 Time:</strong> {script.dailyTime}</Typography>}
                {script.weeklyDay && <Typography sx={{ color: "#fff" }}><strong>📅 Day:</strong> {script.weeklyDay}</Typography>}
                {script.weeklyTime && <Typography sx={{ color: "#fff" }}><strong>🕐 Time:</strong> {script.weeklyTime}</Typography>}
                <Typography variant="caption" sx={{ color: "#aaa" }}>
                  Created: {new Date(script.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <IconButton
                  color="info"
                  onClick={() => {
                    setSelectedScriptId(script._id);
                    setEditData(script);
                    setEditOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setSelectedScriptId(script._id);
                    setConfirmOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>❗ Are you sure you want to delete this script?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={() => {
              if (selectedScriptId) {
                handleDelete(selectedScriptId);
                setConfirmOpen(false);
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Script</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Query"
            value={editData.query || ""}
            onChange={(e) => setEditData({ ...editData, query: e.target.value })}
          />
          <TextField
            label="Result Limit"
            type="number"
            inputProps={{ min: 1, max: 20 }}
            value={editData.resultLimit || 10}
            onChange={(e) => setEditData({ ...editData, resultLimit: +e.target.value })}
          />
          {editData.frequencyType === "Every day" && (
            <TextField
              select
              label="Daily Time"
              value={editData.dailyTime || ""}
              onChange={(e) => setEditData({ ...editData, dailyTime: e.target.value })}
            >
              {hourOptions.map((hour) => (
                <MenuItem key={hour} value={hour}>{hour}</MenuItem>
              ))}
            </TextField>
          )}
          {editData.frequencyType === "Every week" && (
            <>
              <TextField
                select
                label="Weekly Day"
                value={editData.weeklyDay || ""}
                onChange={(e) => setEditData({ ...editData, weeklyDay: e.target.value })}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Weekly Time"
                value={editData.weeklyTime || ""}
                onChange={(e) => setEditData({ ...editData, weeklyTime: e.target.value })}
              >
                {hourOptions.map((hour) => (
                  <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                ))}
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProfilePage;
