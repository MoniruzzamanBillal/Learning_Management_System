import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string) => {
  return jwtDecode(token);
};

// Alternative decoding function (manual base64 decoding)
export function decodeJWT(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (error) {
    console.error("Failed to decode JWT manually:", error);
    return null;
  }
}
