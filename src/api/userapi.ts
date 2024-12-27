import axios from 'axios';

export interface UserProfile {
  name: string;
  email: string;
  password?: string; 
}
const API_URL = 'https://note-application-backend-xa1l.onrender.com/api/users/profile'; 

export const updateProfile = async (
  token: string,
  profileData: UserProfile
): Promise<UserProfile> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };


   const response = await axios.put<UserProfile>(API_URL, profileData, config);
  return response.data;
} catch (error: any) {
  console.error('Error updating profile:', error);
  if (error.response) {
    // If the server responded with an error status
    throw new Error(`Error: ${error.response.data.message || 'Unknown error'}`);
  } else if (error.request) {
    // If no response was received
    throw new Error('No response from server. Please check your network connection.');
  } else {
    // Something went wrong in setting up the request
    throw new Error('An error occurred while sending the request.');
  }
}
};
