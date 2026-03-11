import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone } from "lucide-react";

const AnnouncementsBanner = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setAnnouncements(data);
    };
    fetch();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Megaphone className="w-7 h-7 text-primary" />
          <h2 className="font-display text-4xl text-secondary-foreground tracking-wide">
            Announcements
          </h2>
        </div>
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-background/50 backdrop-blur rounded-xl border border-border p-6 space-y-2"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-body text-lg font-semibold text-secondary-foreground">
                  {a.title}
                </h3>
                <span className="text-muted-foreground font-body text-xs shrink-0 mt-1">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap leading-relaxed">
                {a.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsBanner;
