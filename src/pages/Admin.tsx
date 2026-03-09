import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, LogOut, Users, Search } from "lucide-react";

const ADMIN_PASSWORD = "shah2026";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
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

  useEffect(() => {
    if (!authenticated) return;
    const fetchRegistrations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      setLoading(false);
      if (error) {
        toast.error("Failed to load registrations");
        console.error(error);
      } else {
        setRegistrations(data || []);
      }
    };
    fetchRegistrations();
  }, [authenticated]);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
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
            <p className="text-muted-foreground text-sm text-center">
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
      <header className="bg-secondary px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl text-secondary-foreground tracking-wide">
            Registered Students
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-secondary-foreground/60 hover:text-secondary-foreground transition font-body text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
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
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-t border-border hover:bg-muted/50 transition"
                  >
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
      </div>
    </div>
  );
};

export default Admin;
