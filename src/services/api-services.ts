
import { apiHandler } from "@/utils/api-handler";
import { SignInData, SignUpData } from "@/lib/interface";


export async function signIn(data: SignInData) {
  return apiHandler("/api/auth/signin", {
    method: "POST",
    body: data,
  });
}

export async function signUp(data: SignUpData) {
  return apiHandler("/api/auth/signup", {
    method: "POST",
    body: data,
  });
}
