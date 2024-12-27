import axios from 'axios';
import { Note } from '../type/interface';

// Define the base URL for your API
const API_URL = 'http://localhost:9000/api/notes'; // Adjust if your base path is different

// Fetch all notes
export const fetchNotes = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Token for protected routes
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data; // Returns the array of notes
};

export const createNote = async (
    noteData: { title: string; content?: string; category: string },
    token: string
): Promise<Note> => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post<Note>('http://localhost:9000/api/notes', noteData, config);
    return response.data;
};

export const updateNote = async (
    id: string,
    noteData: { title?: string; content?: string; category?: string },
    token: string
): Promise<Note> => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put<Note>(`http://localhost:9000/api/notes/${id}`, noteData, config);
    return response.data;
};

// Delete a note
export const deleteNote = async (id: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data; // Returns a success message
};

export { };