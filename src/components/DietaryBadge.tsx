import { DietaryType } from '../types/menu';

interface DietaryBadgeProps {
  dietary: DietaryType;
  showLabel?: boolean;
}

export function DietaryBadge({ dietary, showLabel = false }: DietaryBadgeProps) {
  if (dietary === 'neutral') {
    return null;
  }

  const isVeg = dietary === 'veg';
  const label = isVeg ? 'Vegetarian' : 'Non-Vegetarian';

  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0"
      title={label}
      aria-label={label}
    >
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-[3px] border-[1.5px] bg-[#FFF8EE]/95 ${
          isVeg ? 'border-[#12803B]' : 'border-[#A82218]'
        }`}
      >
        {isVeg ? (
          <span className="w-[7px] h-[7px] rounded-full bg-[#12803B]" />
        ) : (
          <svg
            viewBox="0 0 10 10"
            className="w-[8px] h-[8px] fill-[#A82218]"
            aria-hidden="true"
          >
            <polygon points="5,1.5 9,8.5 1,8.5" />
          </svg>
        )}
      </span>
      {showLabel && (
        <span className="text-xs text-[#F5EBE1]/80 font-medium">{label}</span>
      )}
    </span>
  );
}
