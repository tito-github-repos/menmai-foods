import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const MAX_TOTAL_REVIEWS = 16; // overall cap, not tied to any grid size

function getWordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function rankByWordsThenRecency<T extends { comment: string | null; createdAt: Date }>(
  list: T[],
) {
  return [...list].sort((a, b) => {
    const wcA = getWordCount(a.comment ?? "");
    const wcB = getWordCount(b.comment ?? "");
    if (wcB !== wcA) return wcB - wcA;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        isApproved: true,
        rating: { gte: 4 },
        comment: { not: null },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Customer: {
          select: {
            fullName: true,
          },
        },
        Order: {
          select: {
            CustomerAddress: {
              select: {
                city: true,
                pincode: true,
              },
            },
          },
        },
      },
    });

    // One review per customer — keep their BEST (longest, most detailed)
    // review, not just their most recent. A customer's newest review might
    // just say "Good", while an older one from them was a full paragraph —
    // we don't want to lose that one.
    const customerMap = new Map<number, (typeof reviews)[number]>();
    for (const review of reviews) {
      const comment = review.comment?.trim() ?? "";
      if (!comment) continue;

      const existing = customerMap.get(review.customerId);
      if (!existing) {
        customerMap.set(review.customerId, review);
        continue;
      }

      const existingWords = getWordCount(existing.comment ?? "");
      const currentWords = getWordCount(comment);
      if (currentWords > existingWords) {
        customerMap.set(review.customerId, review);
      }
    }

    const allCandidates = Array.from(customerMap.values());

    // No time window — always rank purely by review quality (word count),
    // recency only as a tiebreaker. This recomputes on every request, so
    // it naturally reflects new reviews the moment they're approved.
    const finalList = rankByWordsThenRecency(allCandidates).slice(0, MAX_TOTAL_REVIEWS);

    const formatted = finalList.map((review) => ({
      id: review.id,
      name: review.Customer.fullName,
      rating: review.rating,
      comment: review.comment?.trim() ?? "",
      createdAt: review.createdAt,
      city: review.Order?.CustomerAddress?.city ?? null,
      pincode: review.Order?.CustomerAddress?.pincode ?? null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Featured reviews error:", error);
    return NextResponse.json([], { status: 500 });
  }
}