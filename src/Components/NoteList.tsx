import React, { useState } from "react";
import { Note } from "../type/interface";
import { Box, Modal, Stack } from "@mui/material";
import Styles from "./NoteList.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotFoundIcon from "../Assest/NotFoundTask.svg";
import CloseModalIcon from "./../Assest/Group 48095853.svg";

interface NoteListProps {
  notes: Note[]; // Strict type for notes
  onEdit: (_id: number) => void;
  onDelete: (_id: number | any) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes = [],
  onEdit,
  onDelete,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  if (notes.length === 0) {
    return (
      <Box
        marginTop={"70px"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack>
          <img src={NotFoundIcon} />
        </Stack>
        <Box className="NotFound-DocumentPage">
          <Stack
            sx={{
              fontSize: "24px",
              fontFamily: "Outfit,sans-serif",
            }}
          >
            No Notes Found
          </Stack>
          <Stack
            sx={{
              fontSize: "15px",
              fontFamily: "Outfit,sans-serif",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            No Notes Found
          </Stack>
        </Box>
      </Box>
    );
  }
  const formatDate = (isoString: any): string => {
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" }); // "Dec"
    const year = date.getFullYear();

    // Convert to 12-hour format
    const hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2-digit format
    const amPm = date.getHours() >= 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${amPm} (${day} ${month} ${year})   `;
  };
  return (
    <>
      <Box className={Styles.card_layout}>
        {notes.map((note) => (
          <Stack key={note._id} className={Styles.card_struct}>
            <Stack className={Styles.card_tops}>
              <Stack
                className={
                  note.category == "Personal"
                    ? Styles.card_category
                    : Styles.card_category_office
                }
              >
                {note.category ? note.category : "Not Mentioned"}
              </Stack>
              <Stack className={Styles.card_tops_btn}>
                {" "}
                <Stack>
                  <EditIcon
                    sx={{ color: "#133B5C" }}
                    onClick={() => note._id && onEdit(note._id)}
                  />
                </Stack>
                <Stack>
                  <DeleteIcon
                    sx={{ color: "#133B5C" }}
                    onClick={() => {
                      setDeleteModal(true);
                      setDeleteId(note._id);
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Stack className={Styles.card_title}>
              <h3>{note.title}</h3>
            </Stack>
            <Stack className={Styles.card_content}>
              {" "}
              <p>{note.content}</p>
            </Stack>
            <Stack className={Styles.date_content}>
              {" "}
              <p>{formatDate(note?.createdAt)}</p>
            </Stack>
            {/* <button
              onClick={() => note.id && onEdit(note.id)} // Only call onEdit if id is defined
              // disabled={!note.id} // Disable button if id is undefined
            >
              Edit
            </button> */}
            {/* <button onClick={() => onDelete(note?.id)}>Delete</button> */}
          </Stack>
        ))}
      </Box>
      {/* MODAL for Delete the notes */}
      <Modal
        open={deleteModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={Styles.delete_modal}>
          <Stack
            className={Styles.delete_title}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack>Delete Note</Stack>
            <Stack
              className={Styles.delete_modal_close}
              onClick={() => setDeleteModal(false)}
            >
              <img src={CloseModalIcon} alt="" />
            </Stack>
          </Stack>
          <Box className={Styles.delete_Note_Text}>
            Are you sure want to delete this permanently, this action is
            irreversible.
          </Box>
          <Box className={Styles.delete_btn}>
            <Box
              className={Styles.delete_Cancel}
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Box>
            <Box
              className={Styles.delete_button}
              onClick={() => {
                onDelete(deleteId);
                setDeleteModal(false);
              }}
            >
              Delete
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* End */}
    </>
  );
};

export default NoteList;
