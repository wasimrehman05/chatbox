import { apiService } from './apiService';


// Define the service function for deleting a message
export const deleteMessage = async (message_id: string): Promise<boolean> => {
    try {
        const response = await apiService.delete(`/message/${message_id}`); // Assuming your endpoint is /messages
        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
    }
};
