import { apiService } from './apiService';
import {Message} from './FetchMessages';

// Define the types for the message payload and response
export interface SendMessagePayload {
    user_id: number;
    context: string;
    message: string;
}


// Function to send a message
export const sendMessage = async (payload: SendMessagePayload): Promise<Message> => {
    try {
        const response = await apiService.post('/message', payload);
        return response.data;
    } catch (error) {
        // Handle error appropriately
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};
