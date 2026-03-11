import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  data: any[];
}

const formatRow = (r: any) => ({
  "Player ID": r.player_id || "",
  "Student Name": r.student_name,
  Age: r.age,
  "Parent Name": r.parent_name,
  Phone: r.phone,
  Email: r.email,
  Batch: r.batch === "below_14" ? "Below 14" : "Above 14",
  "Registration Date": new Date(r.created_at).toLocaleDateString(),
});

const ExportButtons = ({ data }: ExportButtonsProps) => {
  const rows = data.map(formatRow);

  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "registrations.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Shah Basketball Academy — Registrations", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    const headers = Object.keys(rows[0] || {});
    const body = rows.map((r) => headers.map((h) => String((r as any)[h] ?? "")));

    autoTable(doc, {
      head: [headers],
      body,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [230, 126, 34] },
    });

    doc.save("registrations.pdf");
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={exportXLSX} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-foreground font-body text-xs font-semibold hover:bg-muted transition">
        <Download className="w-3.5 h-3.5" /> Excel
      </button>
      <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-foreground font-body text-xs font-semibold hover:bg-muted transition">
        <Download className="w-3.5 h-3.5" /> CSV
      </button>
      <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-foreground font-body text-xs font-semibold hover:bg-muted transition">
        <Download className="w-3.5 h-3.5" /> PDF
      </button>
    </div>
  );
};

export default ExportButtons;
