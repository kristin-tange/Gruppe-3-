import type { User } from "./types";
import { BASE_URL } from "./config";

export let users: User[] = [];
// add let meetups ?
// Anything else that's global?

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/users`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente brukere: ${response.status}`);
    }

    users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
