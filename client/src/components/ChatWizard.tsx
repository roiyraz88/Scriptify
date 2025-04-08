import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Fade,
  Avatar,
  MenuItem,
} from "@mui/material";

type Step =
  | { id: "email"; question: string }
  | { id: "query"; question: string }
  | { id: "resultLimit"; question: string }
  | { id: "frequencyType"; question: string; options: string[] }
  | { id: "dailyTime"; question: string; options: string[] }
  | { id: "weeklyDay"; question: string; options: string[] }
  | { id: "weeklyTime"; question: string; options: string[] }
  | { id: "done" };

const initialSteps: Step[] = [
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
];

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
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [hasChosenOption, setHasChosenOption] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (currentStep.id === "done" && onComplete) {
      onComplete(answers);
    }
  }, [currentStep.id]);

  const handleNext = (answer: string) => {
    setErrorMessage(""); // ננקה שגיאה ישנה

    if (currentStep.id === "email" && !isValidEmail(answer)) {
      setErrorMessage("❌ Please enter a valid email address.");
      return;
    }

    if (currentStep.id === "resultLimit" && !isValidLimit(answer)) {
      setErrorMessage("❌ Please enter a number between 1 and 20.");
      return;
    }

    const stepId = currentStep.id;
    const newAnswers = { ...answers, [stepId]: answer };
    let newSteps = [...steps];

    const hourOptions = Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

    if (stepId === "frequencyType") {
      if (answer === "Every day") {
        newSteps = [
          ...steps.slice(0, currentStepIndex + 1),
          {
            id: "dailyTime",
            question: "At what hour should the script run every day?",
            options: hourOptions,
          },
          { id: "done" },
        ];
      } else if (answer === "Every week") {
        newSteps = [
          ...steps.slice(0, currentStepIndex + 1),
          {
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
          },
          {
            id: "weeklyTime",
            question: "At what hour on that day should the script run?",
            options: hourOptions,
          },
          { id: "done" },
        ];
      }
    }

    setAnswers(newAnswers);
    setSteps(newSteps);
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
                  Scriptify
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

              {hasChosenOption && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleNext(answers[currentStep.id])}
                >
                  {currentStepIndex === steps.length - 2
                    ? "Generate Script"
                    : "Next"}
                </Button>
              )}
            </>
          ) : (
            <TextField
              fullWidth
              placeholder="Type your answer..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  handleNext(inputValue.trim());
                }
              }}
            />
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

      {currentStep.id === "done" && (
        <Box mt={4}>
          <Typography variant="h6" align="center">
            🎉 Done! Your script is being generated...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ChatWizard;
