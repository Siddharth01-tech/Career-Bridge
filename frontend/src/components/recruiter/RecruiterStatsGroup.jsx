import { Briefcase, Users, Award } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';

export default function RecruiterStatsGroup({ 
  totalJobs = 0, 
  totalApplicants = 0, 
  shortlistedCount = 0,
  onCardClick 
}) {
  const cards = [
    {
      id: 'jobs',
      title: 'Active Requisitions',
      value: totalJobs,
      icon: Briefcase,
      iconBg: 'bg-orange-50 text-[#FF5A0A]',
      badge: totalJobs > 0 ? `${totalJobs} live` : undefined,
      badgeType: 'brand',
      subtitle: totalJobs > 0 ? 'Live on CareerBridge public board' : 'No active requisitions published yet',
    },
    {
      id: 'applicants',
      title: 'Total Applicants',
      value: totalApplicants,
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-700',
      badge: totalApplicants > 0 ? 'In Review' : undefined,
      badgeType: 'in-progress',
      subtitle: totalApplicants > 0 ? 'Candidate submissions received' : 'No candidate applications yet',
    },
    {
      id: 'shortlisted',
      title: 'Qualified Candidates',
      value: shortlistedCount,
      icon: Award,
      iconBg: 'bg-emerald-50 text-emerald-700',
      badge: shortlistedCount > 0 ? 'Interview Stage' : undefined,
      badgeType: 'success',
      subtitle: shortlistedCount > 0 ? `${shortlistedCount} advanced to evaluation` : 'No candidates shortlisted yet',
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

