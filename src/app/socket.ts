import { io } from "socket.io-client";

export const createSocket = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return io(process.env.NEXT_PUBLIC_API_URL, {
    auth: {
      token,
    },
    withCredentials: true,
  });
};