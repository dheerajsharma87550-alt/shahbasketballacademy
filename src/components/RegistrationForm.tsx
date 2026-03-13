import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student_name: "",
    age: "",
    parent_name: "",
    phone: "",
    email: "",
    batch: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.student_name || !form.age || !form.parent_name || !form.phone || !form.email || !form.batch) {
      toast.error("Please fill in all fields");
      return;
    }

    const age = parseInt(form.age);
    if (isNaN(age) || age < 3 || age > 50) {
      toast.error("Please enter a valid age (3-50)");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("registrations").insert({
      student_name: form.student_name.trim(),
      age,
      parent_name: form.parent_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      batch: form.batch,
    });

    setLoading(false);

    if (error) {
      toast.error("Registration failed. Please try again.");
      if (import.meta.env.DEV) console.error(error);
    } else {
      toast.success("Registration successful! Welcome to Shah Basketball Academy 🏀");
      setForm({ student_name: "", age: "", parent_name: "", phone: "", email: "", batch: "" });
    }
  };

  return (
    <section id="register" className="py-20 px-4 bg-secondary">
      <div className="max-w-lg mx-auto">
        <h2 className="font-display text-5xl sm:text-6xl text-center text-secondary-foreground tracking-wide mb-2">
          Register <span className="text-primary">Now</span>
        </h2>
        <p className="text-center text-secondary-foreground/60 font-body mb-10">
          Fill out the form below to join Shah Basketball Academy.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="student_name"
            value={form.student_name}
            onChange={handleChange}
            placeholder="Student Full Name"
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 font-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            type="number"
            min={3}
            max={50}
            className="w-full px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 font-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            name="parent_name"
            value={form.parent_name}
            onChange={handleChange}
            placeholder="Parent Name"
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 font-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            type="tel"
            maxLength={15}
            className="w-full px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 font-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            maxLength={255}
            className="w-full px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 font-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option value="" disabled>
              Select Batch
            </option>
            <option value="below_14">Below 14 — 5:00 PM to 6:00 PM</option>
            <option value="above_14">Above 14 — 6:00 PM to 7:00 PM</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-body font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-[var(--shadow-elevated)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Submitting..." : "Register for Training"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;
