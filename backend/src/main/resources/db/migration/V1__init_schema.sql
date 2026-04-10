CREATE TABLE hosts (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    time_zone VARCHAR(255) NOT NULL,
    CONSTRAINT hosts_slug_unique UNIQUE (slug)
);

CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    owner_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description CLOB NOT NULL,
    duration_minutes INTEGER NOT NULL,
    slug VARCHAR(255) NOT NULL,
    CONSTRAINT events_owner_fk FOREIGN KEY (owner_id) REFERENCES hosts (id),
    CONSTRAINT events_owner_slug_unique UNIQUE (owner_id, slug),
    CONSTRAINT events_duration_positive CHECK (duration_minutes > 0)
);

CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT bookings_event_fk FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT bookings_time_range_valid CHECK (end_at > start_at)
);

CREATE INDEX events_owner_id_idx ON events (owner_id);
CREATE INDEX bookings_event_id_start_at_idx ON bookings (event_id, start_at);
