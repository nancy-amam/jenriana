import axios from "axios";

interface AxiosOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any | null;
  [key: string]: any;
}

// Empty BASE_URL means relative path
const BASE_URL = "";

export async function apiHandler(
  path: string,
  { method = "GET", headers = {}, body = null, ...otherOptions }: AxiosOptions = {}
) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const response = await axios({
      url: `${BASE_URL}${path}`, // e.g., "/api/apartment"
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
