import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
   // write logic to login
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleForgotPassword = async () => {
    try {
      // logic to reset password
      toast.success("Password reset email sent. Please check your email.");
    } catch (error) {
      toast.error(`Error sending reset email: ${error.message}`);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#fff", 
      "&.Mui-focused": {
        color: "#fff", 
      },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: { xs: 2, md: 0 },
      }}
    >
      <Typography component="h1" variant="h3" sx={{ color: "#fff" }}>
        {"Log in"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 1, width: "100%", maxWidth: "400px" }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={textFieldStyles}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {!showPassword ? (
                    <VisibilityOff sx={{ color: "#fff" }} />
                  ) : (
                    <Visibility sx={{ color: "#fff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            height: "50px",
            mb: 2,
            bgcolor: "#3c3c9e",
            "&:hover": { bgcolor: "#3c3c6e" },
          }}
        >
          Log in
        </Button>
        <Grid container>
          <Grid item xs>
            <Link
              href="#"
              variant="body2"
              onClick={() => handleForgotPassword()}
              sx={{
                color: "#fff",
              }}
            >
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Auth;
