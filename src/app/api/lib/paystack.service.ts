/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";

export interface PaystackInitRequest {
  email: string;
  amount: number; // in Naira (we will convert to kobo)
  callback_url: string;
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: "success" | "failed" | "abandoned";
    reference: string;
    domain: string;
    gateway_response: string;
    channel: string;
    ip_address: string;
    metadata: any;
    fees: number;
  };
}

export class PaystackService {
  private baseUrl = "https://api.paystack.co";
  private secretKey = process.env.PAYSTACK_SECRET_KEY as string;

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
    };
  }

  /** Initialize a new transaction */
  async initializeTransaction(payload: PaystackInitRequest): Promise<PaystackInitResponse["data"]> {
    const res = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: payload.email,
        amount: payload.amount * 100, // convert Naira to Kobo
        callback_url: payload.callback_url,
      }),
    });

    const data: PaystackInitResponse = await res.json() as any;
    if (!data.status) {
      throw new Error(`Paystack init failed: ${data.message}`);
    }
    return data.data;
  }

  /** Verify a transaction */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse["data"]> {
    const res = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data: PaystackVerifyResponse = await res.json() as any;
    if (!data.status) {
      throw new Error(`Paystack verification failed: ${data.message}`);
    }
    return data.data;
  }
}
