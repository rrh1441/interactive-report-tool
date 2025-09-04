import { NextResponse } from "next/server";
import { z } from "zod";

const FeedbackSchema = z.object({
  reportId: z.string().min(1),
  sectionId: z.string().optional(),
  sentiment: z.enum(["up", "down"]),
  comment: z.string().max(2000).optional()
});

// Mock storage - in production this would use a database
const feedbackStore: Array<{
  id: string;
  reportId: string;
  sectionId?: string;
  sentiment: string;
  comment?: string;
  userAgent?: string;
  createdAt: string;
}> = [];

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = FeedbackSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const ua = req.headers.get("user-agent") || "";

    const feedback = {
      id: Math.random().toString(36).substr(2, 9),
      reportId: parsed.data.reportId,
      sectionId: parsed.data.sectionId,
      sentiment: parsed.data.sentiment,
      comment: parsed.data.comment,
      userAgent: ua,
      createdAt: new Date().toISOString()
    };

    feedbackStore.push(feedback);
    console.log("Feedback received:", feedback);
    
    return NextResponse.json({ ok: true, id: feedback.id });
  } catch (e) {
    console.error("Feedback error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}