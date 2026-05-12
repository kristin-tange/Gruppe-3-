// KRISTIN TANGE

import { users } from "./api";
import type { User } from "./types";

export const params = new URLSearchParams(window.location.search);
export const meetupId = Number(params.get("id"));

export function getUserName(userId: number): string {
  const user = users.find((u) => u.id === userId);
  return user ? user.username : "Ukjent";
}

export function getProfilePicture(userId: number): string {
  const user = users.find((u) => u.id === userId);
  return user ? user.image : "/assets/img/placeholder-profile.png";
}

export function formatDate(data: string): string {
  const date = new Date(data);
  return date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(data: string): string {
  const time = new Date(data);
  return time.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const currentUser: User | null = JSON.parse(
  localStorage.getItem("currentUser") ?? "null"
);

export const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
