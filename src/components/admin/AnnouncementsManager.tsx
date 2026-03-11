import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Megaphone, Plus, Pencil, Trash2, Check, X } from "lucide-react";

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const { error } = await supabase.from("announcements").insert({ title: title.trim(), content: content.trim() });
    if (error) {
      toast.error("Failed to create announcement");
    } else {
      toast.success("Announcement created");
      setTitle("");
      setContent("");
      fetchAnnouncements();
    }
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setEditTitle(a.title);
    setEditContent(a.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("announcements")
      .update({ title: editTitle.trim(), content: editContent.trim(), updated_at: new Date().toISOString() })
      .eq("id", editingId);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success("Announcement updated");
      setEditingId(null);
      fetchAnnouncements();
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Announcement deleted");
      fetchAnnouncements();
    }
  };

  return (
    <div className="space-y-6">
      {/* Create form */}
      <form onSubmit={create} className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h2 className="font-display text-xl text-foreground tracking-wide flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" /> New Announcement
        </h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Announcement content..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
        />
        <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-body font-bold text-sm hover:bg-primary/90 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Publish
        </button>
      </form>

      {/* List */}
      {announcements.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-card rounded-xl border border-border p-5">
              {editingId === a.id ? (
                <div className="space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                    autoFocus
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-3 py-1.5 rounded-md bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-body text-base font-semibold text-foreground">{a.title}</h3>
                      <p className="text-muted-foreground font-body text-sm mt-1 whitespace-pre-wrap">{a.content}</p>
                      <p className="text-muted-foreground font-body text-xs mt-2">
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit(a)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition text-muted-foreground hover:text-foreground">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteAnnouncement(a.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;
