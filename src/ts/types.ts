export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  description: string;
  password: string;
  email: string;
  gender: string;
  image: string;
}

export type LoginUser = Pick<User, "id" | "email">;

export interface Meetup {
  id: number;
  name: string;
  date: string;
  summary: string;
  location: string;
  description: string;
  tags: string[];
  category: string;
  price: string;
  image: string;
  imageAlt?: string;
  created: string;
  updated: string;
}

export interface Post {
  id: number;
  meetupId: number;
  userId: number;
  postName: string;
  text: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  created: string;
  updated: string;
}

export interface Comment {
  id: number;
  userId: number;
  comment: string;
  created: string;
}

export interface Folder {
  id: number
  name: string
  events: number[]
  userId: number
  created: string
  updated: string
}

