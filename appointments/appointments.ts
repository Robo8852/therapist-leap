import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { Appointment } from "../shared/types";

// Database for appointments
const db = new SQLDatabase("appointments", {
  migrations: "./migrations",
});

interface BookAppointmentRequest {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  preferred_date: string; // ISO date string
  preferred_time: string;
  service_type: string;
  message?: string;
}

interface BookAppointmentResponse {
  success: boolean;
  appointment_id: number;
  message: string;
}

interface GetAppointmentsResponse {
  appointments: Appointment[];
  total: number;
}

interface UpdateAppointmentStatusRequest {
  appointment_id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

/**
 * Book a new appointment (public)
 */
export const bookAppointment = api(
  { expose: true, method: "POST", path: "/appointments/book" },
  async (req: BookAppointmentRequest): Promise<BookAppointmentResponse> => {
    // Validation
    if (!req.patient_name || req.patient_name.trim().length < 2) {
      throw APIError.invalidArgument("Patient name must be at least 2 characters");
    }

    if (!req.patient_email || !isValidEmail(req.patient_email)) {
      throw APIError.invalidArgument("Valid email is required");
    }

    if (!req.patient_phone || req.patient_phone.trim().length < 7) {
      throw APIError.invalidArgument("Valid phone number is required");
    }

    if (!req.preferred_date) {
      throw APIError.invalidArgument("Preferred date is required");
    }

    if (!req.preferred_time) {
      throw APIError.invalidArgument("Preferred time is required");
    }

    if (!req.service_type || req.service_type.trim().length < 2) {
      throw APIError.invalidArgument("Service type is required");
    }

    // Parse and validate date
    const preferredDate = new Date(req.preferred_date);
    if (isNaN(preferredDate.getTime())) {
      throw APIError.invalidArgument("Invalid date format");
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (preferredDate < today) {
      throw APIError.invalidArgument("Cannot book appointments in the past");
    }

    // Insert appointment
    const result = await db.exec`
      INSERT INTO appointments (
        patient_name,
        patient_email,
        patient_phone,
        preferred_date,
        preferred_time,
        service_type,
        message,
        status
      )
      VALUES (
        ${req.patient_name},
        ${req.patient_email},
        ${req.patient_phone},
        ${preferredDate},
        ${req.preferred_time},
        ${req.service_type},
        ${req.message || null},
        'pending'
      )
      RETURNING id
    `;

    const appointmentId = result.rows[0].id;

    // TODO: Trigger email notification to patient and admin

    return {
      success: true,
      appointment_id: appointmentId,
      message: "Appointment request submitted successfully. We will contact you soon to confirm.",
    };
  }
);

/**
 * Get all appointments (admin only)
 * TODO: Add authentication middleware
 */
export const getAppointments = api(
  { expose: true, method: "GET", path: "/appointments" },
  async (): Promise<GetAppointmentsResponse> => {
    const result = await db.query`
      SELECT
        id,
        patient_name,
        patient_email,
        patient_phone,
        preferred_date,
        preferred_time,
        service_type,
        message,
        status,
        created_at
      FROM appointments
      ORDER BY preferred_date ASC, preferred_time ASC
    `;

    return {
      appointments: result.rows as Appointment[],
      total: result.rows.length,
    };
  }
);

/**
 * Get appointments by status (admin only)
 * TODO: Add authentication middleware
 */
export const getAppointmentsByStatus = api(
  { expose: true, method: "GET", path: "/appointments/status/:status" },
  async ({ status }: { status: string }): Promise<GetAppointmentsResponse> => {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw APIError.invalidArgument("Invalid status");
    }

    const result = await db.query`
      SELECT
        id,
        patient_name,
        patient_email,
        patient_phone,
        preferred_date,
        preferred_time,
        service_type,
        message,
        status,
        created_at
      FROM appointments
      WHERE status = ${status}
      ORDER BY preferred_date ASC, preferred_time ASC
    `;

    return {
      appointments: result.rows as Appointment[],
      total: result.rows.length,
    };
  }
);

/**
 * Get single appointment by ID (admin only)
 * TODO: Add authentication middleware
 */
export const getAppointment = api(
  { expose: true, method: "GET", path: "/appointments/:id" },
  async ({ id }: { id: number }): Promise<Appointment> => {
    const result = await db.query`
      SELECT
        id,
        patient_name,
        patient_email,
        patient_phone,
        preferred_date,
        preferred_time,
        service_type,
        message,
        status,
        created_at
      FROM appointments
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      throw APIError.notFound("Appointment not found");
    }

    return result.rows[0] as Appointment;
  }
);

/**
 * Update appointment status (admin only)
 * TODO: Add authentication middleware
 */
export const updateAppointmentStatus = api(
  { expose: true, method: "PATCH", path: "/appointments/:id/status" },
  async (req: UpdateAppointmentStatusRequest): Promise<{ success: boolean }> => {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(req.status)) {
      throw APIError.invalidArgument("Invalid status");
    }

    const result = await db.exec`
      UPDATE appointments
      SET status = ${req.status}
      WHERE id = ${req.appointment_id}
    `;

    if (result.rowCount === 0) {
      throw APIError.notFound("Appointment not found");
    }

    // TODO: Trigger email notification when status changes

    return { success: true };
  }
);

/**
 * Delete/cancel appointment (admin only)
 * TODO: Add authentication middleware
 */
export const deleteAppointment = api(
  { expose: true, method: "DELETE", path: "/appointments/:id" },
  async ({ id }: { id: number }): Promise<{ success: boolean }> => {
    const result = await db.exec`
      DELETE FROM appointments
      WHERE id = ${id}
    `;

    if (result.rowCount === 0) {
      throw APIError.notFound("Appointment not found");
    }

    return { success: true };
  }
);

/**
 * Get upcoming appointments (next 7 days) (admin only)
 * TODO: Add authentication middleware
 */
export const getUpcomingAppointments = api(
  { expose: true, method: "GET", path: "/appointments/upcoming" },
  async (): Promise<GetAppointmentsResponse> => {
    const result = await db.query`
      SELECT
        id,
        patient_name,
        patient_email,
        patient_phone,
        preferred_date,
        preferred_time,
        service_type,
        message,
        status,
        created_at
      FROM appointments
      WHERE preferred_date >= CURRENT_DATE
        AND preferred_date <= CURRENT_DATE + INTERVAL '7 days'
        AND status IN ('pending', 'confirmed')
      ORDER BY preferred_date ASC, preferred_time ASC
    `;

    return {
      appointments: result.rows as Appointment[],
      total: result.rows.length,
    };
  }
);

// Helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
