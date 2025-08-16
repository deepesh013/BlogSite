import { sql } from "./db";
import bcrypt from "bcryptjs";

export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const users = await sql`
      SELECT id, username, email, password_hash, created_at 
      FROM public.users 
      WHERE username = ${username}
      LIMIT 1
    `;

    if (users.length === 0) {
      console.log("[v0] User not found:", username);
      return null;
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log("[v0] Invalid password for user:", username);
      return null;
    }

    console.log("[v0] User authenticated successfully:", username);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM public.users 
      WHERE username = ${username} OR email = ${email}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      console.log("[v0] User already exists with username or email");
      return null;
    }

    // Hash the password before storing
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const users = await sql`
      INSERT INTO public.users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
      RETURNING id, username, email, created_at
    `;

    console.log("[v0] User created successfully:", username);
    return (users[0] as unknown as User) || null;
  } catch (error) {
    console.error("User creation error:", error);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await sql`
      SELECT id, username, email, created_at 
      FROM public.users 
      WHERE id = ${id}
      LIMIT 1
    `;

    return users[0] as unknown as  User || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
