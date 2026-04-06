// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { KudosProvider } from './context/KudosContext.jsx';
import { Navbar } from './components/Layout/Navbar.jsx';
import { Footer } from './components/Layout/Footer.jsx';
import { Toast } from './components/Ui/Toast.jsx';
import { Modal } from './components/Ui/Modal.jsx';
import { Home } from './pages/Home.jsx';
import { Auth } from './pages/Auth.jsx';
import { Board } from './pages/Board.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { AppProvider } from './context/AppContext.jsx';
// import { AppProvider } from './context/AppContext.jsx';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-pulse text-ink-400">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Board route wrapper - handles both public and owner views
function BoardRoute() {
  const { username } = useParams();
  const { user } = useAuth();
  
  // If no username param and user is logged in, show their board
  const targetUsername = username || user?.username;
  
  if (!targetUsername) {
    return <Navigate to="/" replace />;
  }
  
  return <Board />;
}

function AppContent() {
  return (
    <>
      <Navbar />
      
      <main className="bg-cream-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/login" element={<Auth mode="login" />} />
          
          {/* Public board - /u/:username or /board for own board */}
          <Route path="/board" element={<BoardRoute />} />
          <Route path="/u/:username" element={<BoardRoute />} />
          
          {/* Protected dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
      <Toast />
      <Modal />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <KudosProvider>
              <AppContent />
            </KudosProvider>
          </AppProvider>
        </AuthProvider>
    </BrowserRouter>
  );
}