import { apiService } from './apiService';
import {Message} from './FetchMessages';


// Define the types for request payload and response
export interface UpdateMessagePayload {
    message_id: string;
    message: string;
}


// Define the service function for updating a message
export const updateMessage = async (payload: UpdateMessagePayload): Promise<Message> => {
    try {
        const response = await apiService.put(`/message/${payload.message_id}`, {message: payload.message}); // Assuming your endpoint is /messages
        return response.data;
    } catch (error) {
        console.error('Error updating message:', error);
        throw new Error('Failed to update message');
    }
};

