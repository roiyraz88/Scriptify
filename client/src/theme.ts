import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // רקע כללי
      paper: "#1E1E1E",   // משטחים כמו Dialog, Card וכו'
    },
    primary: {
      main: "#BB86FC",    // סגול
    },
    secondary: {
      main: "#03DAC6",    // טורקיז
    },
    error: {
      main: "#CF6679",    // אדום בהיר
    },
    text: {
      primary: "rgba(255, 255, 255, 0.87)",
      secondary: "rgba(255, 255, 255, 0.6)",
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
