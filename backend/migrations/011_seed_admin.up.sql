
INSERT INTO users (name, email, password, city, dateofbirth, role)
VALUES (
    'Admin',
    'admin@example.com',
    'Admin123!',
    'Admin City',
    '1970-01-01',
    'admin'
)
ON CONFLICT (email) DO UPDATE
SET
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    city = EXCLUDED.city,
    dateofbirth = EXCLUDED.dateofbirth,
    role = EXCLUDED.role;


