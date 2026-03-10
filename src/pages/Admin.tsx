import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, LogOut, Users, Search, Plus, RefreshCw } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";

const ADMIN_PASSWORD = "shah2026";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Incorrect password");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [regRes, playerRes] = await Promise.all([
      supabase.from("registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("players").select("*"),
    ]);
    setLoading(false);

    if (regRes.error) {
      toast.error("Failed to load registrations");
      console.error(regRes.error);
    } else {
      setRegistrations(regRes.data || []);
    }

    if (!playerRes.error) {
      setPlayers(playerRes.data || []);
    }
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  const getPlayerForRegistration = (regId: string) => {
    return players.find((p) => p.registration_id === regId);
  };

  const generatePlayerId = async (regId: string) => {
    const existing = getPlayerForRegistration(regId);
    if (existing) {
      toast.info(`Player ID already exists: ${existing.player_id}`);
      return;
    }

    // Generate next ID
    const maxNum = players.reduce((max, p) => {
      const match = p.player_id.match(/^SHA(\d+)$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);

    const newId = `SHA${String(maxNum + 1).padStart(3, "0")}`;

    const { error } = await supabase.from("players").insert({
      registration_id: regId,
      player_id: newId,
      fee_status: "unpaid",
    });

    if (error) {
      toast.error("Failed to create Player ID");
      console.error(error);
    } else {
      toast.success(`Player ID created: ${newId}`);
      fetchData();
    }
  };

  const toggleFeeStatus = async (playerId: string, currentStatus: string) => {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
    const { error } = await supabase
      .from("players")
      .update({ fee_status: newStatus })
      .eq("player_id", playerId);

    if (error) {
      toast.error("Failed to update fee status");
      console.error(error);
    } else {
      toast.success(`Fee status updated to ${newStatus.toUpperCase()}`);
      fetchData();
    }
  };

  const filtered = registrations.filter(
    (r) =>
      r.student_name.toLowerCase().includes(search.toLowerCase()) ||
      r.parent_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <AppSidebar />
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-background rounded-2xl p-8 shadow-lg space-y-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl text-foreground tracking-wide">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm text-center font-body">
              Enter the admin password to view registrations
            </p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-body font-bold hover:bg-primary/90 transition"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <header className="bg-secondary px-4 py-4 flex items-center justify-between sticky top-0 z-10 pl-16">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl text-secondary-foreground tracking-wide">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-1 text-secondary-foreground/60 hover:text-secondary-foreground transition font-body text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-secondary-foreground/60 hover:text-secondary-foreground transition font-body text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <span className="text-muted-foreground font-body text-sm">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <p className="text-muted-foreground font-body text-center py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground font-body text-center py-12">
            No registrations found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold text-foreground">#</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Player ID</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Student Name</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Age</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Parent Name</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Phone</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Batch</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const player = getPlayerForRegistration(r.id);
                  return (
                    <tr
                      key={r.id}
                      className="border-t border-border hover:bg-muted/50 transition"
                    >
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3">
                        {player ? (
                          <span className="font-mono font-bold text-primary tracking-wider">
                            {player.player_id}
                          </span>
                        ) : (
                          <button
                            onClick={() => generatePlayerId(r.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition"
                          >
                            <Plus className="w-3 h-3" /> Create ID
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.student_name}</td>
                      <td className="px-4 py-3 text-foreground">{r.age}</td>
                      <td className="px-4 py-3 text-foreground">{r.parent_name}</td>
                      <td className="px-4 py-3 text-foreground">{r.phone}</td>
                      <td className="px-4 py-3 text-foreground">{r.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            r.batch === "below_14"
                              ? "bg-primary/15 text-primary"
                              : "bg-accent/15 text-accent"
                          }`}
                        >
                          {r.batch === "below_14" ? "Below 14" : "Above 14"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {player ? (
                          <button
                            onClick={() => toggleFeeStatus(player.player_id, player.fee_status)}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                              player.fee_status === "paid"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {player.fee_status.toUpperCase()}
                          </button>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
