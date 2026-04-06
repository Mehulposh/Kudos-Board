// src/pages/Auth.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/Ui/Input.jsx';
import { Button } from '../components/Ui/Button.jsx';
import { Card } from '../components/Ui/Card.jsx';

export const Auth = ({mode}) => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX 1: Support both prop-based mode AND pathname-based detection
  // App.jsx passes mode="register"|"login", but also works if used without prop
  const isRegister = mode
    ? mode === 'register'
    : location.pathname === '/register';
  
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: ''
  });
  const [usernamePreview, setUsernamePreview] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 [Auth.jsx] Form submitted');
    
    try {
      // ✅ Await the async function
      // ✅ FIX 2: Destructure result properly — both register() and login()
      // return { success: boolean, user?, error? }
      const result = isRegister 
        ? await register(formData.name, formData.username, formData.email, formData.password)
        : await login(formData.email, formData.password);
      
      console.log('📝 [Auth.jsx] Auth result:', result);
      
      // ✅ Now success is the actual boolean/object returned
      if (result?.success) {
        console.log('📝 [Auth.jsx] Navigating...');
         // ✅ FIX 3: Navigate immediately — no setTimeout needed.
        // setTimeout causes issues when the component unmounts mid-timeout.
        const destination = isRegister ? '/dashboard' : '/dashboard';
        navigate(destination, { replace: true });
      } else {
        console.log('📝 [Auth.jsx] Auth failed, staying on page');
      }
    } catch (err) {
      console.error('📝 [Auth.jsx] handleSubmit error:', err);
    }
  };
  
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, username: value }));
    if (value.trim()) {
      setUsernamePreview(`kudos.app/u/${value.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`);
    } else {
      setUsernamePreview('');
    }
  };
  
  return (
    <div className="pt-16 min-h-[calc(100vh-64px)] flex items-center justify-center p-12">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl border-cream-200 shadow-[0_20px_60px_rgba(24,18,14,0.06)] p-10 animate-scale-in">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3 animate-float">{isRegister ? '✨' : '👋'}</div>
            <h1 className="font-display text-xl font-bold text-ink-900 mb-1.5">
              {isRegister ? 'Create your board' : 'Welcome back'}
            </h1>
            <p className="text-sm text-ink-400">
              {isRegister ? 'Join 2,400+ people sharing kindness' : 'Your kudos are waiting for you'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {isRegister && (
              <>
                <Input
                  id="reg-name"
                  label="Display name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoComplete="name"
                  required
                />
                <div>
                  <Input
                    id="reg-username"
                    label="Username"
                    value={formData.username}
                    onChange={handleUsernameChange}
                    autoComplete="username"
                    required
                  />
                  {usernamePreview && (
                    <p className="text-[11px] text-ink-400 font-mono mt-1 ml-1">
                      Your link: <span className="text-gold-600 font-semibold">{usernamePreview}</span>
                    </p>
                  )}
                </div>
              </>
            )}
            
            <Input
              id={isRegister ? 'reg-email' : 'login-email'}
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              autoComplete={isRegister ? "email" : "current-password"}
              required
            />
            
            <Input
              id={isRegister ? 'reg-password' : 'login-password'}
              label={isRegister ? "Password (min. 6 chars)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={6}
              required
            />
            
            <Button type="submit" variant="primary" size="lg" className="w-full mt-1">
              {isRegister ? 'Create my board →' : 'Sign in'}
            </Button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-200" />
              </div>
              <div className="relative text-center">
                <span className="bg-cream-50 px-4 text-xs text-ink-400">or</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-ink-400">
              {isRegister ? 'Already have a board? ' : 'New here? '}
              <button
                type="button"
                onClick={() => navigate(isRegister ? '/login' : '/register')}
                className="text-ink-900 font-semibold bg-transparent border-none cursor-pointer underline text-sm"
              >
                {isRegister ? 'Sign in' : 'Create a free board'}
              </button>
            </p>
          </form>
        </Card>
        
        {!isRegister && (
          <div className="mt-4 bg-gold-400/15 border border-gold-400/30 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-ink-600 font-mono">Demo: any email + any password ↗</p>
          </div>
        )}
        
        <p className="text-center text-xs text-ink-200 mt-5">
          No spam. No ads. Just good vibes.
        </p>
      </div>
    </div>
  );
};