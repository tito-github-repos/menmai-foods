import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { PrismaClient } from "@/generated/prisma";

export const runtime = "nodejs";

const prisma = new PrismaClient();

function formatMoney(value: number | null | undefined) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ orderRef: string }> }
) {
  const { orderRef } = await context.params;

  const order = await prisma.bulkOrder.findUnique({
    where: { orderRef },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { success: false, message: "Bulk order not found." },
      { status: 404 }
    );
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { height } = page.getSize();
  let y = height - 48;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size = 10,
    bold = false,
    color = rgb(0.08, 0.08, 0.08)
  ) => {
    page.drawText(text, {
      x,
      y: yPos,
      size,
      font: bold ? boldFont : font,
      color,
    });
  };

  // Header
  drawText("Menmai Bulk Order Quote", 40, y, 22, true, rgb(0.04, 0.35, 0.39));
  drawText("Fresh bulk food order quotation", 40, y - 18, 10, false, rgb(0.35, 0.35, 0.35));
  drawText("QUOTE - NOT A BILL", 420, y, 11, true, rgb(0.48, 0.23, 0.07));

  page.drawLine({
    start: { x: 40, y: y - 34 },
    end: { x: 555, y: y - 34 },
    thickness: 1.5,
    color: rgb(0.04, 0.35, 0.39),
  });

  // Watermark
  page.drawText("QUOTE - NOT A BILL", {
    x: 95,
    y: 390,
    size: 46,
    font: boldFont,
    color: rgb(0.9, 0.9, 0.9),
    rotate: degrees(-30),
  });

  y -= 70;

  const row = (label: string, value: string) => {
    drawText(label, 40, y, 10, true, rgb(0.35, 0.35, 0.35));
    drawText(value || "-", 165, y, 10);
    y -= 20;
  };

  row("Quote No", order.orderRef);
  row("Customer", order.customerName);
  row("Phone", order.phone);
  row("Email", order.email || "-");
  row("Event", order.occasion);
  row("Delivery Date", formatDate(order.deliveryDate));
  row("Delivery Slot", order.deliveryTime);
  row("Address", `${order.deliveryAddress} - ${order.pincode}`);

  y -= 10;

  drawText("Order Items", 40, y, 13, true, rgb(0.04, 0.35, 0.39));
  y -= 24;

  // Table header
  page.drawRectangle({
    x: 40,
    y: y - 6,
    width: 515,
    height: 24,
    color: rgb(0.96, 0.97, 0.97),
  });

  drawText("Item", 50, y, 10, true);
  drawText("Qty", 250, y, 10, true);
  drawText("Rate", 335, y, 10, true);
  drawText("Total", 445, y, 10, true);

  y -= 28;

  for (const item of order.items) {
    if (y < 130) break;

    page.drawRectangle({
      x: 40,
      y: y - 8,
      width: 515,
      height: 26,
      borderColor: rgb(0.86, 0.86, 0.86),
      borderWidth: 0.5,
    });

    drawText(item.productName.slice(0, 28), 50, y, 10);
    drawText(String(item.quantity), 250, y, 10);
    drawText(formatMoney(item.unitPrice), 335, y, 10);
    drawText(formatMoney(item.totalPrice), 445, y, 10);

    y -= 28;
  }

  y -= 12;

  const totalRow = (label: string, value: string, bold = false) => {
    drawText(label, 330, y, bold ? 12 : 10, bold);
    drawText(value, 455, y, bold ? 12 : 10, bold);
    y -= bold ? 22 : 18;
  };

  totalRow("Subtotal", formatMoney(order.subtotal));
  totalRow("Delivery Charge", formatMoney(order.deliveryCharge));

  page.drawLine({
    start: { x: 330, y },
    end: { x: 555, y },
    thickness: 1,
    color: rgb(0.04, 0.35, 0.39),
  });

  y -= 14;
  totalRow("Estimated Total", formatMoney(order.estimatedTotal), true);

  y -= 12;

  page.drawRectangle({
    x: 40,
    y: y - 36,
    width: 515,
    height: 46,
    color: rgb(1, 0.97, 0.9),
    borderColor: rgb(0.95, 0.84, 0.61),
    borderWidth: 1,
  });

  drawText(
    "This document is only a quote. It is not a bill, invoice, or payment receipt.",
    52,
    y - 8,
    10,
    true,
    rgb(0.48, 0.23, 0.07)
  );

  drawText(
    "Final confirmation will be done by Menmai admin.",
    52,
    y - 24,
    10,
    true,
    rgb(0.48, 0.23, 0.07)
  );

  const pdfBytes = await pdfDoc.save();
  const arrayBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="menmai-bulk-order-${order.orderRef}.pdf"`,
    },
  });
}