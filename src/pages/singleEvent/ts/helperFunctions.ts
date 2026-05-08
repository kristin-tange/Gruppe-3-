// KRISTIN TANGE

import { users } from "./api";
/* HELPER FUNCTIONS  */

/* Get ID from window */
export const params = new URLSearchParams(window.location.search);
export const meetupId = Number(params.get("id"));

/* Get userName from userId */
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
