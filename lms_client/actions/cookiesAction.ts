"use server";

import { cookies } from "next/headers";

export async function refreshCreate(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", token);
}

export async function refreshDelete() {
  (await cookies()).delete("refreshToken");
}

export async function deleteAllCookies() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}
