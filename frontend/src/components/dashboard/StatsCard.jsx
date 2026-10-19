import { FolderKanban, Clock3, Award, ArrowUpRight } from 'lucide-react';

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  badge, 
  badgeType = 'neutral', // 'neutral' | 'in-progress' | 'success' | 'highlight'
  subtitle,
  iconBg = 'bg-blue-50 text-blue-600',
  onClick
}) {
  const badgeStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/60',
    'in-progress': 'bg-amber-50 text-amber-700 border-amber-200/70',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    highlight: 'bg-purple-50 text-purple-700 border-purple-200/70',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/70',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      {/* Top Row: Title + Icon / Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 block">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyles[badgeType] || badgeStyles.neutral}`}>
              {badge}
            </span>
          )}

          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="my-3">
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-none">
          {value}
        </div>
      </div>

      {/* Bottom Subtitle / Context */}
      {subtitle && (
        <div className="pt-2 border-t border-slate-100 text-[11px] sm:text-xs text-slate-500 flex items-center justify-between">
          <span>{subtitle}</span>
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          )}
        </div>
      )}
    </div>
  );
}

export default function StatsGroup({ 
  totalApplications = 12, 
  underReview = 5, 
  shortlisted = 2,
  onCardClick 
}) {
  const cards = [
    {
      id: 'total',
      title: 'Total Applications',
      value: totalApplications,
      icon: FolderKanban,
      iconBg: 'bg-blue-50 text-blue-600',
      badge: '+2 this week',
      badgeType: 'blue',
      subtitle: 'Across active tech opportunities',
    },
    {
      id: 'under_review',
      title: 'Under Review',
      value: underReview,
      icon: Clock3,
      iconBg: 'bg-amber-50 text-amber-600',
      badge: 'In Progress',
      badgeType: 'in-progress',
      subtitle: 'Average recruiter wait: 3 business days',
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      value: shortlisted,
      icon: Award,
      iconBg: 'bg-purple-50 text-purple-600',
      badge: 'Next Stage',
      badgeType: 'highlight',
      subtitle: '1 technical interview scheduled',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => (
        <StatsCard
          key={card.id}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          badge={card.badge}
          badgeType={card.badgeType}
          subtitle={card.subtitle}
          onClick={() => onCardClick?.(card.id)}
        />
      ))}
    </div>
  );
}
