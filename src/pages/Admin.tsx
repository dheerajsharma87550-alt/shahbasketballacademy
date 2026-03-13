import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, LogOut, Users, Search, Plus, Pencil, Check, X, IdCard, Trash2, Megaphone, AlertTriangle } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import StatsCards from "@/components/admin/StatsCards";
import ExportButtons from "@/components/admin/ExportButtons";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";

type BatchFilter = "all" | "below_14" | "above_14";
type TabType = "registrations" | "players" | "announcements";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [tab, setTab] = useState<TabType>("registrations");
  const [batchFilter, setBatchFilter] = useState<BatchFilter>("all");

  const [newPlayerId, setNewPlayerId] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setAuthLoading(false);
    if (error) toast.error("Invalid credentials");
    else toast.success("Welcome, Admin!");
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
  };

  // --- Registrations helpers ---
  const filteredRegs = registrations
    .filter((r) => batchFilter === "all" || r.batch === batchFilter)
    .filter(
      (r) =>
        r.student_name.toLowerCase().includes(search.toLowerCase()) ||
        r.parent_name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search)
    );

  // Merge player_id into registration rows for export
  const regsWithPlayerId = filteredRegs.map((r) => {
    const player = players.find(
      (p) => p.player_name.toLowerCase() === r.student_name.toLowerCase()
    );
    return { ...r, player_id: player?.player_id || "" };
  });

  const deleteRegistration = async (reg: any) => {
    if (!confirm(`Are you sure you want to delete this registration for "${reg.student_name}"?`)) return;
    const { error } = await supabase.from("registrations").delete().eq("id", reg.id);
    if (error) {
      toast.error("Failed to delete registration");
      return;
    }
    // Also delete linked player if name matches
    const linked = players.find(
      (p) => p.player_name.toLowerCase() === reg.student_name.toLowerCase()
    );
    if (linked) {
      await supabase.from("players").delete().eq("id", linked.id);
    }
    toast.success("Registration deleted");
    fetchData();
  };

  // --- Player helpers ---
  const filteredPlayers = players.filter(
    (p) =>
      p.player_id.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.player_name.toLowerCase().includes(playerSearch.toLowerCase())
  );

  const createPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = newPlayerId.trim().toUpperCase();
    const name = newPlayerName.trim();
    if (!id || !name) { toast.error("Player ID and Name are required"); return; }
    const { error } = await supabase.from("players").insert({ player_id: id, player_name: name, fee_status: "unpaid" });
    if (error) {
      if (error.code === "23505") toast.error("Player ID already exists");
      else toast.error("Failed to create player");
    } else {
      toast.success(`Player ${id} created`);
      setNewPlayerId("");
      setNewPlayerName("");
      fetchData();
    }
  };

  const startEdit = (player: any) => { setEditingId(player.player_id); setEditName(player.player_name); };

  const saveEdit = async (playerId: string) => {
    const { error } = await supabase.from("players").update({ player_name: editName.trim() }).eq("player_id", playerId);
    if (error) toast.error("Failed to update name");
    else { toast.success("Player name updated"); setEditingId(null); fetchData(); }
  };

  const toggleFeeStatus = async (playerId: string, currentStatus: string) => {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
    const { error } = await supabase.from("players").update({ fee_status: newStatus }).eq("player_id", playerId);
    if (error) toast.error("Failed to update fee status");
    else { toast.success(`Fee status → ${newStatus.toUpperCase()}`); fetchData(); }
  };

  // --- Auth screens ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <AppSidebar />
        <p className="text-muted-foreground font-body">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <AppSidebar />
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-background rounded-2xl p-8 shadow-lg space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl text-foreground tracking-wide">Admin Access</h1>
            <p className="text-muted-foreground text-sm text-center font-body">Sign in with your admin account</p>
          </div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring transition" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring transition" />
          <button type="submit" disabled={authLoading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-body font-bold hover:bg-primary/90 transition disabled:opacity-50">
            {authLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard ---
  const tabs: { key: TabType; label: string; icon: typeof Users }[] = [
    { key: "registrations", label: "Registrations", icon: Users },
    { key: "players", label: "Player IDs", icon: IdCard },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <header className="bg-secondary px-4 py-4 flex items-center justify-between sticky top-0 z-10 pl-16">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl text-secondary-foreground tracking-wide">Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-secondary-foreground/60 hover:text-secondary-foreground transition font-body text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <StatsCards registrations={registrations} players={players} />

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 font-body text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap ${
                tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && <p className="text-muted-foreground font-body text-center py-12">Loading...</p>}

        {/* ====== REGISTRATIONS TAB ====== */}
        {!loading && tab === "registrations" && (
          <>
            {/* Batch filter */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {([
                { key: "all", label: "All Players" },
                { key: "below_14", label: "Below 14" },
                { key: "above_14", label: "Above 14" },
              ] as { key: BatchFilter; label: string }[]).map((f) => (
                <button key={f.key} onClick={() => setBatchFilter(f.key)}
                  className={`px-4 py-2 rounded-lg font-body text-xs font-semibold transition ${
                    batchFilter === f.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search + Export */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition" />
              </div>
              <span className="text-muted-foreground font-body text-sm">{filteredRegs.length} student{filteredRegs.length !== 1 ? "s" : ""}</span>
              <ExportButtons data={regsWithPlayerId} />
            </div>

            {filteredRegs.length === 0 ? (
              <p className="text-muted-foreground font-body text-center py-12">No registrations found.</p>
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
                      <th className="px-4 py-3 font-semibold text-foreground">Registered</th>
                      <th className="px-4 py-3 font-semibold text-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegs.map((r, i) => {
                      const linkedPlayer = players.find(
                        (p) => p.player_name.toLowerCase() === r.student_name.toLowerCase()
                      );
                      return (
                      <tr key={r.id} className="border-t border-border hover:bg-muted/50 transition">
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-primary tracking-wider text-xs">{linkedPlayer?.player_id || "—"}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{r.student_name}</td>
                        <td className="px-4 py-3 text-foreground">{r.age}</td>
                        <td className="px-4 py-3 text-foreground">{r.parent_name}</td>
                        <td className="px-4 py-3 text-foreground">{r.phone}</td>
                        <td className="px-4 py-3 text-foreground">{r.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            r.batch === "below_14" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                          }`}>
                            {r.batch === "below_14" ? "Below 14" : "Above 14"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteRegistration(r)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ====== PLAYERS TAB ====== */}
        {!loading && tab === "players" && (
          <>
            <form onSubmit={createPlayer} className="bg-card rounded-xl border border-border p-5 mb-6 space-y-4">
              <h2 className="font-display text-xl text-foreground tracking-wide">Create New Player ID</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input value={newPlayerId} onChange={(e) => setNewPlayerId(e.target.value.toUpperCase())} placeholder="Player ID (e.g. SHA001)"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition tracking-widest" />
                <input value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Player Name"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition" />
                <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-body font-bold text-sm hover:bg-primary/90 transition flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={playerSearch} onChange={(e) => setPlayerSearch(e.target.value)} placeholder="Search by Player ID or name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition" />
              </div>
              <span className="text-muted-foreground font-body text-sm">{filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""}</span>
            </div>

            {filteredPlayers.length === 0 ? (
              <p className="text-muted-foreground font-body text-center py-12">No players yet. Create one above.</p>
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
                        <td className="px-4 py-3 font-mono font-bold text-primary tracking-wider">{p.player_id}</td>
                        <td className="px-4 py-3">
                          {editingId === p.player_id ? (
                            <div className="flex items-center gap-2">
                              <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus
                                className="px-3 py-1.5 rounded-md border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition w-full max-w-xs" />
                              <button onClick={() => saveEdit(p.player_id)} className="w-7 h-7 rounded-md bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-md bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-medium text-foreground">{p.player_name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleFeeStatus(p.player_id, p.fee_status)}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                              p.fee_status === "paid" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}>
                            {p.fee_status.toUpperCase()}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          {editingId !== p.player_id && (
                            <button onClick={() => startEdit(p)} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition">
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

        {/* ====== ANNOUNCEMENTS TAB ====== */}
        {!loading && tab === "announcements" && <AnnouncementsManager />}
      </div>
    </div>
  );
};

export default Admin;
