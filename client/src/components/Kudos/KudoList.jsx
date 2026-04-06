// src/components/Kudos/KudoList.jsx
// KudoList is a pure rendering component.
// Filter logic + tab state live in the parent (Board.jsx / Dashboard.jsx).
// This component just receives already-filtered kudos and renders them.
 
import { KudoCard } from './KudoCard.jsx';
 
export const KudoList = ({
  kudos = [],
  isOwner = false,
  onModerate,           // (kudoId, action) => void  — only passed by owner views
  compact = false,
  emptyMessage = 'No kudos here yet',
  emptySubtext = 'Be the first to spread some love!',
}) => {
  if (!kudos || kudos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3 animate-float">💭</div>
        <p className="font-display text-lg text-ink-400">{emptyMessage}</p>
        <p className="text-sm text-ink-200 mt-1.5">{emptySubtext}</p>
      </div>
    );
  }
 
  return (
    <div className={`flex flex-col ${compact ? 'gap-2.5' : 'gap-3.5'} pb-15`}>
      {kudos.map((kudo, i) => (
        <KudoCard
          key={kudo._id || kudo.id}
          kudo={kudo}
          isOwner={isOwner}
          onModerate={onModerate}
          index={i}
          compact={compact}
        />
      ))}
    </div>
  );
};