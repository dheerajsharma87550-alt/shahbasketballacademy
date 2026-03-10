import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, XCircle, Search } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";

const FeeStatus = () => {
  const [playerId, setPlayerId] = useState("");
  const [status, setStatus] = useState<"paid" | "unpaid" | null>(null);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId.trim()) {
      toast.error("Please enter your Player ID");
      return;
    }

    setLoading(true);
    setSearched(true);
    setStatus(null);

    const { data, error } = await supabase
      .from("players")
      .select("fee_status, registrations(student_name)")
      .eq("player_id", playerId.trim().toUpperCase())
      .maybeSingle();

    setLoading(false);

    if (error) {
      toast.error("Something went wrong");
      console.error(error);
      return;
    }

    if (!data) {
      toast.error("Player ID not found");
      setStatus(null);
      return;
    }

    setStatus(data.fee_status as "paid" | "unpaid");
    const reg = data.registrations as any;
    setStudentName(reg?.student_name || "");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AppSidebar />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl text-foreground tracking-wide">
            Check Fee Status
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Enter your Player ID to check your fee status
          </p>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={playerId}
              onChange={(e) => {
                setPlayerId(e.target.value.toUpperCase());
                setSearched(false);
                setStatus(null);
              }}
              placeholder="Enter Player ID (e.g. SHA001)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring transition text-center text-lg tracking-widest"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-body font-bold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {searched && status && (
          <div
            className={`rounded-2xl p-8 text-center space-y-3 border-2 ${
              status === "paid"
                ? "bg-green-50 border-green-400"
                : "bg-red-50 border-red-400"
            }`}
          >
            {status === "paid" ? (
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            )}
            {studentName && (
              <p className="font-body text-sm text-muted-foreground">{studentName}</p>
            )}
            <p
              className={`font-display text-5xl tracking-wider ${
                status === "paid" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeStatus;
