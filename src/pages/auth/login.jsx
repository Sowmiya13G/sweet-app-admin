import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleAuthMode = () => {
    setIsRegister((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Registration successful");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful");
      }
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
      await sendPasswordResetEmail(auth, email);
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
      color: "#fff", // Default label color
      "&.Mui-focused": {
        color: "#fff", // Label color when focused
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
        // bgcolor: "#333",
        padding: { xs: 2, md: 0 },
      }}
    >
      <Typography component="h1" variant="h3" sx={{ color: "#fff" }}>
        {isRegister ? "Register" : "Log in"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 1, width: "100%", maxWidth: "400px" }}
      >
        {isRegister && (
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={textFieldStyles}
          />
        )}
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
          {isRegister ? "Register" : "Log in"}
        </Button>
        <Grid container>
          <Grid item xs>
            {!isRegister && (
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
            )}
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Auth;
