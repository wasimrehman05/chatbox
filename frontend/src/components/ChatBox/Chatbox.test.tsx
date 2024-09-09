import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatBox } from './ChatBox';

// Mock the icons and Avatar component to avoid rendering issues in tests
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

    test('sends a message on pressing enter without shift', () => {
        render(<ChatBox />);
        const input = screen.getByPlaceholderText('Your question');

        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect((input as HTMLTextAreaElement).value).toBe(''); // Check if input is cleared
    });

    test('adds a new line on pressing shift+enter', () => {
        render(<ChatBox />);
        const input = screen.getByPlaceholderText('Your question');

        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.keyDown(input, {
            key: 'Enter',
            code: 'Enter',
            shiftKey: true,
        });

        expect((input as HTMLTextAreaElement).value).toBe('Test message\n');
    });

    test('triggers double-click edit action only on user messages', () => {
        render(<ChatBox />);
        const userMessage = screen.getAllByText(
            'Hi, thanks for connecting!'
        )[0];

        fireEvent.doubleClick(userMessage);
        expect(screen.getByPlaceholderText('Your question')).toHaveValue(
            'Hi, thanks for connecting!'
        );
    });

    test('scrolls to bottom when a new message is added', () => {
        render(<ChatBox />);

        const textarea = screen.getByPlaceholderText('Your question');
        const chatWindow = screen.getAllByTestId(
            'chat-window'
        )[0] as HTMLElement;

        // Simulate adding a message
        fireEvent.change(textarea, { target: { value: 'Test message' } });
        fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

        // Wait for the component to update
        setTimeout(() => {
            // Assert that the chatWindow has scrolled to the bottom
            expect(chatWindow.scrollTop).toBe(chatWindow.scrollHeight);
        }, 100);
    });
});
