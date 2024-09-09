import { apiService } from './apiService';

// Define the shape of a single message
export interface Message {
    id: string;
    message: string;
    reply: string;
    user_id: number;
    context: string;
    created_at: string; // ISO date string
    updated_at: string | null; // ISO date string or null
    deleted_at: string | null; // ISO date string or null
}

// Define the shape of the API response
interface FetchChatResponse {
    messages: Message[];
}

// Update the fetchChat function with types
export const fetchMessages = async (
    user_id: number,
    context: string,
    page_size: number
): Promise<FetchChatResponse> => {
    const response = await apiService.get<FetchChatResponse>('/messages', {
        params: {
            user_id,
            context,
            page_size,
        },
    });
    return response.data;
};
