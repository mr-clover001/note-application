import React, { useState, useEffect } from "react";
import NoteForm from "../Components/NoteForm";
import NoteList from "../Components/NoteList";
import { Link } from "react-router-dom";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/noteapi";
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
import SearchIcon from "@mui/icons-material/Search";
import Styles from "./Dashboard.module.css";
import NotifyToggle from "../Assest/NotifyToggle.svg";
import NotNotifyToggle from "../Assest/NotNotifyToggle.svg";
import CloseModalIcon from "./../Assest/Group 48095853.svg";
import { toast } from "react-toastify";
import Logout from "./Logout";
interface LogoutProps {
  handleLogout: () => void;
}
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
const Dashboard: React.FC<LogoutProps> = ({ handleLogout }) => {
  const outerTheme = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note>({
    _id: 0,
    title: "",
    content: "",
    category: "Personal",
  });
  const [personalNotes, setPersonalNotes] = useState<Note[]>([]);
  const [officeNotes, setOfficeNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("token");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedOption, setSelectedOption] = useState(0);

  const loadNotes = async () => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login");
        return;
      }

      const fetchedNotes = (await fetchNotes(token)) as Note[];
      setNotes(fetchedNotes);

      // Filter notes by category
      const personal = fetchedNotes.filter(
        (note) => note.category === "Personal"
      );
      const office = fetchedNotes.filter((note) => note.category === "Office");
      setPersonalNotes(personal);
      setOfficeNotes(office);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotes();
  }, [token]);

  const handleAddNote = async (noteData: {
    title: string;
    content: string;
    category: string;
  }) => {
    if (!token) {
      console.error("No token found, cannot add note");
      return;
    }

    try {
      const newNote = await createNote(noteData, token);
      setNotes([...notes, newNote]);
      loadNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    console.log(id, "id");
    if (!token) {
      console.error("No token found, cannot delete note");
      return;
    }

    try {
      await deleteNote(String(id), token);
      setNotes(notes.filter((note) => note._id !== id));
      loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditNote = async (id: number) => {
    if (!token) {
      console.error("No token found, cannot edit note");
      return;
    }

    try {
      const noteToEdit = notes.find((note) => note._id === id);
      if (noteToEdit) {
        setNoteToEdit(noteToEdit);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!noteToEdit) return;
    if (token) {
      try {
        const updatedNote = await updateNote(
          String(noteToEdit._id),
          noteToEdit,
          token
        );
        setNotes(
          notes.map((note) =>
            note._id === noteToEdit._id ? updatedNote : note
          )
        );
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    if (!noteToEdit) return;
    setNoteToEdit((prevNote) => ({
      ...(prevNote && {
        ...prevNote,
        category: event.target.value,
      }),
    }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!noteToEdit) return;
    const { name, value } = event.target;
    setNoteToEdit((prevNote) => ({
      ...(prevNote && {
        ...prevNote,
        [name]: value,
      }),
    }));
  };
  return (
    <>
      <Box className={Styles.dashboard_container}>
        {/* Desktop */}
        <Box
          className={Styles.dashboard_head}
          bgcolor={isDarkMode ? "#1E3E62" : "#F8FAFC"}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Stack
            width={"15%"}
            className={Styles.userName}
            color={isDarkMode ? "#fff" : "black"}
          >
            Hello! {localStorage.getItem("userName")}
          </Stack>{" "}
          <Stack width={"70%"} position={"relative"}>
            <span className={Styles.search_icon}>
              {" "}
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={Styles.search_input}
              placeholder="Search note by title..."
            />
          </Stack>
          <NoteForm onSubmit={handleAddNote} darkmode={isDarkMode} />
          <Stack width={"10%"} className={Styles.dashboard_head_toggle_mode}>
            {" "}
            <Stack sx={{ cursor: "pointer" }}>
              {" "}
              {isDarkMode ? (
                <img
                  src={NotifyToggle}
                  alt="notify"
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                  }}
                />
              ) : (
                <img
                  src={NotNotifyToggle}
                  alt="not notify"
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                  }}
                />
              )}
            </Stack>{" "}
            <Stack
              className={Styles.dashboard_head_toggle_mode_text}
              color={isDarkMode ? "#fff" : "black"}
            >
              Dark Mode
            </Stack>
          </Stack>
          <Logout handleLogout={handleLogout} />
        </Box>
        {/* Mobile */}
        <Box
          className={Styles.dashboard_head}
          bgcolor={isDarkMode ? "#1E3E62" : "#fff"}
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Stack display={"flex"} flexDirection={"row"} width={"100%"}>
            <Stack
              width={"50%"}
              className={Styles.userName}
              color={isDarkMode ? "#fff" : "black"}
              fontSize={"16px"}
              sx={{ textWrap: "nowrap", alignItems: "left", justifySelf: "" }}
            >
              Hello! {localStorage.getItem("userName")}
            </Stack>{" "}
            <Stack
              width={"30%"}
              className={Styles.dashboard_head_toggle_mode}
              sx={{ textWrap: "nowrap" }}
            >
              {" "}
              <Stack sx={{ cursor: "pointer" }}>
                {" "}
                {isDarkMode ? (
                  <img
                    src={NotifyToggle}
                    alt="notify"
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                    }}
                  />
                ) : (
                  <img
                    src={NotNotifyToggle}
                    alt="not notify"
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                    }}
                  />
                )}
              </Stack>{" "}
              <Stack
                className={Styles.dashboard_head_toggle_mode_text}
                color={isDarkMode ? "#fff" : "black"}
                fontSize={"10px"}
              >
                Dark Mode
              </Stack>
            </Stack>
            <Logout handleLogout={handleLogout} />
          </Stack>
          <Stack display={"flex"} flexDirection={"row"} width={"100%"}>
            <Stack width={"80%"} position={"relative"}>
              <span className={Styles.search_icon}>
                {" "}
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={Styles.search_input}
                placeholder="Search note by title..."
              />
            </Stack>

            <NoteForm onSubmit={handleAddNote} darkmode={isDarkMode} />
          </Stack>
        </Box>

        {/* Emd */}

        {/* Section */}
        <Stack
          className={Styles.dashboard_section}
          bgcolor={isDarkMode ? "#e4e5f1" : "#F2F9FF"}
          height={"92vh"}
        >
          <Stack className={Styles.active_user_layout}>
            <Stack
              className={Styles.active_user_btn}
              onClick={() => {
                setSelectedOption(0);
              }}
              sx={{
                borderBottom:
                  selectedOption === 0 ? "2px solid  #0566ff" : "none",
                color: selectedOption === 0 ? "#080F1A" : "#647491",
              }}
            >
              All ( {notes.length} )
            </Stack>
            <Stack
              className={Styles.active_user_btn}
              onClick={() => {
                setSelectedOption(1);
              }}
              sx={{
                borderBottom:
                  selectedOption === 1 ? "2px solid  #0566ff" : "none",
                color: selectedOption === 1 ? "#080F1A" : "#647491",
              }}
            >
              Personal ( {personalNotes.length} )
            </Stack>
            <Stack
              className={Styles.active_user_btn}
              onClick={() => {
                setSelectedOption(2);
              }}
              sx={{
                borderBottom:
                  selectedOption === 2 ? "2px solid  #0566ff" : "none",
                color: selectedOption === 2 ? "#080F1A" : "#647491",
              }}
            >
              Office ( {officeNotes.length} )
            </Stack>
          </Stack>

          {searchQuery.length > 0 ? (
            <NoteList
              notes={filteredNotes}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ) : (
            <NoteList
              notes={
                selectedOption == 0
                  ? notes
                  : selectedOption == 1
                  ? personalNotes
                  : officeNotes
              }
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          )}
        </Stack>
      </Box>
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box className={Styles.add_modal}>
          <Stack className={Styles.add_modal_head} marginBottom={"16px"}>
            <Stack className={Styles.add_modal_head_title}>Edit Note</Stack>
            <Stack
              className={Styles.modal_close}
              onClick={() => setIsEditModalOpen(false)}
            >
              <img src={CloseModalIcon} alt="Close" />
            </Stack>
          </Stack>
          <form onSubmit={handleSubmit} className={Styles.form_layout}>
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextField
                label="Title"
                name="title"
                value={noteToEdit?.title || ""}
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
                value={noteToEdit?.category || ""}
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

            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextareaAutosize
                className={Styles.textarea_autosize}
                name="content"
                aria-label="minimum height"
                placeholder="Content"
                value={noteToEdit?.content || ""}
                required
                onChange={handleInputChange}
                minRows={5}
                maxRows={5}
              />
            </ThemeProvider>
            <Stack className={Styles.add_modal_btn} marginTop={"16px"}>
              <Box
                className={Styles.buttons_cancel}
                onClick={() => setIsEditModalOpen(false)}
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

export default Dashboard;
