import { Users, Briefcase, ShieldAlert } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';

export default function AdminStatsGroup({ 
  totalUsers = 0, 
  candidatesCount = 0,
  recruitersCount = 0,
  totalJobs = 0, 
  blockedUsersCount = 0,
  onCardClick 
}) {
  const cards = [
    {
      id: 'users',
      title: 'Platform Users',
      value: totalUsers,
      icon: Users,
      iconBg: 'bg-orange-50 text-[#FF5A0A]',
      badge: totalUsers > 0 ? `${totalUsers} total` : undefined,
      badgeType: 'brand',
      subtitle: totalUsers > 0 
        ? `${candidatesCount} Candidates • ${recruitersCount} Recruiters` 
        : 'No users registered yet',
    },
    {
      id: 'jobs',
      title: 'Job Postings',
      value: totalJobs,
      icon: Briefcase,
      iconBg: 'bg-amber-50 text-amber-700',
      badge: totalJobs > 0 ? `${totalJobs} live` : undefined,
      badgeType: 'in-progress',
      subtitle: totalJobs > 0 
        ? 'Active requisitions across all companies' 
        : 'No job postings on platform',
    },
    {
      id: 'moderation',
      title: 'Blocked / Restricted Accounts',
      value: blockedUsersCount,
      icon: ShieldAlert,
      iconBg: blockedUsersCount > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700',
      badge: blockedUsersCount > 0 ? `${blockedUsersCount} suspended` : 'Zero Suspended',
      badgeType: blockedUsersCount > 0 ? 'in-progress' : 'success',
      subtitle: blockedUsersCount > 0 
        ? 'Accounts currently prevented from signing in' 
        : 'All accounts in good standing',
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

