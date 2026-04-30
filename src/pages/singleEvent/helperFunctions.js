// KRISTIN TANGE

/* HELPER FUNCTIONS  */
/* Get ID from window */
export const params = new URLSearchParams(window.location.search);
export const meetupId = params.get("id");

/* Get userName from userId */
export function getUserName(userId) {
  const user = users.find((u) => u.id == userId);
  return user ? user.userName : "Ukjent forfatter";
}

export function formatDate(data) {
  const date = new Date(data);
  return date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(data) {
  const time = new Date(data);
  return time.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
