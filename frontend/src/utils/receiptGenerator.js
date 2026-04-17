import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAndDownloadReceipt = (transactionData) => {
    const {
        id = `TXN-${Math.floor(Math.random() * 1000000)}`,
        date = new Date().toLocaleDateString(),
        description = 'Booking Payment',
        amount = 0,
        status = 'Completed',
        customerName = 'Valued Customer',
        method = 'Card',
        subItems = null // Array of { label: string, amount: number }
    } = transactionData;

    // Initialize PDF
    const doc = new jsPDF();

    // Theme colors
    const primaryColor = [15, 118, 110]; // #0f766e
    const textColor = [30, 41, 59]; // #1e293b
    const lightText = [100, 116, 139]; // #64748b

    // Header Left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("WanderLanka", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...lightText);
    doc.text("Payment Receipt", 14, 32);

    // Header Right
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.text("INVOICE", 196, 25, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...lightText);
    doc.text(`#${id}`, 196, 32, { align: "right" });

    // Header line separator
    doc.setDrawColor(226, 232, 240); // #e2e8f0
    doc.line(14, 40, 196, 40);

    // Payment Details Grid
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO", 14, 52);
    doc.text("DATE PAID", 100, 52);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    if (customerName) doc.text(customerName.toString(), 14, 58);
    if (date) doc.text(date.toString(), 100, 58);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...lightText);
    doc.text("PAYMENT METHOD", 14, 68);
    doc.text("STATUS", 100, 68);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    if (method) doc.text(method.toString(), 14, 74);

    // Status with color
    if (status === 'Completed' || status === 'COMPLETED' || status === 'SUCCESS') {
        doc.setTextColor(5, 150, 105); // Green
    } else {
        doc.setTextColor(225, 29, 72); // Red
    }
    if (status) doc.text(status.toString(), 100, 74);

    // Items Table
    const tableBody = [];

    // Use subItems if provided for a detailed breakdown, otherwise just the root description
    if (subItems && subItems.length > 0) {
        subItems.forEach(item => {
            tableBody.push([
                item.label,
                `$${parseFloat(item.amount).toFixed(2)}`
            ]);
        });
    } else {
        tableBody.push([
            description,
            `$${parseFloat(amount).toFixed(2)}`
        ]);
        tableBody.push([
            { content: 'Thank you for your booking!', styles: { textColor: [100, 116, 139], fontStyle: 'italic', fontSize: 9 } },
            ''
        ]);
    }

    autoTable(doc, {
        startY: 90,
        head: [['Description', 'Amount']],
        body: tableBody,
        theme: 'plain',
        headStyles: {
            textColor: [100, 116, 139],
            fontSize: 10,
            fontStyle: 'bold',
            cellPadding: { top: 5, bottom: 5 }
        },
        bodyStyles: {
            textColor: [30, 41, 59],
            fontSize: 11,
            cellPadding: { top: 6, bottom: 6 }
        },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 40, halign: 'right' }
        },
        willDrawCell: function (data) {
            // Add a bottom border to all rows
            if (data.row.section === 'body') {
                doc.setDrawColor(241, 245, 249);
                doc.line(
                    data.cursor.x,
                    data.cursor.y + data.row.height,
                    data.cursor.x + data.column.width,
                    data.cursor.y + data.row.height
                );
            }
        }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY || 130;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...lightText);
    doc.text("Subtotal:", 140, finalY + 15);

    doc.setTextColor(...textColor);
    doc.text(`$${parseFloat(amount).toFixed(2)}`, 196, finalY + 15, { align: "right" });

    // Total Paid Row
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, finalY + 22, 196, finalY + 22);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Total Paid", 14, finalY + 32);
    doc.text(`$${parseFloat(amount).toFixed(2)}`, 196, finalY + 32, { align: "right" });

    // Footer
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setDrawColor(226, 232, 240);
    doc.setLineDash([2, 2]);
    doc.line(14, pageHeight - 35, 196, pageHeight - 35);
    doc.setLineDash([]);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...lightText);
    const footerText1 = "If you have any questions concerning this invoice, contact our support at support@wanderlanka.com.";
    const footerText2 = "Thank you for your business!";

    doc.text(footerText1, 105, pageHeight - 22, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(footerText2, 105, pageHeight - 15, { align: "center" });

    // Download the PDF
    doc.save(`Receipt_${id}.pdf`);
};
