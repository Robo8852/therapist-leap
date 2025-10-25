import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { Service } from "../shared/types";

const db = new SQLDatabase("content", {
  migrations: "./migrations",
});

interface CreateServiceRequest {
  title: string;
  description: string;
  category: 'therapy' | 'treatment' | 'coaching' | 'other';
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

interface UpdateServiceRequest {
  id: number;
  title?: string;
  description?: string;
  category?: 'therapy' | 'treatment' | 'coaching' | 'other';
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

interface GetServicesResponse {
  services: Service[];
  total: number;
}

/**
 * Get all active services (public)
 */
export const getServices = api(
  { expose: true, method: "GET", path: "/services" },
  async (): Promise<GetServicesResponse> => {
    const result = await db.query`
      SELECT
        id,
        title,
        description,
        category,
        image_url,
        is_active,
        display_order,
        created_at
      FROM services
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      services: result.rows as Service[],
      total: result.rows.length,
    };
  }
);

/**
 * Get services by category (public)
 */
export const getServicesByCategory = api(
  { expose: true, method: "GET", path: "/services/category/:category" },
  async ({ category }: { category: string }): Promise<GetServicesResponse> => {
    const result = await db.query`
      SELECT
        id,
        title,
        description,
        category,
        image_url,
        is_active,
        display_order,
        created_at
      FROM services
      WHERE is_active = true AND category = ${category}
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      services: result.rows as Service[],
      total: result.rows.length,
    };
  }
);

/**
 * Get all services including inactive (admin only)
 * TODO: Add authentication middleware
 */
export const getAllServices = api(
  { expose: true, method: "GET", path: "/admin/services" },
  async (): Promise<GetServicesResponse> => {
    const result = await db.query`
      SELECT
        id,
        title,
        description,
        category,
        image_url,
        is_active,
        display_order,
        created_at
      FROM services
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      services: result.rows as Service[],
      total: result.rows.length,
    };
  }
);

/**
 * Create a new service (admin only)
 * TODO: Add authentication middleware
 */
export const createService = api(
  { expose: true, method: "POST", path: "/admin/services" },
  async (req: CreateServiceRequest): Promise<Service> => {
    // Validation
    if (!req.title || req.title.trim().length < 2) {
      throw APIError.invalidArgument("Title must be at least 2 characters");
    }

    if (!req.description || req.description.trim().length < 10) {
      throw APIError.invalidArgument("Description must be at least 10 characters");
    }

    const validCategories = ['therapy', 'treatment', 'coaching', 'other'];
    if (!validCategories.includes(req.category)) {
      throw APIError.invalidArgument("Invalid category");
    }

    const result = await db.exec`
      INSERT INTO services (title, description, category, image_url, is_active, display_order)
      VALUES (
        ${req.title},
        ${req.description},
        ${req.category},
        ${req.image_url || null},
        ${req.is_active !== undefined ? req.is_active : true},
        ${req.display_order || 0}
      )
      RETURNING id, title, description, category, image_url, is_active, display_order, created_at
    `;

    return result.rows[0] as Service;
  }
);

/**
 * Update a service (admin only)
 * TODO: Add authentication middleware
 */
export const updateService = api(
  { expose: true, method: "PATCH", path: "/admin/services/:id" },
  async (req: UpdateServiceRequest): Promise<Service> => {
    const updates: string[] = [];
    const values: any[] = [];

    if (req.title !== undefined) {
      updates.push("title = $" + (values.length + 1));
      values.push(req.title);
    }
    if (req.description !== undefined) {
      updates.push("description = $" + (values.length + 1));
      values.push(req.description);
    }
    if (req.category !== undefined) {
      const validCategories = ['therapy', 'treatment', 'coaching', 'other'];
      if (!validCategories.includes(req.category)) {
        throw APIError.invalidArgument("Invalid category");
      }
      updates.push("category = $" + (values.length + 1));
      values.push(req.category);
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
      UPDATE services
      SET ${updates.join(", ")}
      WHERE id = ${req.id}
      RETURNING id, title, description, category, image_url, is_active, display_order, created_at
    `;

    if (result.rows.length === 0) {
      throw APIError.notFound("Service not found");
    }

    return result.rows[0] as Service;
  }
);

/**
 * Delete a service (admin only)
 * TODO: Add authentication middleware
 */
export const deleteService = api(
  { expose: true, method: "DELETE", path: "/admin/services/:id" },
  async ({ id }: { id: number }): Promise<{ success: boolean }> => {
    const result = await db.exec`
      DELETE FROM services
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      throw APIError.notFound("Service not found");
    }

    return { success: true };
  }
);
