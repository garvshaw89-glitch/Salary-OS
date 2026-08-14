import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  progressPercent?: number;
  progressColor?: string;
  icon?: React.ElementType;
  iconColor?: string;
  badge?: string;
  badgeVariant?: 'default' | 'indigo' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subvalue,
  change,
  progressPercent,
  progressColor = 'bg-indigo-500',
  icon: Icon,
  iconColor = 'text-slate-400',
  badge,
  badgeVariant = 'default',
  onClick,
  className,
}) => {
  const badgeStyles = {
    default: 'bg-slate-800 text-slate-400 border-slate-700',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded border border-slate-800 bg-slate-900 p-3 transition-all duration-150 flex flex-col justify-between select-none',
        onClick && 'cursor-pointer hover:border-slate-700 hover:bg-slate-900/90',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={cn(
                'rounded px-1.5 py-0.2 text-[9px] font-mono font-bold border',
                badgeStyles[badgeVariant]
              )}
            >
              {badge}
            </span>
          )}
          {Icon && (
            <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-800/80 border border-slate-700/50">
              <Icon className={cn('h-3 w-3', iconColor)} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          {value}
        </div>
        {change && (
          <span
            className={cn(
              'font-mono text-[10px] font-bold',
              change.isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {change.isPositive ? '+' : ''}
            {change.value}
          </span>
        )}
      </div>

      {progressPercent !== undefined ? (
        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-500', progressColor)}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      ) : subvalue ? (
        <div className="mt-1 text-[10px] text-slate-500 font-mono truncate">
          {subvalue}
        </div>
      ) : (
        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className={cn('h-full', progressColor)} style={{ width: '65%' }} />
        </div>
      )}
    </div>
  );
};
