import { prisma } from "@/lib/prisma";
import { sendBroadcastTemplateMessage } from "./broadcast";
import {
  buildBroadcastImageTemplate,
  buildBroadcastTextTemplate,
} from "./messages";

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
      // menmai_broadcast_image / menmai_broadcast_text both take the
      // free-text `broadcast.message` as body variable {{1}} — that's
      // fine because these templates were approved with a generic {{1}}
      // slot, unlike a "catch-all" template Meta would normally reject.
      const tpl = broadcast.imageUrl
        ? buildBroadcastImageTemplate(broadcast.message, broadcast.imageUrl)
        : buildBroadcastTextTemplate(broadcast.message);

      const response = await sendBroadcastTemplateMessage(
        recipient.phone,
        tpl.name,
        tpl.language,
        tpl.components,
      );

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
