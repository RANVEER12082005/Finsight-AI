import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTransactionsPDF(transactions: any[], accountName: string) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  // ── Header background
  doc.setFillColor(7, 13, 31);
  doc.rect(0, 0, 210, 40, "F");

  // ── Logo circle
  doc.setFillColor(59, 130, 246);
  doc.circle(20, 20, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FS", 16.5, 23);

  // ── Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FinSight AI", 33, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("AI-Powered Finance Management", 33, 25);

  // ── Report title
  doc.setFontSize(10);
  doc.setTextColor(96, 165, 250);
  doc.text("TRANSACTION REPORT", 33, 33);

  // ── Account info box
  doc.setFillColor(241, 245, 255);
  doc.roundedRect(14, 48, 182, 24, 3, 3, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`Account: ${accountName}`, 20, 57);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${date}`, 20, 65);
  doc.text(`Total Transactions: ${transactions.length}`, 120, 65);

  // ── Summary stats
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  // Income box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, 78, 56, 20, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(34, 197, 94);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL INCOME", 18, 86);
  doc.setFontSize(11);
  doc.text(`+Rs.${income.toLocaleString("en-IN")}`, 18, 94);

  // Expense box
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(77, 78, 56, 20, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(239, 68, 68);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL EXPENSES", 81, 86);
  doc.setFontSize(11);
  doc.text(`-Rs.${expense.toLocaleString("en-IN")}`, 81, 94);

  // Net box
  doc.setFillColor(net >= 0 ? 240 : 254, net >= 0 ? 249 : 242, net >= 0 ? 255 : 242);
  doc.roundedRect(140, 78, 56, 20, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(net >= 0 ? 59 : 239, net >= 0 ? 130 : 68, net >= 0 ? 246 : 68);
  doc.setFont("helvetica", "bold");
  doc.text("NET BALANCE", 144, 86);
  doc.setFontSize(11);
  doc.text(`${net >= 0 ? "+" : "-"}Rs.${Math.abs(net).toLocaleString("en-IN")}`, 144, 94);

  // ── Category breakdown
  const categoryTotals: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const topCategories = Object.entries(categoryTotals)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 4);

  if (topCategories.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Top Spending Categories", 14, 110);

    topCategories.forEach(([cat, amt], i) => {
      const x = 14 + i * 47;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, 114, 43, 14, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text(cat.toUpperCase(), x + 3, 120);
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs.${Number(amt).toLocaleString("en-IN")}`, x + 3, 126);
    });
  }

  // ── Transactions table
  const tableData = transactions.map((tx) => [
    new Date(tx.date).toLocaleDateString("en-IN"),
    tx.description.length > 25 ? tx.description.substring(0, 25) + "..." : tx.description,
    tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
    tx.category.charAt(0).toUpperCase() + tx.category.slice(1),
    `${tx.type === "income" ? "+" : "-"}Rs.${tx.amount.toLocaleString("en-IN")}`,
  ]);

  autoTable(doc, {
    startY: topCategories.length > 0 ? 135 : 110,
    head: [["Date", "Description", "Type", "Category", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [7, 13, 31],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 65 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 35, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === "body") {
        const val = data.cell.raw as string;
        if (val.startsWith("+")) {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = "bold";
        } else if (val.startsWith("-")) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        }
      }
      if (data.column.index === 2 && data.section === "body") {
        const val = data.cell.raw as string;
        if (val === "Income") {
          data.cell.styles.textColor = [22, 163, 74];
        } else {
          data.cell.styles.textColor = [220, 38, 38];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(7, 13, 31);
    doc.rect(0, 285, 210, 12, "F");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text("FinSight AI — Your Money, Finally Thinking For Itself", 14, 292);
    doc.text(`Page ${i} of ${pageCount}`, 185, 292);
  }

  doc.save(`FinSight-Transactions-${accountName}-${new Date().toISOString().split("T")[0]}.pdf`);
}
