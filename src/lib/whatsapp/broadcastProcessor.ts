import { prisma } from "@/lib/prisma";
import {
  sendBroadcastImageMessage,
  sendBroadcastTextMessage,
} from "./broadcast";

export async function processBroadcast(broadcastId: number) {
  // 1. Get broadcast details
  const broadcast = await prisma.broadcast.findUnique({
    where: {
      id: broadcastId,
    },
  });

  if (!broadcast) {
    throw new Error("Broadcast not found.");
  }

  // 2. Get all pending recipients
  const recipients = await prisma.broadcastRecipient.findMany({
    where: {
      broadcastId,
      status: "PENDING",
    },
  });

  let successCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    try {
      let response;

      if (broadcast.imageUrl) {
        response = await sendBroadcastImageMessage(
          recipient.phone,
          broadcast.message,
          broadcast.imageUrl,
        );
      } else {
        response = await sendBroadcastTextMessage(
          recipient.phone,
          broadcast.message,
        );
      }

      await prisma.broadcastRecipient.update({
        where: {
          id: recipient.id,
        },
        data: {
          status: "SENT",
          messageId: response.messages?.[0]?.id ?? null,
          sentAt: new Date(),
        },
      });

      successCount++;
    } catch (error) {
      console.error(`Failed to send to ${recipient.phone}:`, error);

      await prisma.broadcastRecipient.update({
        where: {
          id: recipient.id,
        },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });

      failedCount++;
    }
  }

  await prisma.broadcast.update({
    where: {
      id: broadcastId,
    },
    data: {
      successCount,
      failedCount,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });
}
