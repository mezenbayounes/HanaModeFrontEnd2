import axios from "axios";
import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/auth`;

export const forgotPassword = async (email: string) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = async (data: { email: string; otp: string; newPassword: string; confirmPassword: string }) => {
  return axios.post(`${API_URL}/reset-password`, data);
};
