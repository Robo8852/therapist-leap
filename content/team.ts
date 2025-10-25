import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { TeamMember } from "../shared/types";

const db = new SQLDatabase("content", {
  migrations: "./migrations",
});

interface CreateTeamMemberRequest {
  name: string;
  title: string;
  bio: string;
  image_url?: string;
  email?: string;
  languages?: string[];
  specializations?: string[];
  is_active?: boolean;
  display_order?: number;
}

interface UpdateTeamMemberRequest {
  id: number;
  name?: string;
  title?: string;
  bio?: string;
  image_url?: string;
  email?: string;
  languages?: string[];
  specializations?: string[];
  is_active?: boolean;
  display_order?: number;
}

interface GetTeamMembersResponse {
  team_members: TeamMember[];
  total: number;
}

/**
 * Get all active team members (public)
 */
export const getTeamMembers = api(
  { expose: true, method: "GET", path: "/team" },
  async (): Promise<GetTeamMembersResponse> => {
    const result = await db.query`
      SELECT
        id,
        name,
        title,
        bio,
        image_url,
        email,
        languages,
        specializations,
        is_active,
        display_order,
        created_at
      FROM team_members
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      team_members: result.rows as TeamMember[],
      total: result.rows.length,
    };
  }
);

/**
 * Get all team members including inactive (admin only)
 * TODO: Add authentication middleware
 */
export const getAllTeamMembers = api(
  { expose: true, method: "GET", path: "/admin/team" },
  async (): Promise<GetTeamMembersResponse> => {
    const result = await db.query`
      SELECT
        id,
        name,
        title,
        bio,
        image_url,
        email,
        languages,
        specializations,
        is_active,
        display_order,
        created_at
      FROM team_members
      ORDER BY display_order ASC, created_at DESC
    `;

    return {
      team_members: result.rows as TeamMember[],
      total: result.rows.length,
    };
  }
);

/**
 * Create a new team member (admin only)
 * TODO: Add authentication middleware
 */
export const createTeamMember = api(
  { expose: true, method: "POST", path: "/admin/team" },
  async (req: CreateTeamMemberRequest): Promise<TeamMember> => {
    // Validation
    if (!req.name || req.name.trim().length < 2) {
      throw APIError.invalidArgument("Name must be at least 2 characters");
    }

    if (!req.title || req.title.trim().length < 2) {
      throw APIError.invalidArgument("Title must be at least 2 characters");
    }

    if (!req.bio || req.bio.trim().length < 10) {
      throw APIError.invalidArgument("Bio must be at least 10 characters");
    }

    const result = await db.exec`
      INSERT INTO team_members (
        name,
        title,
        bio,
        image_url,
        email,
        languages,
        specializations,
        is_active,
        display_order
      )
      VALUES (
        ${req.name},
        ${req.title},
        ${req.bio},
        ${req.image_url || null},
        ${req.email || null},
        ${req.languages ? JSON.stringify(req.languages) : null},
        ${req.specializations ? JSON.stringify(req.specializations) : null},
        ${req.is_active !== undefined ? req.is_active : true},
        ${req.display_order || 0}
      )
      RETURNING id, name, title, bio, image_url, email, languages, specializations, is_active, display_order, created_at
    `;

    return result.rows[0] as TeamMember;
  }
);

/**
 * Update a team member (admin only)
 * TODO: Add authentication middleware
 */
export const updateTeamMember = api(
  { expose: true, method: "PATCH", path: "/admin/team/:id" },
  async (req: UpdateTeamMemberRequest): Promise<TeamMember> => {
    const updates: string[] = [];
    const values: any[] = [];

    if (req.name !== undefined) {
      updates.push("name = $" + (values.length + 1));
      values.push(req.name);
    }
    if (req.title !== undefined) {
      updates.push("title = $" + (values.length + 1));
      values.push(req.title);
    }
    if (req.bio !== undefined) {
      updates.push("bio = $" + (values.length + 1));
      values.push(req.bio);
    }
    if (req.image_url !== undefined) {
      updates.push("image_url = $" + (values.length + 1));
      values.push(req.image_url);
    }
    if (req.email !== undefined) {
      updates.push("email = $" + (values.length + 1));
      values.push(req.email);
    }
    if (req.languages !== undefined) {
      updates.push("languages = $" + (values.length + 1));
      values.push(JSON.stringify(req.languages));
    }
    if (req.specializations !== undefined) {
      updates.push("specializations = $" + (values.length + 1));
      values.push(JSON.stringify(req.specializations));
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
      UPDATE team_members
      SET ${updates.join(", ")}
      WHERE id = ${req.id}
      RETURNING id, name, title, bio, image_url, email, languages, specializations, is_active, display_order, created_at
    `;

    if (result.rows.length === 0) {
      throw APIError.notFound("Team member not found");
    }

    return result.rows[0] as TeamMember;
  }
);

/**
 * Delete a team member (admin only)
 * TODO: Add authentication middleware
 */
export const deleteTeamMember = api(
  { expose: true, method: "DELETE", path: "/admin/team/:id" },
  async ({ id }: { id: number }): Promise<{ success: boolean }> => {
    const result = await db.exec`
      DELETE FROM team_members
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      throw APIError.notFound("Team member not found");
    }

    return { success: true };
  }
);
