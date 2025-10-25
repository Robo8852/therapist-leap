import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { secret } from "encore.dev/config";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import type { User, AuthToken } from "../shared/types";

// Database for authentication
const db = new SQLDatabase("auth", {
  migrations: "./migrations",
});

// JWT secret for signing tokens
const jwtSecret = secret("JWTSecret");

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'staff';
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    full_name: string;
  };
}

interface VerifyTokenRequest {
  token: string;
}

interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    id: number;
    email: string;
    role: string;
    full_name: string;
  };
}

/**
 * Register a new admin/staff user
 * Note: In production, this should be restricted to super-admin only
 */
export const register = api(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req: RegisterRequest): Promise<{ success: boolean; user_id: number }> => {
    // Validation
    if (!req.email || !isValidEmail(req.email)) {
      throw APIError.invalidArgument("Valid email is required");
    }

    if (!req.password || req.password.length < 8) {
      throw APIError.invalidArgument("Password must be at least 8 characters");
    }

    if (!req.full_name || req.full_name.trim().length < 2) {
      throw APIError.invalidArgument("Full name must be at least 2 characters");
    }

    // Check if user already exists
    const existingUser = await db.query`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (existingUser.rows.length > 0) {
      throw APIError.alreadyExists("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(req.password, 10);

    // Create user
    const result = await db.exec`
      INSERT INTO users (email, password_hash, full_name, role, is_active)
      VALUES (
        ${req.email},
        ${passwordHash},
        ${req.full_name},
        ${req.role || 'staff'},
        true
      )
      RETURNING id
    `;

    return {
      success: true,
      user_id: result.rows[0].id,
    };
  }
);

/**
 * Login with email and password
 */
export const login = api(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req: LoginRequest): Promise<LoginResponse> => {
    // Validation
    if (!req.email || !req.password) {
      throw APIError.invalidArgument("Email and password are required");
    }

    // Find user
    const result = await db.query`
      SELECT
        id,
        email,
        password_hash,
        role,
        full_name,
        is_active
      FROM users
      WHERE email = ${req.email}
    `;

    if (result.rows.length === 0) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      throw APIError.permissionDenied("User account is disabled");
    }

    // Verify password
    const passwordValid = await bcrypt.compare(req.password, user.password_hash);

    if (!passwordValid) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    // Update last login
    await db.exec`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      await jwtSecret(),
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    };
  }
);

/**
 * Verify JWT token
 */
export const verifyToken = api(
  { expose: true, method: "POST", path: "/auth/verify" },
  async (req: VerifyTokenRequest): Promise<VerifyTokenResponse> => {
    try {
      const decoded = jwt.verify(req.token, await jwtSecret()) as {
        userId: number;
        email: string;
        role: string;
      };

      // Verify user still exists and is active
      const result = await db.query`
        SELECT id, email, role, full_name, is_active
        FROM users
        WHERE id = ${decoded.userId}
      `;

      if (result.rows.length === 0 || !result.rows[0].is_active) {
        return { valid: false };
      }

      const user = result.rows[0];

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
        },
      };
    } catch (error) {
      return { valid: false };
    }
  }
);

/**
 * Get current user profile
 * Requires authentication header
 */
export const getProfile = api(
  { expose: true, method: "GET", path: "/auth/profile" },
  async (): Promise<{ user: any }> => {
    // TODO: Extract user from auth header/middleware
    // For now, this is a placeholder
    throw APIError.unimplemented("Profile endpoint requires auth middleware");
  }
);

/**
 * Change password
 */
export const changePassword = api(
  { expose: true, method: "POST", path: "/auth/change-password" },
  async (req: {
    user_id: number;
    current_password: string;
    new_password: string;
  }): Promise<{ success: boolean }> => {
    // Validation
    if (!req.new_password || req.new_password.length < 8) {
      throw APIError.invalidArgument("New password must be at least 8 characters");
    }

    // Get user
    const result = await db.query`
      SELECT password_hash
      FROM users
      WHERE id = ${req.user_id}
    `;

    if (result.rows.length === 0) {
      throw APIError.notFound("User not found");
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(
      req.current_password,
      result.rows[0].password_hash
    );

    if (!passwordValid) {
      throw APIError.unauthenticated("Current password is incorrect");
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(req.new_password, 10);

    // Update password
    await db.exec`
      UPDATE users
      SET password_hash = ${newPasswordHash}
      WHERE id = ${req.user_id}
    `;

    return { success: true };
  }
);

// Helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
