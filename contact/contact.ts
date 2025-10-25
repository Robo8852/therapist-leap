import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { ContactInquiry } from "../shared/types";

// Database for contact inquiries
const db = new SQLDatabase("contact", {
  migrations: "./migrations",
});

interface SubmitContactRequest {
  name: string;
  email: string;
  message: string;
  privacy_accepted: boolean;
}

interface SubmitContactResponse {
  success: boolean;
  inquiry_id: number;
  message: string;
}

interface GetInquiriesResponse {
  inquiries: ContactInquiry[];
  total: number;
}

interface UpdateInquiryStatusRequest {
  inquiry_id: number;
  status: 'new' | 'read' | 'replied' | 'archived';
}

/**
 * Submit a contact inquiry from the website
 * Public endpoint - no authentication required
 */
export const submitContact = api(
  { expose: true, method: "POST", path: "/contact/submit" },
  async (req: SubmitContactRequest): Promise<SubmitContactResponse> => {
    // Validation
    if (!req.name || req.name.trim().length < 2) {
      throw APIError.invalidArgument("Name must be at least 2 characters");
    }

    if (!req.email || !isValidEmail(req.email)) {
      throw APIError.invalidArgument("Valid email is required");
    }

    if (!req.message || req.message.trim().length < 10) {
      throw APIError.invalidArgument("Message must be at least 10 characters");
    }

    if (!req.privacy_accepted) {
      throw APIError.invalidArgument("Privacy policy must be accepted");
    }

    // Insert inquiry into database
    const result = await db.exec`
      INSERT INTO inquiries (name, email, message, privacy_accepted, status)
      VALUES (${req.name}, ${req.email}, ${req.message}, ${req.privacy_accepted}, 'new')
      RETURNING id
    `;

    const inquiryId = result.rows[0].id;

    // TODO: Trigger email notification (will implement in notifications service)

    return {
      success: true,
      inquiry_id: inquiryId,
      message: "Thank you for your message! We will get back to you soon.",
    };
  }
);

/**
 * Get all contact inquiries (admin only)
 * TODO: Add authentication middleware
 */
export const getInquiries = api(
  { expose: true, method: "GET", path: "/contact/inquiries" },
  async (): Promise<GetInquiriesResponse> => {
    const result = await db.query`
      SELECT
        id,
        name,
        email,
        message,
        privacy_accepted,
        status,
        created_at
      FROM inquiries
      ORDER BY created_at DESC
    `;

    return {
      inquiries: result.rows as ContactInquiry[],
      total: result.rows.length,
    };
  }
);

/**
 * Get a single inquiry by ID (admin only)
 * TODO: Add authentication middleware
 */
export const getInquiry = api(
  { expose: true, method: "GET", path: "/contact/inquiries/:id" },
  async ({ id }: { id: number }): Promise<ContactInquiry> => {
    const result = await db.query`
      SELECT
        id,
        name,
        email,
        message,
        privacy_accepted,
        status,
        created_at
      FROM inquiries
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      throw APIError.notFound("Inquiry not found");
    }

    return result.rows[0] as ContactInquiry;
  }
);

/**
 * Update inquiry status (admin only)
 * TODO: Add authentication middleware
 */
export const updateInquiryStatus = api(
  { expose: true, method: "PATCH", path: "/contact/inquiries/:id/status" },
  async (req: UpdateInquiryStatusRequest): Promise<{ success: boolean }> => {
    await db.exec`
      UPDATE inquiries
      SET status = ${req.status}
      WHERE id = ${req.inquiry_id}
    `;

    return { success: true };
  }
);

/**
 * Delete inquiry (admin only)
 * TODO: Add authentication middleware
 */
export const deleteInquiry = api(
  { expose: true, method: "DELETE", path: "/contact/inquiries/:id" },
  async ({ id }: { id: number }): Promise<{ success: boolean }> => {
    const result = await db.exec`
      DELETE FROM inquiries
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      throw APIError.notFound("Inquiry not found");
    }

    return { success: true };
  }
);

// Helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
