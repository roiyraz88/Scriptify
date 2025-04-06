import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        color: "text.secondary",
        textAlign: "center",
        py: 2,
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Scriptify. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
