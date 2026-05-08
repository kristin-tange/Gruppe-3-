// KRISTIN TANGE

import { users } from "./api";
/* HELPER FUNCTIONS  */

/* Get ID from window */
export const params = new URLSearchParams(window.location.search);
export const meetupId = Number(params.get("id"));

/* Get userName from userId */
export function getUserName(userId: number): string {
  const user = users.find((u) => u.id === userId);
  return user ? user.firstName : "Ukjent forfatter";
}

export function getProfilePicture(userId: number) {
  const user = users.find((u) => u.id === userId);

  if (user?.gender === "mann" || user?.gender === "male") {
    return "/assets/img/profilepictureman.png";
  } else if (user?.gender === "kvinne") {
    return "/assets/img/profilepicturewoman.jpeg";
  } else {
    return "/assets/img/placeholder-profile.png";
  }
}

export function formatDate(data: string) {
  const date = new Date(data);
  return date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(data: string) {
  const time = new Date(data);
  return time.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
