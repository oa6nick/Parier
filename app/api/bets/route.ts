import { NextResponse } from "next/server";
import { addCreatedBet } from "@/lib/mockData/createdBetsStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      shortDescription,
      fullDescription,
      outcome,
      categoryId,
      betAmount,
      coefficient,
      deadline,
      eventDate,
      verificationSource,
      authorId,
    } = body;

    if (!title || !shortDescription || !outcome || !categoryId || !betAmount || !coefficient || !deadline || !verificationSource) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const betId = await addCreatedBet({
      title: String(title).trim(),
      shortDescription: String(shortDescription).trim(),
      fullDescription: String(fullDescription || "").trim(),
      outcome: String(outcome).trim(),
      categoryId: String(categoryId),
      betAmount: Number(betAmount),
      coefficient: Number(coefficient),
      deadline: String(deadline),
      eventDate: eventDate ? String(eventDate) : undefined,
      verificationSource: String(verificationSource).trim(),
      authorId: String(authorId || "1"),
    });

    return NextResponse.json({ id: betId });
  } catch (error) {
    console.error("Create bet error:", error);
    return NextResponse.json(
      { error: "Failed to create bet" },
      { status: 500 }
    );
  }
}
