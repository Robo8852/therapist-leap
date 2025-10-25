-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for filtering
CREATE INDEX idx_appointments_status ON appointments(status);

-- Create index on preferred_date for sorting and filtering
CREATE INDEX idx_appointments_date ON appointments(preferred_date);

-- Create index on patient_email for lookups
CREATE INDEX idx_appointments_email ON appointments(patient_email);

-- Create composite index for upcoming appointments query
CREATE INDEX idx_appointments_date_status ON appointments(preferred_date, status);
