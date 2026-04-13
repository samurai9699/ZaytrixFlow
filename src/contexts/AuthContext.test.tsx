import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// Mock Sonner toast and Supabase
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      admin: {
        deleteUser: vi.fn(),
      }
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  }
}));

// Test Consumer Component
const TestAuthConsumer = () => {
  const { user, loading, login, logout, register } = useAuth();

  if (loading) return <div data-testid="loading">Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">{user ? user.email : 'No User'}</div>
      <button 
        onClick={() => login('test@example.com', 'password123')}
        data-testid="login-btn"
      >
        Login
      </button>
      <button 
        onClick={() => register('new@example.com', 'pass', 'New User')}
        data-testid="register-btn"
      >
        Register
      </button>
      <button 
        onClick={() => logout()}
        data-testid="logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext Component Tests', () => {
  const mockSession = {
    user: { id: '123', email: 'test@example.com' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    (supabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
  });

  it('initializes with no user and ends loading state', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    // Initial state loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // After session check
    expect(await screen.findByTestId('user-status')).toHaveTextContent('No User');
  });

  it('initializes with a user if session exists', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: mockSession } });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('user-status')).toHaveTextContent('test@example.com');
  });

  it('calls Supabase signInWithPassword on login', async () => {
    const user = userEvent.setup();
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockSession.user },
      error: null
    });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await screen.findByTestId('user-status');
    const loginBtn = screen.getByTestId('login-btn');
    
    await user.click(loginBtn);

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('calls Supabase signUp and from().insert() on register', async () => {
    const user = userEvent.setup();
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: '456' } },
      error: null
    });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await screen.findByTestId('user-status');
    const registerBtn = screen.getByTestId('register-btn');
    
    await user.click(registerBtn);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'pass'
    });
    expect(supabase.from).toHaveBeenCalledWith('users');
  });

  it('calls Supabase signOut on logout', async () => {
    const user = userEvent.setup();
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: mockSession } });
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await screen.findByTestId('user-status');
    const logoutBtn = screen.getByTestId('logout-btn');
    
    await user.click(logoutBtn);

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
