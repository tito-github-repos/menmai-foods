import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * Call this when an order is marked as DELIVERED.
 * Creates a ReviewRequest token scheduled 30 minutes later.
 *
 * Usage:
 *   import { createReviewRequest } from "@/lib/reviews";
 *   await createReviewRequest(orderId);
 *
 * The token link:
 *   https://menmaifoods.com/review/<token>
 *
 * When WhatsApp is ready, your cron/scheduler reads ReviewRequests
 * where status = "SCHEDULED" and scheduledAt <= now, sends the WA
 * message with the link, then marks status = "SENT".
 */
export async function createReviewRequest(orderId: number): Promise<string> {
  // Don't create duplicate if one already exists for this order
  const existing = await prisma.reviewRequest.findUnique({
    where: { orderId },
  });

  if (existing) {
    return existing.token!;
  }

  const token = crypto.randomUUID();

  const scheduledAt = new Date();
  scheduledAt.setMinutes(scheduledAt.getMinutes() + 30); // 30 min after delivery

  await prisma.reviewRequest.create({
    data: {
      orderId,
      token,
      scheduledAt,
      status: "SCHEDULED",
    },
  });

  return token;
}