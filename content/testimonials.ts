import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { Testimonial } from "../shared/types";

// Database for content management
const db = new SQLDatabase("content", {
  migrations: "./migrations",
});

interface CreateTestimonialRequest {
  name: string;
  age?: number;
  content: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

interface UpdateTestimonialRequest {
  id: number;
  name?: string;
  age?: number;
  content?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

interface GetTestimonialsResponse {
  testimonials: Testimonial[];
  total: number;
}

/**
 * Get all active testimonials (public)
 */
export const getTestimonials = api(
  { expose: true, method: "GET", path: "/testimonials" },
  async (): Promise<GetTestimonialsResponse> => {
    const result = await db.query`
      SELECT
        id,
        name,
        age,
        content,
        image_url,
        is_active,
        display_order,
        created_at
      FROM testimonials
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      testimonials: result.rows as Testimonial[],
      total: result.rows.length,
    };
  }
);

/**
 * Get all testimonials including inactive (admin only)
 * TODO: Add authentication middleware
 */
export const getAllTestimonials = api(
  { expose: true, method: "GET", path: "/admin/testimonials" },
  async (): Promise<GetTestimonialsResponse> => {
    const result = await db.query`
      SELECT
        id,
        name,
        age,
        content,
        image_url,
        is_active,
        display_order,
        created_at
      FROM testimonials
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      testimonials: result.rows as Testimonial[],
      total: result.rows.length,
    };
  }
);

/**
 * Create a new testimonial (admin only)
 * TODO: Add authentication middleware
 */
export const createTestimonial = api(
  { expose: true, method: "POST", path: "/admin/testimonials" },
  async (req: CreateTestimonialRequest): Promise<Testimonial> => {
    // Validation
    if (!req.name || req.name.trim().length < 2) {
      throw APIError.invalidArgument("Name must be at least 2 characters");
    }

    if (!req.content || req.content.trim().length < 10) {
      throw APIError.invalidArgument("Content must be at least 10 characters");
    }

    const result = await db.exec`
      INSERT INTO testimonials (name, age, content, image_url, is_active, display_order)
      VALUES (
        ${req.name},
        ${req.age || null},
        ${req.content},
        ${req.image_url || null},
        ${req.is_active !== undefined ? req.is_active : true},
        ${req.display_order || 0}
      )
      RETURNING id, name, age, content, image_url, is_active, display_order, created_at
    `;

    return result.rows[0] as Testimonial;
  }
);

/**
 * Update a testimonial (admin only)
 * TODO: Add authentication middleware
 */
export const updateTestimonial = api(
  { expose: true, method: "PATCH", path: "/admin/testimonials/:id" },
  async (req: UpdateTestimonialRequest): Promise<Testimonial> => {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (req.name !== undefined) {
      updates.push("name = $" + (values.length + 1));
      values.push(req.name);
    }
    if (req.age !== undefined) {
      updates.push("age = $" + (values.length + 1));
      values.push(req.age);
    }
    if (req.content !== undefined) {
      updates.push("content = $" + (values.length + 1));
      values.push(req.content);
    }
    if (req.image_url !== undefined) {
      updates.push("image_url = $" + (values.length + 1));
      values.push(req.image_url);
    }
    if (req.is_active !== undefined) {
      updates.push("is_active = $" + (values.length + 1));
      values.push(req.is_active);
    }
    if (req.display_order !== undefined) {
      updates.push("display_order = $" + (values.length + 1));
      values.push(req.display_order);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    values.push(req.id);

    const result = await db.query`
      UPDATE testimonials
      SET ${updates.join(", ")}
      WHERE id = ${req.id}
      RETURNING id, name, age, content, image_url, is_active, display_order, created_at
    `;

    if (result.rows.length === 0) {
      throw APIError.notFound("Testimonial not found");
    }

    return result.rows[0] as Testimonial;
  }
);

/**
 * Delete a testimonial (admin only)
 * TODO: Add authentication middleware
 */
export const deleteTestimonial = api(
  { expose: true, method: "DELETE", path: "/admin/testimonials/:id" },
  async ({ id }: { id: number }): Promise<{ success: boolean }> => {
    const result = await db.exec`
      DELETE FROM testimonials
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      throw APIError.notFound("Testimonial not found");
    }

    return { success: true };
  }
);
