import { esc, formatDate } from '../../utils/helper.js';
import { Button } from '../Ui/Button.jsx';

export const KudoCard = ({
kudo,
isOwner = false,
onModerate,
index = 0,
compact = false,
}) => {
const cardClass = compact
? 'bg-white border-2 border-cream-200 rounded-xl p-3.5'
: 'kudo-card relative p-5';

const handlePin = () => {
onModerate?.(kudo._id, 'pin');
};

const handleHide = () => {
onModerate?.(kudo._id, 'hide');
};

const handleDelete = () => {
onModerate?.(kudo._id, 'delete');
};

return (
<div
className={`${cardClass} animate-slide-up`}
style={{ animationDelay: `${index * 60}ms` }}
>
{kudo.isPinned && ( <span className="pin-badge absolute -top-2 right-3.5 text-xl">
📌 </span>
)}

```
  {kudo.isHidden && (
    <span className="absolute top-3 left-3.5 bg-cream-200 text-ink-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
      HIDDEN
    </span>
  )}

  <div className="flex gap-3.5 items-start">
    <span className="text-2xl shrink-0 mt-0.5">
      {kudo.emoji || '🌟'}
    </span>

    <div className="flex-1 min-w-0">
      <p
        className={`text-ink-800 leading-relaxed ${
          compact ? 'text-sm line-clamp-2' : 'text-sm'
        }`}
      >
        {esc(kudo.message)}
      </p>

      <div className="flex items-center justify-between mt-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-ink-400">
            — {esc(kudo.senderNickname || 'Anonymous')}
          </span>

          <span className="text-ink-200">·</span>

          <span className="font-mono text-[11px] text-ink-200">
            {formatDate(kudo.createdAt)}
          </span>
        </div>

        {isOwner && (
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-lg text-base"
              onClick={handlePin}
              title={kudo.isPinned ? 'Unpin' : 'Pin'}
            >
              {kudo.isPinned ? '📌' : '📍'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-lg text-base"
              onClick={handleHide}
              title={kudo.isHidden ? 'Show' : 'Hide'}
            >
              {kudo.isHidden ? '👁️' : '🙈'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-lg text-base text-coral-500"
              onClick={handleDelete}
              title="Delete"
            >
              🗑️
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>


);

}