// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useKudos } from '../context/KudosContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Button } from '../components/Ui/Button.jsx';
import { Toggle } from '../components/Ui/Toggle.jsx';
import { Avatar } from '../components/Ui/Avatar.jsx';
import { Card } from '../components/Ui/Card.jsx';
import { KudoList } from '../components/Kudos/KudoList.jsx';
import { COLORS } from '../constants/index.js';

export const Dashboard = () => {
   // ── Data sources ─────────────────────────────────────────────────────────
  const { user, logout, updateProfile, updateAvatarColor } = useAuth();
  const { kudos, loadBoard, getStats, getFilteredKudos, moderateKudo } = useKudos();
  const { showToast } = useApp();

  const [isPublic, setIsPublic] = useState(
    user?.isPublic ?? true
  );

  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    displayName: user?.username || '',
    bio: user?.bio || ''
  });
  
  const [saving,     setSaving]     = useState(false);
  const [dashFilter, setDashFilter] = useState('all');


   // ── Load the owner's own kudos on mount ──────────────────────────────────
  useEffect(() => {
    if (user?.username) loadBoard(user.username);
  }, [user?.username, loadBoard]);


  useEffect(() => {
    if (user) {
      setIsPublic(user.isPublic ?? true);
    }
  }, [user]);

   // Sync profile fields when user object changes (e.g. after save)
  useEffect(() => {
    if (user) {
      setProfile({ displayName: user.username || '', bio: user.bio || '' });
    }
  }, [user]);

  
  // ProtectedRoute already handles the unauthenticated case — this just
  // prevents a flash of broken UI on the rare race condition.
  if (!user) return null;

  const stats = getStats()
  
  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateProfile({
      username: profile.username.trim() || user.username,
      bio:         profile.bio.trim(),
    });
    setSaving(false);
    showToast(result.success ? '✅' : '⚠️', result.success ? 'Profile saved!' : result.error);
  };


  const handleAvatarColor = async (color) => {
    const result = await updateAvatarColor(color);
    showToast(result.success ? '🎨' : '⚠️', result.success ? 'Color updated!' : result.error);
  };


  const handleCopyLink = () => {
    const link = `${window.location.origin}/u/${user.username}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    showToast('🔗', `Copied: kudos.app/u/${user.username}`);
  };


  const handleLogout = () => {
    logout();
    navigate('/');
  };
  

  const handleModerate = async (kudoId, action) => {
    const result = await moderateKudo(user.username, kudoId, action);
    if (!result.success) showToast('⚠️', result.error || 'Action failed');
    else {
      const messages = { pin: '📌 Toggled pin', hide: '🙈 Toggled visibility', delete: '🗑️ Deleted' };
      showToast('✅', messages[action] || 'Done');
    }
  };
  

  const handlePublicToggle = async () => {
    const nextValue = !isPublic;

    setIsPublic(nextValue);

    const result = await updateProfile({
      isPublic: nextValue,
    });

    if (!result.success) {
      setIsPublic(!nextValue);

      showToast(
        '⚠️',
        result.error || 'Failed to update privacy'
      );
      return;
    }

    showToast(
      '🔒',
      nextValue
        ? 'Board is now public'
        : 'Board is now private'
    );
  };
  const filteredKudos = getFilteredKudos(dashFilter, true /* isOwner */);


  return (
    <div className="pt-16">
      <div className="max-w-5xl mx-auto px-5 pt-10 pb-15">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-5 mb-10">
          <div>
            <p className="font-mono text-gold-500 text-[11px] tracking-widest uppercase mb-1.5">
              Dashboard
            </p>
            <h1 className="font-display text-[clamp(28px,4vw,38px)] font-bold text-ink-900">
              Good to see you, {user.username.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              Here's what people are saying about you.
            </p>
          </div>
          
          <div className="flex gap-2.5 flex-shrink-0 flex-wrap">
            <Button variant="secondary" size="sm" className="flex items-center gap-1.5" onClick={handleCopyLink}>
              🔗 Copy board link
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate(`/u/${user.username}`)}>
              View board →
            </Button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-9">
          {[
            { icon: '💌', label: 'Total kudos', value: stats.total, color: 'text-ink-900' },
            { icon: '📌', label: 'Pinned', value: stats.pinned, bg: 'bg-gold-300/35 border-gold-400/30' },
            { icon: '🙈', label: 'Hidden', value: stats.hidden, color: 'text-ink-900' },
            { icon: '🔥', label: 'This week', value: stats.thisWeek, bg: 'bg-ink-900', color: 'text-cream-50', labelColor: 'text-ink-600' },
          ].map((stat, i) => (
            <Card key={i} className={`p-5 ${stat.bg || 'border-cream-200'}`} hover={true}>
              <div className="text-xl mb-2">{stat.icon}</div>
              <div className={`font-display text-2xl font-bold ${stat.color || 'text-ink-900'}`}>
                {stat.value}
              </div>
              <div className={`text-[11px] mt-0.5 ${stat.labelColor || 'text-ink-400'}`}>
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
         {/* Kudos list with filter tabs */}
          <div>
            {/* Filter tabs */}
            <div className="flex bg-cream-200 rounded-full p-1 w-fit mb-5">
              {[
                { key: 'all',    label: 'All kudos' },
                { key: 'pinned', label: '📌 Pinned' },
                { key: 'hidden', label: '🙈 Hidden' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDashFilter(key)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-all duration-200
                    ${dashFilter === key
                      ? 'bg-white text-ink-900 shadow-sm'
                      : 'text-ink-400 hover:text-ink-600'}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            <KudoList
              kudos={filteredKudos}
              isOwner={true}
              onModerate={handleModerate}
              compact
              emptyMessage={
                dashFilter === 'hidden' ? 'No hidden kudos'
                : dashFilter === 'pinned' ? 'No pinned kudos yet — pin your favorites!'
                : 'No kudos yet. Share your board link to receive some!'
              }
            />
          </div>          
          {/* Sidebar */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-21">
            {/* Profile Edit */}
            <Card className="p-5 border-cream-200">
              <h3 className="font-display text-base font-semibold text-ink-900 mb-4">Profile</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={user.username} color={user.avatarColor} size="lg" />
                <div>
                  <div className="text-sm font-semibold text-ink-900">{user.username}</div>
                  <div className="font-mono text-[11px] text-ink-400">@{user.username}</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="text-[10px] text-ink-400 uppercase tracking-wide font-semibold block mb-1.25">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile(p => ({ ...p, username: e.target.value }))}
                    className="w-full px-3 py-2.25 border-2 border-ink-100 rounded-lg bg-cream-50 text-sm text-ink-900 font-body focus:border-gold-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-400 uppercase tracking-wide font-semibold block mb-1.25">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2.25 border-2 border-ink-100 rounded-lg bg-cream-50 text-sm text-ink-900 font-body focus:border-gold-400 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <Button variant="primary" size="sm" className="w-full" disabled={saving} onClick={handleSaveProfile}>
                   {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </Card>
            
            {/* Privacy Settings */}
            <Card className="p-5 border-cream-200">
              <h3 className="font-display text-base font-semibold text-ink-900 mb-4">Privacy</h3>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900 mb-0.5">Public board</p>
                    <p className="text-[11px] text-ink-400">Anyone can send kudos</p>
                  </div>
                  <Toggle enabled= {isPublic} onChange={handlePublicToggle} />
                </div>
                
              </div>
            </Card>
            
            {/* Avatar Colors */}
            <Card className="p-5 border-cream-200">
              <h3 className="font-display text-base font-semibold text-ink-900 mb-3">Avatar color</h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleAvatarColor(color)}
                    className={`
                      w-8 h-8 rounded-full border-2.5 border-white 
                      shadow-[0_1px_4px_rgba(0,0,0,0.15)] cursor-pointer
                      transition-transform duration-150 hover:scale-115
                      ${user.avatarColor === color ? 'ring-2 ring-offset-2' : ''}
                    `}
                    style={{ 
                      backgroundColor: color,
                      ringColor: color,
                      ringOffsetColor: 'white'
                    }}
                    aria-label={`Select ${color} avatar color`}
                  />
                ))}
              </div>
            </Card>
            
            {/* Sign Out */}
            <Card className="p-5 border-cream-200">
              <Button 
                variant="ghost" 
                className="w-full text-coral-600 border-2 border-coral-500/25 rounded-lg py-2.75 font-body text-sm font-medium hover:bg-coral-500/6"
                onClick={handleLogout}
              >
                Sign out of account
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};