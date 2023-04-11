import axios, { AxiosError } from "axios";

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const response = await axios.post("/api/auth/signup", { email, password });
    return response.data;
  } catch (error: AxiosError) {
    if (error.response?.status === 409) {
      throw new Error("A user with this email already exists");
    } else {
      throw new Error("Error creating user");
    }
  }
};