// src/components/layout/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Avatar } from '../Ui/Avatar.jsx';
import { Button } from '../Ui/Button.jsx';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/92 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 group cursor-pointer bg-transparent border-none"
        >
          <div className="w-8 h-8 rounded-xl bg-ink-900 flex items-center justify-center text-gold-400 font-display text-sm font-bold transition-transform duration-200 group-hover:rotate-3">
            K
          </div>
          <span className="font-display text-lg font-semibold text-ink-900">
            Kudos<span className="text-gold-500">.</span>
          </span>
        </Link>
        
        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/board">
              <Button variant="ghost" size="sm">My Board</Button>
            </Link>
            <Link to="/dashboard">
              <button className="bg-transparent border-none cursor-pointer p-0.5">
                <Avatar name={user.displayName} color={user.avatarColor} size="md" />
              </button>
            </Link>
            <Button variant="ghost" size="sm" className="text-ink-400 text-xs px-3 py-2" onClick={logout}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};