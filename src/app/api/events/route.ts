/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/route.ts
import { NextRequest } from "next/server";
import eventBus from "../lib/eventBus";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const onEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // subscribe
      eventBus.on("activity", onEvent);

      // cleanup on close
      req.signal.addEventListener("abort", () => {
        eventBus.off("activity", onEvent);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
