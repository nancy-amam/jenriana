/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/analytics/events/route.ts
import eventBus from "@/app/api/lib/eventBus";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: any) => {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      // Listen for analytics events
      eventBus.on("analytics", send);

      // Cleanup
      controller.enqueue(new TextEncoder().encode(": connected\n\n"));
      return () => {
        eventBus.off("analytics", send);
      };
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
