import React, { ChangeEvent, useState } from "react";
import { Note } from "../type/interface";
import {
  Box,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  outlinedInputClasses,
  Select,
  SelectChangeEvent,
  Stack,
  TextareaAutosize,
  TextField,
  Theme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import Styles from "./NoteForm.module.css";
import CloseModalIcon from "./../Assest/Group 48095853.svg";
import { toast } from "react-toastify";

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

interface NoteFormProps {
  onSubmit: (note: Note) => void;
  darkmode: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, darkmode }) => {
  const outerTheme = useTheme();
  const [note, setNote] = useState<Note>({
    title: "",
    content: "",
    category: "",
  });

  // Handler for Select component
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  // Handler for TextField and TextArea components
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(note);
    setNote({ title: "", content: "", category: "" });
    handleCloseAddModal();
    toast.success("Note Created Successfully");
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Stack
        sx={{ width: { xs: "20%", md: "5%" } }}
        className={
          darkmode
            ? Styles.dashboard_head_darkmode_add
            : Styles.dashboard_head_add
        }
        onClick={() => setIsAddModalOpen(true)}
      >
        + Add{" "}
      </Stack>

      <Modal open={isAddModalOpen} onClose={() => {}}>
        <Box className={Styles.add_modal}>
          <Stack className={Styles.add_modal_head} marginBottom={"16px"}>
            <Stack className={Styles.add_modal_head_title}>Add Note</Stack>
            <Stack className={Styles.modal_close} onClick={handleCloseAddModal}>
              <img src={CloseModalIcon} alt="Close" />
            </Stack>
          </Stack>
          <form onSubmit={handleSubmit} className={Styles.form_layout}>
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextField
                label="Title"
                name="title"
                value={note.title}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={fieldCss}
                InputProps={fieldInputCss}
                FormHelperTextProps={{
                  style: { fontSize: "10px", color: "red" },
                }}
              />
            </ThemeProvider>
            {/* <ThemeProvider theme={customTheme(outerTheme)}> */}
            <FormControl fullWidth>
              <InputLabel
                id="Category"
                sx={{
                  fontSize: "14px",
                  color: "rgba(128, 128, 128, 0.744)",
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                Category
              </InputLabel>
              <Select
                labelId="Category"
                id="Category"
                value={note.category}
                name="category"
                onChange={handleSelectChange}
                label="Category"
                fullWidth
                sx={{
                  fontSize: "14px",
                  color: "#080F1A",
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                <MenuItem
                  value="Personal"
                  sx={{
                    fontSize: "14px",
                    color: "#080F1A",
                    fontFamily: '"Outfit", sans-serif',
                  }}
                >
                  Personal
                </MenuItem>
                <MenuItem
                  value="Office"
                  sx={{
                    fontSize: "14px",
                    color: "#080F1A",
                    fontFamily: '"Outfit", sans-serif',
                  }}
                >
                  Office
                </MenuItem>
              </Select>
            </FormControl>
            {/* </ThemeProvider> */}
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextareaAutosize
                className={Styles.textarea_autosize}
                name="content"
                aria-label="minimum height"
                placeholder="Content"
                value={note.content}
                required
                onChange={handleInputChange}
                minRows={5}
                maxRows={5}
              />
            </ThemeProvider>
            <Stack className={Styles.add_modal_btn} marginTop={"16px"}>
              <Box
                className={Styles.buttons_cancel}
                onClick={handleCloseAddModal}
              >
                Cancel
              </Box>
              <button className={Styles.buttons_save} type="submit">
                Save
              </button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default NoteForm;
