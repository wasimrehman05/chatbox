import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatBox } from './ChatBox';

// Mock icons and other components to prevent rendering issues
jest.mock('../../icons/Close', () => ({
    CloseIcon: () => <span>CloseIcon</span>,
}));
jest.mock('../../icons/Maximize', () => ({
    MaximizeIcon: () => <span>MaximizeIcon</span>,
}));
jest.mock('../../icons/Minimize', () => ({
    MinimizeIcon: () => <span>MinimizeIcon</span>,
}));
jest.mock('../../icons/SIdeBarLeft', () => ({
    SidebarLeftIcon: () => <span>SidebarLeftIcon</span>,
}));
jest.mock('../../icons/Setting', () => ({
    SettingIcon: () => <span>SettingIcon</span>,
}));
jest.mock('../../icons/Send', () => ({
    SendIcon: () => <span>SendIcon</span>,
}));
jest.mock('../Avatar/Avatar', () => ({
    Avatar: ({ src, alt }: { src: string; alt: string }) => (
        <img src={src} alt={alt} />
    ),
}));

// Mock services to avoid actual API calls
jest.mock('../../services/FetchMessages', () => ({
    fetchMessages: jest.fn().mockResolvedValue({ messages: [] }),
}));
jest.mock('../../services/SendMessage', () => ({
    sendMessage: jest
        .fn()
        .mockResolvedValue({
            id: '1',
            message: 'Test message',
            reply: 'Test reply',
        }),
}));
jest.mock('../../services/updateMessage', () => ({
    updateMessage: jest
        .fn()
        .mockResolvedValue({ id: '1', message: 'Updated message' }),
}));
jest.mock('../../services/deleteMessage', () => ({
    deleteMessage: jest.fn().mockResolvedValue(true),
}));

// Mock the internal API or data fetching logic directly within the component test
jest.mock('./ChatBox', () => {
    const originalModule = jest.requireActual('./ChatBox');
    return {
        ...originalModule,
        fetchMessagesFromAPI: jest.fn().mockResolvedValue({
            messages: [
                { content: 'User message', userId: 1 },
                { content: 'Bot message', userId: 2 },
            ],
        }),
    };
});

describe('ChatBox Component', () => {
    test('renders chat box with header and input area', () => {
        render(<ChatBox />);
        expect(screen.getByText("Hey👋, I'm Ava")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Your question')
        ).toBeInTheDocument();
    });

    test('handles maximize and minimize functionality', () => {
        render(<ChatBox />);
        const maximizeButton = screen.getByText('MaximizeIcon');
        fireEvent.click(maximizeButton);

        // Check for minimize icon to appear after maximizing
        expect(screen.getByText('MinimizeIcon')).toBeInTheDocument();

        // Click again to minimize
        fireEvent.click(screen.getByText('MinimizeIcon'));
        expect(screen.getByText('MaximizeIcon')).toBeInTheDocument();
    });

    test('sends a message on pressing enter without shift', async () => {
        render(<ChatBox />);
        const input = screen.getByPlaceholderText('Your question');

        // Simulate user typing a message
        fireEvent.change(input, { target: { value: 'Test message' } });

        // Simulate pressing 'Enter' key without Shift
        fireEvent.keyDown(input, {
            key: 'Enter',
            code: 'Enter',
            shiftKey: false,
        });

        // Await the async behavior to complete and assert the expected result
        await waitFor(() => {
            expect(screen.getByText('Test message')).toBeInTheDocument();
            expect(input).toHaveValue('Test message');
        });
    });

    test('adds a new line on pressing shift+enter', () => {
        render(<ChatBox />);
        const input = screen.getByPlaceholderText('Your question');

        // Simulate user typing a message
        fireEvent.change(input, { target: { value: 'Test message' } });

        // Simulate pressing 'Shift + Enter' key combination
        fireEvent.keyDown(input, {
            key: 'Enter',
            code: 'Enter',
            shiftKey: true,
        });

        // Assert that a new line is added to the message
        expect(input).toHaveValue('Test message\n');
    });

    test('triggers double-click edit action only on user messages', async () => {
        // Render the ChatBox component
        render(<ChatBox />);

        // Wait for the messages to be loaded and rendered
        const userMessages = await screen.findAllByTestId('chat-message');
        expect(userMessages.length).toBeGreaterThan(0); // Ensure messages are rendered

        // Identify the specific user message to double-click on
        const userMessage = userMessages[0]; // Assuming this is a user message

        if (userMessage) {
            // Simulate a double-click on the identified user message
            fireEvent.doubleClick(userMessage);

            // Assert that the edit action was triggered, for example by checking for an input field or specific class
            await waitFor(() => {
                // Replace with actual selector or condition that indicates edit mode is active
                const editInput = screen.getByPlaceholderText(
                    'Update your message'
                ); // Assuming an input shows up for editing
                expect(editInput).toBeInTheDocument();
            });
        } else {
            expect(userMessage).not.toBeInTheDocument();
        }
    });

    test('scrolls to bottom when a new message is added', async () => {
        render(<ChatBox />);

        const textarea = screen.getByPlaceholderText('Your question');
        const chatWindow = screen.getByTestId('chat-window');

        // Simulate adding a message
        fireEvent.change(textarea, { target: { value: 'Test message' } });
        fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

        // Wait for the component to update
        await waitFor(() => {
            // Assert that the chatWindow has scrolled to the bottom
            expect(chatWindow.scrollTop).toBe(
                chatWindow.scrollHeight - chatWindow.clientHeight
            );
        });
    });
});
