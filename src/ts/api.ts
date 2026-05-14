import type { Meetup, User } from "./types";
import { BASE_URL } from "./config";

export let users: User[] = [];
export let meetups: Meetup[] = [];

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

export async function fetchMeetups(): Promise<Meetup[]> {
  try {
    const response = await fetch(`${BASE_URL}/meetups`);

    const data = await response.json();
    meetups = data;
    return meetups;
  } catch (error) {
    console.error("Error fetching meetups:", error);
    throw error;
  }
}
