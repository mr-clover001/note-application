import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  createTheme,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  ThemeProvider,
  Button,
} from "@mui/material";
import LoginWallpaper from "./../Assest/LoginWallpaper.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./login.module.css"; // Import login styles
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "red",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0566FF",
          },
        },
      },
    },
  },
});

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState({ secret: "", show: false });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/register",
        {
          name,
          email,
          password: password.secret,
        }
      );

      console.log(response.data);
      toast.success("Registration successful! Please log in.");
    } catch (err) {
      setError("Error during registration");
      toast.error("Error during registration");
    }
  };

  const handleClickShowPassword = () => {
    setPassword((prevPassword) => ({
      ...prevPassword,
      show: !prevPassword.show,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword((prevPassword) => ({
      ...prevPassword,
      secret: e.target.value,
    }));
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      className={styles.login_container}
      sx={{
        background: `url(${LoginWallpaper}) lightgray 50% / cover no-repeat`,
      }}
    >
      <Box className={styles.login_head}>
        <Stack display={"flex"} flexDirection={"row"} gap={"16px"}>
          <Stack className={styles.subLogo}>Note App</Stack>
        </Stack>

        <Stack className={styles.mail}>
          <Stack className={styles.mailIcon}></Stack>
          <Stack className={styles.mailId}>ak6260168744@gmail.com</Stack>
        </Stack>
      </Box>

      <Box className={styles.login_box}>
        <Stack display={"flex"} flexDirection={"column"} gap={"8px"}>
          <Stack className={styles.login_box_title}>Welcome Back</Stack>
          <Stack className={styles.login_box_subtitle}>
            Register your account
          </Stack>
        </Stack>

        <Stack
          display={"flex"}
          width={"100%"}
          flexDirection={"column"}
          gap={"9px"}
          marginTop={"30px"}
        >
          <ThemeProvider theme={theme}>
            <Stack width={"100%"} height={"48px"}>
              <TextField
                className="inputField-placeholder"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
                fullWidth
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#0566FF",
                    fontFamily: `"Outfit",sans-serif`,
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px",
                    color: "var(--Text-Black, #080F1A)",
                    fontFamily: `"Outfit",sans-serif`,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0566FF",
                    },
                }}
              />
            </Stack>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Stack width={"100%"} height={"48px"} marginTop={"15px"}>
              <TextField
                className="inputField-placeholder"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                fullWidth
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#0566FF",
                    fontFamily: `"Outfit",sans-serif`,
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px",
                    color: "var(--Text-Black, #080F1A)",
                    fontFamily: `"Outfit",sans-serif`,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0566FF",
                    },
                }}
              />
            </Stack>
          </ThemeProvider>

          <ThemeProvider theme={theme}>
            <Stack width={"100%"} height={"48px"}>
              <FormControl color="success" margin="normal" variant="outlined">
                <InputLabel
                  required
                  htmlFor="outlined-adornment-password"
                  sx={{
                    fontSize: "13px",
                    color: "#0566FF !important",
                    fontFamily: `"Outfit",sans-serif`,
                  }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-password"
                  type={password.show ? "text" : "password"}
                  value={password.secret}
                  onChange={handlePasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {password.show ? (
                          <VisibilityOff sx={{ color: "#0566FF" }} />
                        ) : (
                          <Visibility sx={{ color: "#0566FF" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  sx={{
                    fontSize: "12px",
                    color: "var(--Text-Black, #080F1A)",
                    fontFamily: `"Outfit",sans-serif`,
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#0566FF",
                      },
                  }}
                />
              </FormControl>
            </Stack>
          </ThemeProvider>
        </Stack>

        <Stack width={"100%"} marginTop={"34px"}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#0566FF",
              padding: "12px",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px",
            }}
            onClick={handleSubmit}
          >
            Register
          </Button>
        </Stack>

        <Stack className={styles.admincontact}>
          login your account
          <span
            style={{ color: "#0566FF", cursor: "pointer" }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </Stack>
      </Box>

      <Box className={styles.login_footer}>
        Copyright © 2024 Anoop Kumar | All rights reserved
      </Box>
    </Box>
  );
};

export default Register;
