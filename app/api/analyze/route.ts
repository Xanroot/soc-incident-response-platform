import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const _body = await req.json(); // intentionally unused (mock AI)

  const analysis = {
    verdict: "True Positive",
    risk: "High",
    mitre: ["T1566 (Phishing)", "T1059 (Command and Scripting)"],
    summary:
      "Indicators suggest a confirmed malicious activity. User interaction observed. Containment recommended.",
    recommendations: [
      "Isolate affected endpoint",
      "Reset user credentials",
      "Block sender/domain",
      "Hunt for similar indicators across environment",
    ],
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(analysis);
}
