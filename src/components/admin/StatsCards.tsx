import { Users, UserCheck, UserX, CheckCircle2, XCircle } from "lucide-react";

interface StatsCardsProps {
  registrations: any[];
  players: any[];
}

const StatsCards = ({ registrations, players }: StatsCardsProps) => {
  const totalRegistered = registrations.length;
  const below14 = registrations.filter((r) => r.batch === "below_14").length;
  const above14 = registrations.filter((r) => r.batch === "above_14").length;
  const feesPaid = players.filter((p) => p.fee_status === "paid").length;
  const feesUnpaid = players.filter((p) => p.fee_status === "unpaid").length;

  const cards = [
    { label: "Total Registered", value: totalRegistered, icon: Users, color: "text-primary" },
    { label: "Below 14", value: below14, icon: UserCheck, color: "text-blue-600" },
    { label: "Above 14", value: above14, icon: UserX, color: "text-purple-600" },
    { label: "Fees Paid", value: feesPaid, icon: CheckCircle2, color: "text-green-600" },
    { label: "Fees Unpaid", value: feesUnpaid, icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card rounded-xl border border-border p-4 space-y-1 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
            <span className="text-muted-foreground font-body text-xs">{card.label}</span>
          </div>
          <p className="font-display text-3xl text-foreground tracking-wide">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
