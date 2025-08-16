import { sql } from "./db"
import type { Post } from "./auth"

export async function getAllPosts(page = 1, limit = 10, search?: string): Promise<{ posts: Post[]; total: number }> {
  const offset = (page - 1) * limit

  try {
    let posts, totalResult

    if (search) {
      posts = await sql`
        SELECT p.*, u.username as author_name
        FROM public.posts p
        JOIN public.users u ON p.author_id = u.id
        WHERE p.title ILIKE ${"%" + search + "%"}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      totalResult = await sql`
        SELECT COUNT(*) as count
        FROM public.posts p
        WHERE p.title ILIKE ${"%" + search + "%"}
      `
    } else {
      posts = await sql`
        SELECT p.*, u.username as author_name
        FROM public.posts p
        JOIN public.users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      totalResult = await sql`SELECT COUNT(*) as count FROM public.posts`
    }

    return {
      posts: posts as Post[],
      total: Number.parseInt(totalResult[0].count),
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], total: 0 }
  }
}

export async function getPostById(id: number): Promise<Post | null> {
  try {
    const posts = await sql`
      SELECT p.*, u.username as author_name
      FROM public.posts p
      JOIN public.users u ON p.author_id = u.id
      WHERE p.id = ${id}
      LIMIT 1
    `

    return (posts[0] as Post) || null
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

export async function createPost(title: string, content: string, authorId: number): Promise<Post | null> {
  try {
    const posts = await sql`
      INSERT INTO public.posts (title, content, author_id)
      VALUES (${title}, ${content}, ${authorId})
      RETURNING *
    `

    if (posts[0]) {
      return await getPostById(posts[0].id)
    }

    return null
  } catch (error) {
    console.error("Error creating post:", error)
    return null
  }
}

export async function updatePost(id: number, title: string, content: string, authorId: number): Promise<Post | null> {
  try {
    const posts = await sql`
      UPDATE public.posts 
      SET title = ${title}, content = ${content}, updated_at = NOW()
      WHERE id = ${id} AND author_id = ${authorId}
      RETURNING *
    `

    if (posts[0]) {
      return await getPostById(posts[0].id)
    }

    return null
  } catch (error) {
    console.error("Error updating post:", error)
    return null
  }
}

export async function deletePost(id: number, authorId: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM public.posts 
      WHERE id = ${id} AND author_id = ${authorId}
    `

    return result.length > 0
  } catch (error) {
    console.error("Error deleting post:", error)
    return false
  }
}
