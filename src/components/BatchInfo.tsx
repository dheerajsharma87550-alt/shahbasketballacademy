import { Clock, CalendarDays, CalendarOff, Users } from "lucide-react";

const batches = [
  {
    title: "Batch 1",
    subtitle: "Junior Division",
    age: "Children below 14 years old",
    time: "5:00 PM – 6:00 PM",
    days: "Monday to Saturday",
    holiday: "Sunday",
  },
  {
    title: "Batch 2",
    subtitle: "Senior Division",
    age: "Players above 14 years old",
    time: "6:00 PM – 7:00 PM",
    days: "Monday to Saturday",
    holiday: "Sunday",
  },
];

const BatchInfo = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-5xl sm:text-6xl text-center text-foreground tracking-wide mb-4">
          Training <span className="text-primary">Batches</span>
        </h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-md mx-auto">
          Choose the batch that fits your age group and start your journey.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {batches.map((batch) => (
            <div
              key={batch.title}
              className="relative rounded-2xl border border-border bg-background p-8 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 group"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-4">
                <span className="text-xs font-semibold font-body uppercase tracking-wider text-primary">
                  {batch.subtitle}
                </span>
                <h3 className="font-display text-4xl text-foreground tracking-wide">
                  {batch.title}
                </h3>
              </div>
              <div className="space-y-3 font-body text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{batch.age}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{batch.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <span>{batch.days}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarOff className="w-5 h-5 text-primary" />
                  <span>Holiday: {batch.holiday}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BatchInfo;
