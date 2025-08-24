// types/events.ts
export type AnalyticsEvent =
  | { type: "APARTMENT_ADDED"; data: { name: string; location: string; time: Date } }
  | { type: "BOOKING_CONFIRMED"; data: { guest: string; amount: number; time: Date } }
  | { type: "USER_SIGNUP"; data: { email: string; time: Date } }
  | { type: "NEW_REVIEW"; data: { rating: number; apartment: string; time: Date } }
  | { type: "PAYMENT_PENDING"; data: { bookingId: string; time: Date } };
