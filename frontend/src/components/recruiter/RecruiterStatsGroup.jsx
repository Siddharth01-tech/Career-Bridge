import { Briefcase, Users, Award } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';

export default function RecruiterStatsGroup({ 
  totalJobs = 4, 
  totalApplicants = 8, 
  shortlistedCount = 3,
  onCardClick 
}) {
  const cards = [
    {
      id: 'jobs',
      title: 'Active Requisitions',
      value: totalJobs,
      icon: Briefcase,
      iconBg: 'bg-orange-50 text-[#FF5A0A]',
      badge: '+1 this week',
      badgeType: 'brand',
      subtitle: 'Live on CareerBridge public board',
    },
    {
      id: 'applicants',
      title: 'Total Applicants',
      value: totalApplicants,
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-700',
      badge: 'In Review',
      badgeType: 'in-progress',
      subtitle: 'Reviewing candidate resumes',
    },
    {
      id: 'shortlisted',
      title: 'Qualified Candidates',
      value: shortlistedCount,
      icon: Award,
      iconBg: 'bg-emerald-50 text-emerald-700',
      badge: 'Interview Stage',
      badgeType: 'success',
      subtitle: 'Scheduled for technical screens',
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

