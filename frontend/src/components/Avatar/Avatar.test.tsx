import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
    // Test to check if the Avatar renders correctly
    test('renders Avatar with provided props', () => {
        const { container } = render(
            <Avatar
                src="https://example.com/avatar.png"
                alt="User Avatar"
                scale={1.5}
                top="10px"
                width="50px"
                height="50px"
            />
        );

        const img = screen.getByAltText('User Avatar');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
        expect(img).toHaveStyle('width: 50px');
        expect(img).toHaveStyle('height: 50px');
        expect(img).toHaveStyle('transform: scale(1.5)');
        expect(img).toHaveStyle('padding-top: 10px');
    });

    // Test to check if default props are applied correctly
    test('applies default props correctly', () => {
        const { container } = render(
            <Avatar
                src="https://example.com/avatar.png"
                alt="User Avatar"
            />
        );

        const img = screen.getByAltText('User Avatar');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
        expect(img).toHaveStyle('width: 25px');
        expect(img).toHaveStyle('height: 25px');
        expect(img).toHaveStyle('transform: scale(1)');
        expect(img).toHaveStyle('padding-top: 0px');
    });

    // Test to ensure the component's container has correct styles
    test('container has correct styles', () => {
        const { container } = render(
            <Avatar
                src="https://example.com/avatar.png"
                alt="User Avatar"
                width="40px"
                height="40px"
            />
        );

        const avatarContainer = container.querySelector('span');
        expect(avatarContainer).toHaveStyle('width: 40px');
        expect(avatarContainer).toHaveStyle('height: 40px');
    });
});
