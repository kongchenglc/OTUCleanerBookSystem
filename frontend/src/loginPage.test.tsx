import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm'

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});


test('displays login page', async () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
            </Routes>
        </MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText(/OTU Cleaner Book System/i)).toBeInTheDocument();
    });
});