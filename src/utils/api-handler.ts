import axios from "axios";

interface AxiosOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any | null;
  [key: string]: any;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ✅ ensure axios always handles cookies
axios.defaults.withCredentials = true;

export async function apiHandler(
  path: string,
  { method = "GET", headers = {}, body = null, ...otherOptions }: AxiosOptions = {}
) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const response = await axios({
      url: `${BASE_URL}${path}`, // relative path → works on Vercel + local
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      data: body,
      withCredentials: true, // 🔑 important for cookies
      ...otherOptions,
    });

    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
      throw {
        status: error.response.status,
        message: error.response.data?.error || error.response.data?.message || "An error occurred",
      };
    }
    throw new Error(error.message || "Network error");
  }
}
