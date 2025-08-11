import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AxiosOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any | null;
  [key: string]: any;
}

export async function apiHandler(
  path: string,
  { method = "GET", headers = {}, body = null, ...otherOptions }: AxiosOptions = {}
) {
  const url = `${BASE_URL}${path}`;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const response = await axios({
      url,
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      data: body,
      ...otherOptions,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        message:
          error.response.data?.error ||
          error.response.data?.message ||
          "An error occurred",
      };
    }
    throw new Error(error.message || "Network error");
  }
}
