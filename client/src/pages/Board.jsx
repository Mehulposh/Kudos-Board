// src/pages/Board.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useKudos } from '../context/KudosContext.jsx';
import { Avatar } from '../components/Ui/Avatar.jsx';
import { Button } from '../components/Ui/Button.jsx';
import { KudoForm } from '../components/Kudos/KudoForm.jsx';
import { KudoList } from '../components/Kudos/KudoList.jsx';
// import { LoadingSpinner } from '../components/Ui/LoadingSpinner';
// import { ErrorMessage } from '../components/Ui/e';

export const Board = () => {
  const { username: paramUsername } = useParams();
  const { user } = useAuth();
  const { 
    boardUser, kudos, stats, loading, error, rateLimitError,
    loadBoard, sendKudo, moderateKudo, getFilteredKudos 
  } = useKudos();
  const navigate = useNavigate();
  
  const [boardFilter, setBoardFilter] = useState('all');
  
  // Determine target username
  const username = paramUsername || user?.username;
  const isOwner = user?.username === boardUser?.username;
  
  // Load board data
  useEffect(() => {
    if (username) {
      loadBoard(username);
    }
  }, [username, loadBoard]);
  
  // Redirect if trying to view dashboard without auth
  useEffect(() => {
    if (paramUsername === 'dashboard' && !user) {
      navigate('/login');
    }
  }, [paramUsername, user, navigate]);
  
  const handleSendKudo = async (kudodata) => {
     const result = await sendKudo(username, kudodata);

  if (result.success) {
    return { success: true };
  }

  if (result.isRateLimit) {
    return {
      success: false,
      error: 'Please wait before sending another kudo 🐌'
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to send kudo'
  };
  };
  
  const handleModerate = async (kudoId, action) => {
    const result = await moderateKudo(username, kudoId, action);
    return result;
  };
  
  // Rate limit warning
  const rateLimitBanner = rateLimitError && (
    <div className="bg-coral-500/10 border border-coral-500/30 text-coral-600 px-4 py-2 text-sm text-center">
      ⚠️ {rateLimitError}
    </div>
  );
  
  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {rateLimitBanner}
      
      {/* Profile Hero */}
      <div className="bg-ink-900 relative overflow-hidden">
        <div className="absolute w-[360px] h-[360px] bg-gold-400 opacity-6 rounded-full -top-25 -right-15" />
        <div className="absolute w-[200px] h-[200px] bg-coral-500 opacity-5 rounded-full -bottom-10 left-10" />
        
        <div className="max-w-3xl mx-auto px-5 py-16 text-center relative z-10">
          <Avatar 
            name={boardUser?.displayName || username} 
            color={boardUser?.avatarColor || '#E6B020'} 
            size="xl"
            className="mx-auto mb-4 shadow-[0_0_0_4px_rgba(245,200,66,0.3),0_8px_32px_rgba(0,0,0,0.3)]"
          />
          
          <h1 className="font-display text-xl font-bold text-cream-50 mb-1">
            {boardUser?.displayName || username}
          </h1>
          <p className="font-mono text-xs text-ink-600 mb-3">@{boardUser?.username || username}</p>
          <p className="text-sm text-ink-400 max-w-sm mx-auto leading-relaxed mb-6">
            {boardUser?.bio || 'No bio yet'}
          </p>
          
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-cream-50">{stats.total}</div>
              <div className="text-[11px] text-ink-600 mt-0.5">kudos received</div>
            </div>
            <div className="w-px h-10 bg-ink-700" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-gold-400">{stats.pinned}</div>
              <div className="text-[11px] text-ink-600 mt-0.5">pinned favorites</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-5 pb-16">
        {/* Send Form - hide if owner viewing own board */}
        {!isOwner && (
          boardUser?.isPublic ? (
            <KudoForm
              recipientName={boardUser?.displayName?.split(' ')[0] || username}
              onSend={handleSendKudo}
            />
          ) : (
            <div className="bg-white border-2 border-cream-200 rounded-2xl p-8 text-center shadow-sm mb-8">
              <div className="text-5xl mb-3">🔒</div>

              <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">
                This board is private
              </h2>

              <p className="text-ink-400 max-w-md mx-auto">
                The owner has disabled public kudos. New messages cannot be submitted at this time.
              </p>
            </div>
          )
        )}
        
        {/* Owner Filter Tabs */}
        {isOwner && (
          <div className="flex bg-cream-200 rounded-full p-1 w-fit mb-5">
            {['all', 'pinned', 'hidden'].map(f => (
              <Button
                key={f}
                variant={boardFilter === f ? 'tabActive' : 'tab'}
                size="sm"
                onClick={() => setBoardFilter(f)}
              >
                {f === 'all' ? 'All kudos' : f === 'pinned' ? '📌 Pinned' : '🙈 Hidden'}
              </Button>
            ))}
          </div>
        )}
        
        {/* Kudos List */}
        <KudoList 
          kudos={getFilteredKudos(boardFilter, isOwner)}
          isOwner={isOwner}
          onModerate={handleModerate}
          emptyMessage={
            boardFilter === 'hidden' 
              ? 'No hidden kudos' 
              : boardFilter === 'pinned'
                ? 'No pinned kudos yet'
                : isOwner 
                  ? 'No kudos yet - share your link to receive some!' 
                  : 'No kudos yet - be the first to send some love!'
          }
        />
      </div>
    </div>
  );
};