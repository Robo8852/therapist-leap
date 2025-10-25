-- Create inquiries table for contact form submissions
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    privacy_accepted BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for filtering
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- Create index on created_at for sorting
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- Create index on email for lookups
CREATE INDEX idx_inquiries_email ON inquiries(email);
