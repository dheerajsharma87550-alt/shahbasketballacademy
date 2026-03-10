import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, LogOut, Users, Search, Plus, Pencil, Check, X, IdCard } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";

const ADMIN_PASSWORD = "shah2026";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [tab, setTab] = useState<"registrations" | "players">("registrations");

  // New player form
  const [newPlayerId, setNewPlayerId] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

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
      supabase.from("players").select("*").order("created_at", { ascending: false }),
    ]);
    setLoading(false);
    if (!regRes.error) setRegistrations(regRes.data || []);
    if (!playerRes.error) setPlayers(playerRes.data || []);
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  const createPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = newPlayerId.trim().toUpperCase();
    const name = newPlayerName.trim();
    if (!id || !name) {
      toast.error("Player ID and Name are required");
      return;
    }

    const { error } = await supabase.from("players").insert({
      player_id: id,
      player_name: name,
      fee_status: "unpaid",
    });

    if (error) {
      if (error.code === "23505") toast.error("Player ID already exists");
      else toast.error("Failed to create player");
      console.error(error);
    } else {
      toast.success(`Player ${id} created`);
      setNewPlayerId("");
      setNewPlayerName("");
      fetchData();
    }
  };

  const startEdit = (player: any) => {
    setEditingId(player.player_id);
    setEditName(player.player_name);
  };

  const saveEdit = async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .update({ player_name: editName.trim() })
      .eq("player_id", playerId);

    if (error) {
      toast.error("Failed to update name");
    } else {
      toast.success("Player name updated");
      setEditingId(null);
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
    } else {
      toast.success(`Fee status → ${newStatus.toUpperCase()}`);
      fetchData();
    }
  };

  const filteredRegs = registrations.filter(
    (r) =>
      r.student_name.toLowerCase().includes(search.toLowerCase()) ||
      r.parent_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  const filteredPlayers = players.filter(
    (p) =>
      p.player_id.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.player_name.toLowerCase().includes(playerSearch.toLowerCase())
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
            <h1 className="font-display text-3xl text-foreground tracking-wide">Admin Access</h1>
            <p className="text-muted-foreground text-sm text-center font-body">
              Enter the admin password to continue
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-secondary-foreground/60 hover:text-secondary-foreground transition font-body text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-1 border-b border-border">
          <button
            onClick={() => setTab("registrations")}
            className={`px-5 py-2.5 font-body text-sm font-medium transition border-b-2 -mb-px ${
              tab === "registrations"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Registrations
          </button>
          <button
            onClick={() => setTab("players")}
            className={`px-5 py-2.5 font-body text-sm font-medium transition border-b-2 -mb-px ${
              tab === "players"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <IdCard className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Player ID Management
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <p className="text-muted-foreground font-body text-center py-12">Loading...</p>
        )}

        {/* Registrations Tab */}
        {!loading && tab === "registrations" && (
          <>
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
                {filteredRegs.length} student{filteredRegs.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredRegs.length === 0 ? (
              <p className="text-muted-foreground font-body text-center py-12">No registrations found.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left font-body text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">#</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Student Name</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Age</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Parent Name</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Phone</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Batch</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegs.map((r, i) => (
                      <tr key={r.id} className="border-t border-border hover:bg-muted/50 transition">
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
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
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Player ID Management Tab */}
        {!loading && tab === "players" && (
          <>
            {/* Create Player Form */}
            <form
              onSubmit={createPlayer}
              className="bg-card rounded-xl border border-border p-5 mb-6 space-y-4"
            >
              <h2 className="font-display text-xl text-foreground tracking-wide">Create New Player ID</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={newPlayerId}
                  onChange={(e) => setNewPlayerId(e.target.value.toUpperCase())}
                  placeholder="Player ID (e.g. SHA001)"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition tracking-widest"
                />
                <input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player Name"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-body font-bold text-sm hover:bg-primary/90 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create
                </button>
              </div>
            </form>

            {/* Player search */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  placeholder="Search by Player ID or name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
              <span className="text-muted-foreground font-body text-sm">
                {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredPlayers.length === 0 ? (
              <p className="text-muted-foreground font-body text-center py-12">
                No players yet. Create one above.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left font-body text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">#</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Player ID</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Player Name</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Fee Status</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((p, i) => (
                      <tr key={p.id} className="border-t border-border hover:bg-muted/50 transition">
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-primary tracking-wider">
                          {p.player_id}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === p.player_id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-3 py-1.5 rounded-md border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition w-full max-w-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(p.player_id)}
                                className="w-7 h-7 rounded-md bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="w-7 h-7 rounded-md bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-medium text-foreground">{p.player_name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleFeeStatus(p.player_id, p.fee_status)}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                              p.fee_status === "paid"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {p.fee_status.toUpperCase()}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          {editingId !== p.player_id && (
                            <button
                              onClick={() => startEdit(p)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit Name
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
