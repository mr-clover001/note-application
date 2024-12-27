import React, { useState } from "react";
import { updateProfile, UserProfile } from "../api/userapi";
import {
  styled,
  alpha,
  ThemeProvider,
  createTheme,
  Theme,
  useTheme,
} from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  outlinedInputClasses,
  Stack,
  TextField,
} from "@mui/material";

import Styles from "./Logout.module.css";
import CloseModalIcon from "./../Assest/Group 48095853.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": "#6F7E8C",
            fontSize: "12px",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
            fontSize: "14px",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&::before, &::after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
              fontSize: "14px",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
              fontSize: "14px",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });
const fieldCss = {
  style: {
    fontSize: "14px",
    color: "rgba(128, 128, 128, 0.744)",
    fontFamily: `"Outfit",sans-serif`,
  },
};
const fieldInputCss = {
  style: {
    fontSize: "14px",
    color: "#080F1A",
    fontFamily: `"Outfit",sans-serif`,
  },
};
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    marginTop: theme.spacing(0),
    marginLeft: "20px",
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(4),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface LogoutProps {
  handleLogout: () => void;
}
const Logout: React.FC<LogoutProps> = ({ handleLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const outerTheme = useTheme();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    password: "",
  });
  const [token] = useState<string>(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedProfile = await updateProfile(token, profileData);
      console.log("Profile updated successfully:", updatedProfile);

      // Update localStorage with new profile data
      localStorage.setItem("userName", updatedProfile.name);
      localStorage.setItem("userEmail", updatedProfile.email);

      setSuccess(true);
      setIsEditProfileModalOpen(false); // Close modal on success
    } catch (err: any) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  return (
    <>
      <div>
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
          // endIcon={<KeyboardArrowDownIcon />}
        >
          <Avatar
            sx={{ fontSize: "1rem", color: "#4F378A", bgcolor: "#EADDFF" }}
          >
            {localStorage.getItem("userName")?.charAt(0).toUpperCase()}
          </Avatar>
        </Button>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            sx={{
              margonRight: "-20px",
              fontFamily: "Outfit,sanserif",
              fontSize: "14px",
              padding: "10px 10px",
            }}
            onClick={() => {
              setIsEditProfileModalOpen(true);
              handleClose();
            }}
          >
            Edit Profile
          </MenuItem>
          <MenuItem
            sx={{
              margonRight: "-20px",
              fontFamily: "Outfit,sanserif",
              fontSize: "14px",
              padding: "10px 10px",
            }}
            onClick={handleLogout}
            disableRipple
          >
            Logout
          </MenuItem>
        </StyledMenu>
      </div>
      <Modal
        open={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className={Styles.add_modal_form}>
          <Stack className={Styles.add_modal_head}>
            <Stack className={Styles.add_modal_head_title}>Edit Profile</Stack>
            <Stack
              className={Styles.modal_close}
              onClick={() => setIsEditProfileModalOpen(false)}
            >
              <img src={CloseModalIcon} alt="Close" />
            </Stack>
          </Stack>
          <Stack alignItems="center" mb={2}>
            <Avatar
              sx={{
                fontSize: "26px",
                bgcolor: "#EADDFF",
                color: "#4F378A",
                width: "64px",
                height: "64px",
                textTransform: "capitalize",
              }}
            >
              {profileData.name.charAt(0).toUpperCase()}
            </Avatar>
          </Stack>
          <Stack gap={2} p={2}>
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextField
                label="Name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ style: { fontSize: "14px" } }}
              />
              <TextField
                label="Email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ style: { fontSize: "14px" } }}
              />
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={profileData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </ThemeProvider>
          </Stack>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "green", textAlign: "center" }}>
              Profile updated successfully!
            </p>
          )}
          <Stack direction="row" justifyContent="center" gap={2} mt={2}>
            <Button onClick={() => setIsEditProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default Logout;
