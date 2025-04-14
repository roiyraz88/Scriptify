import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Fade,
  Avatar,
  MenuItem,
  CircularProgress,
} from "@mui/material";

type StepType =
  | { id: "email"; question: string }
  | { id: "query"; question: string }
  | { id: "resultLimit"; question: string }
  | { id: "frequencyType"; question: string; options: string[] }
  | { id: "dailyTime"; question: string; options: string[] }
  | { id: "weeklyDay"; question: string; options: string[] }
  | { id: "weeklyTime"; question: string; options: string[] }
  | { id: "customization"; question: string }
  | { id: "done" };

const initialSteps: StepType[] = [
  {
    id: "email",
    question: "To which email address should we send job alerts?",
  },
  {
    id: "query",
    question: "What job keywords do you want to search on Google?",
  },
  {
    id: "resultLimit",
    question: "How many job suggestions do you want to receive? (max 20)",
  },
  {
    id: "frequencyType",
    question: "How often would you like this script to run?",
    options: ["Every day", "Every week"],
  },
  {
    id: "customization",
    question: "Any custom filters? (e.g., Only full-time jobs in Tel Aviv)",
  },
];

const stepHints: Record<string, string> = {
  email:
    "📧 Please enter a valid email address where you'd like to receive job alerts.",
  query: "💼 Use keywords like 'junior frontend developer' or 'QA Tel Aviv'.",
  resultLimit: "🔢 Choose how many job results you want (1 to 20).",
  frequencyType: "⏱️ Decide how often the script should run: daily or weekly.",
  dailyTime: "🕒 Choose the hour the script should run every day.",
  weeklyDay: "📅 Select the day of the week to run the job alert.",
  weeklyTime: "🕒 What time on that day should the alert run?",
  customization:
    "🛠️ Add filters like location, job type or seniority (e.g. 'only remote jobs in Israel').",
};

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidLimit = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 1 && num <= 20;
};

function ChatWizard({
  onComplete,
}: {
  onComplete?: (answers: Record<string, string>) => void;
}) {
  const [steps, setSteps] = useState<StepType[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [hasChosenOption, setHasChosenOption] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const handleNext = (answer: string) => {
    setErrorMessage("");

    if (currentStep.id === "email" && !isValidEmail(answer)) {
      setErrorMessage("❌ Please enter a valid email address.");
      return;
    }

    if (currentStep.id === "resultLimit" && !isValidLimit(answer)) {
      setErrorMessage("❌ Please enter a number between 1 and 20.");
      return;
    }

    const newAnswers = { ...answers, [currentStep.id]: answer };
    const newSteps = steps.slice(0, currentStepIndex + 1);

    const hourOptions = Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

    // בשלב frequencyType בתוך handleNext (שורה 76 בערך):
    if (currentStep.id === "frequencyType") {
      const customizationStep = steps.find((s) => s.id === "customization");

      if (answer === "Every day") {
        newSteps.push({
          id: "dailyTime",
          question: "At what hour should the script run every day?",
          options: hourOptions,
        });
        if (customizationStep) newSteps.push(customizationStep);
        newSteps.push({ id: "done" });
      } else if (answer === "Every week") {
        newSteps.push({
          id: "weeklyDay",
          question: "On which day of the week should it run?",
          options: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        });
        newSteps.push({
          id: "weeklyTime",
          question: "At what hour on that day should the script run?",
          options: hourOptions,
        });
        if (customizationStep) newSteps.push(customizationStep);
        newSteps.push({ id: "done" });
      }

      setSteps(newSteps);
    }

    setAnswers(newAnswers);
    setCurrentStepIndex((prev) => prev + 1);
    setInputValue("");
    setHasChosenOption(false);
  };

  const handleBack = () => {
    const prevStep = steps[currentStepIndex - 1];
    const updatedAnswers = { ...answers };
    delete updatedAnswers[prevStep.id];
    setAnswers(updatedAnswers);
    setCurrentStepIndex((prev) => prev - 1);
    setHasChosenOption(false);
  };

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 600, mx: "auto" }}>
      {steps.slice(0, currentStepIndex + 1).map((step, i) => (
        <Fade in timeout={400} key={i}>
          <Box mb={2}>
            {step.id !== "done" && (
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Avatar sx={{ bgcolor: "primary.main", fontSize: 10 }}>
                  S
                </Avatar>
                <Box
                  bgcolor="#333"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius={2}
                  maxWidth="80%"
                >
                  <Typography variant="body1">{step.question}</Typography>
                </Box>
              </Box>
            )}
            {answers[step.id] && (
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Box
                  bgcolor="#1976d2"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius={2}
                  maxWidth="80%"
                >
                  <Typography variant="body1">{answers[step.id]}</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      ))}

      {currentStep.id !== "done" && (
        <Box mt={4} display="flex" flexDirection="column" gap={2}>
          {"options" in currentStep ? (
            <>
              {currentStep.options.length > 10 ? (
                <TextField
                  select
                  fullWidth
                  label="Choose an option"
                  value={answers[currentStep.id] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAnswers((prev) => ({
                      ...prev,
                      [currentStep.id]: value,
                    }));
                    setHasChosenOption(true);
                  }}
                >
                  {currentStep.options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                currentStep.options.map((opt) => (
                  <Button
                    key={opt}
                    variant={
                      answers[currentStep.id] === opt ? "contained" : "outlined"
                    }
                    onClick={() => {
                      setAnswers((prev) => ({
                        ...prev,
                        [currentStep.id]: opt,
                      }));
                      setHasChosenOption(true);
                    }}
                  >
                    {opt}
                  </Button>
                ))
              )}
              {stepHints[currentStep.id] && (
                <Typography variant="caption" color="textSecondary">
                  {stepHints[currentStep.id]}
                </Typography>
              )}
              {hasChosenOption && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleNext(answers[currentStep.id])}
                >
                  Next
                </Button>
              )}
            </>
          ) : (
            <>
              <TextField
                fullWidth
                placeholder={
                  currentStep.id === "customization"
                    ? "e.g. Only remote jobs in Tel Aviv"
                    : "Type your answer..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    handleNext(inputValue.trim());
                  }
                }}
              />
              {stepHints[currentStep.id] && (
                <Typography variant="caption" color="textSecondary">
                  {stepHints[currentStep.id]}
                </Typography>
              )}
            </>
          )}

          {errorMessage && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}

          {currentStepIndex > 0 && (
            <Button variant="text" onClick={handleBack}>
              ← Back
            </Button>
          )}
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} thickness={5} />
        </Box>
      )}

      {currentStep.id === "done" && !loading && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6" mb={2}>
            🎉 All set! Ready to generate your script?
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setLoading(true);
              onComplete?.(answers);
            }}
          >
            Generate Script
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ChatWizard;
