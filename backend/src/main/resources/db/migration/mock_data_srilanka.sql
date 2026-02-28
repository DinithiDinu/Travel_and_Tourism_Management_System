-- =======================================================================
-- Sri Lanka Mock Data Seed Script  (v2 - idempotent)
-- Travel & Tourism Management System
-- Target DB: tourismdb  |  PostgreSQL 17
--
-- Sections (5 rows each):
--   1. users               6. rider_profiles
--   2. trip_categories      7. vehicles
--   3. trips                8. ride_requests
--   4. trip_schedules       9. bookings
--   5. employees           10. financial_transactions
--
-- Default password for all seed users = "Password@123"
--   BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =======================================================================

-- -----------------------------------------------------------------------
-- 1. USERS  (PK = user_id, name column = full_name)
-- -----------------------------------------------------------------------
INSERT INTO users (user_id, full_name, email, password, role, account_status, created_at)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 'Amal Perera',          'amal.perera@tourism.lk',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAVELER', 'ACTIVE', NOW()),
  (101, 'Dilani Silva',         'dilani.silva@tourism.lk',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'GUIDE',    'ACTIVE', NOW()),
  (102, 'Kasun Jayawardena',    'kasun.rider@tourism.lk',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RIDER',    'ACTIVE', NOW()),
  (103, 'Nimal Fernando',       'nimal.admin@tourism.lk',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN',    'ACTIVE', NOW()),
  (104, 'Priya Wickramasinghe', 'priya.provider@tourism.lk','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PROVIDER', 'ACTIVE', NOW())
ON CONFLICT (user_id) DO NOTHING;

SELECT setval('users_user_id_seq', GREATEST((SELECT MAX(user_id) FROM users), 200), true);

-- -----------------------------------------------------------------------
-- 2. TRIP CATEGORIES
-- -----------------------------------------------------------------------
INSERT INTO trip_categories (category_id, category_name, description)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 'Cultural Heritage',  'Explore ancient temples, ruins, and UNESCO World Heritage sites across Sri Lanka'),
  (101, 'Beach & Coastal',    'Discover pristine beaches, coral reefs, and coastal whale-watching tours'),
  (102, 'Wildlife Safari',    'Experience Sri Lanka''s exotic biodiversity including elephants, leopards, and sea turtles'),
  (103, 'Hill Country',       'Journey through lush tea plantations, waterfalls, and cool misty highlands'),
  (104, 'Adventure Trekking', 'Thrilling hikes, rock climbs, and river expeditions across scenic landscapes')
ON CONFLICT (category_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('trip_categories','category_id'),
              GREATEST((SELECT MAX(category_id) FROM trip_categories), 200), true);

-- -----------------------------------------------------------------------
-- 3. TRIPS  (references trip_categories 100-104)
-- -----------------------------------------------------------------------
INSERT INTO trips (trip_id, trip_name, location, trip_description, duration, capacity, price, category_id, image_url, status)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 'Sigiriya & Polonnaruwa Heritage Trail', 'Sigiriya, North Central Province',
   'A 3-day journey to the iconic Sigiriya Lion Rock Fortress and the ancient royal city of Polonnaruwa. Includes UNESCO-guided tours and sunset views from the summit.',
   3, 20, 15000.00, 100, 'https://tourism.lk/images/sigiriya-heritage.jpg', 'ACTIVE'),
  (101, 'Mirissa Blue Whale & Beach Retreat', 'Mirissa, Southern Province',
   'A 4-day coastal escape combining whale-watching in Mirissa Bay, snorkelling in Unawatuna, and relaxation on Mirissa Beach.',
   4, 15, 22000.00, 101, 'https://tourism.lk/images/mirissa-whale.jpg', 'ACTIVE'),
  (102, 'Yala National Park Safari', 'Yala, Southern Province',
   'A 2-day jeep safari through Yala National Park  home to the world''s highest density of leopards, wild elephants, and 200+ bird species.',
   2, 12, 18500.00, 102, 'https://tourism.lk/images/yala-safari.jpg', 'ACTIVE'),
  (103, 'Ella Highlands Tea & Trekking Tour', 'Ella, Uva Province',
   'A 3-day adventure through Ella Rock, Nine Arch Bridge, and the scenic train from Kandy, plus visits to organic tea factories.',
   3, 18, 13000.00, 104, 'https://tourism.lk/images/ella-trekking.jpg', 'ACTIVE'),
  (104, 'Kandy Cultural & Sacred City Tour', 'Kandy, Central Province',
   'A 2-day cultural immersion in Sri Lanka''s last royal capital: Temple of the Tooth, Peradeniya Gardens, Kandyan dance, and spice gardens.',
   2, 25,  9500.00, 100, 'https://tourism.lk/images/kandy-cultural.jpg', 'ACTIVE')
ON CONFLICT (trip_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('trips','trip_id'),
              GREATEST((SELECT MAX(trip_id) FROM trips), 200), true);

-- -----------------------------------------------------------------------
-- 4. TRIP SCHEDULES  (referenced by bookings)
-- -----------------------------------------------------------------------
INSERT INTO trip_schedules (schedule_id, trip_id, start_date, end_date, available_slots)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 100, '2026-03-05', '2026-03-07', 18),
  (101, 101, '2026-03-10', '2026-03-13', 12),
  (102, 102, '2026-03-15', '2026-03-16', 10),
  (103, 103, '2026-03-20', '2026-03-22', 15),
  (104, 104, '2026-03-25', '2026-03-26', 22)
ON CONFLICT (schedule_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('trip_schedules','schedule_id'),
              GREATEST((SELECT MAX(schedule_id) FROM trip_schedules), 200), true);

-- -----------------------------------------------------------------------
-- 5. EMPLOYEES  (references users 100-104)
-- -----------------------------------------------------------------------
INSERT INTO employees (employee_id, user_id, department, position, base_salary)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 100, 'Operations', 'Operations Manager',   120000.00),
  (101, 101, 'Finance',    'Senior Accountant',      95000.00),
  (102, 102, 'Marketing',  'Marketing Executive',    80000.00),
  (103, 103, 'IT',         'Full-Stack Developer',  110000.00),
  (104, 104, 'HR',         'HR Officer',             75000.00)
ON CONFLICT (employee_id) DO NOTHING;

SELECT setval('employees_employee_id_seq',
              GREATEST((SELECT MAX(employee_id) FROM employees), 200), true);

-- -----------------------------------------------------------------------
-- 6. RIDER PROFILES  (references users 100-104)
-- -----------------------------------------------------------------------
INSERT INTO rider_profiles (rider_id, user_id, license_number, vehicle_type, status)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 100, 'B1234567-A', 'VAN',   'ACTIVE'),
  (101, 101, 'B7654321-B', 'CAR',   'ACTIVE'),
  (102, 102, 'C9876543-C', 'BUS',   'ACTIVE'),
  (103, 103, 'A1122334-D', 'TUKTU', 'ACTIVE'),
  (104, 104, 'A5566778-E', 'CAR',   'ACTIVE')
ON CONFLICT (rider_id) DO NOTHING;

SELECT setval('rider_profiles_rider_id_seq',
              GREATEST((SELECT MAX(rider_id) FROM rider_profiles), 200), true);

-- -----------------------------------------------------------------------
-- 7. VEHICLES  (references rider_profiles 100-104)
-- -----------------------------------------------------------------------
INSERT INTO vehicles (vehicle_id, rider_id, vehicle_type, registration_number, model, seating_capacity, status)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 100, 'VAN',   'WP-AB-1234', 'Toyota HiAce',   14, 'AVAILABLE'),
  (101, 101, 'CAR',   'CP-CD-5678', 'Toyota Corolla',  5, 'AVAILABLE'),
  (102, 102, 'BUS',   'NW-EF-9012', 'MAN Lion City',  45, 'AVAILABLE'),
  (103, 103, 'TUKTU', 'SC-GH-3456', 'Bajaj RE CT',     3, 'AVAILABLE'),
  (104, 104, 'CAR',   'EP-IJ-7890', 'Suzuki Alto',     5, 'AVAILABLE')
ON CONFLICT (vehicle_id) DO NOTHING;

SELECT setval('vehicles_vehicle_id_seq',
              GREATEST((SELECT MAX(vehicle_id) FROM vehicles), 200), true);

-- -----------------------------------------------------------------------
-- 8. RIDE REQUESTS  (booking_id nullable  no hard FK dependency)
-- -----------------------------------------------------------------------
INSERT INTO ride_requests (id, booking_id, rider_name, service_type, status)
OVERRIDING SYSTEM VALUE
VALUES
  (100, NULL, 'Amal Perera',        'Van', 'PENDING'),
  (101, NULL, 'Thilini Rathnayake', 'Car', 'ASSIGNED'),
  (102, NULL, 'Chamara Bandara',    'Bus', 'PENDING'),
  (103, NULL, 'Sanduni Senanayake', 'Tuk', 'COMPLETED'),
  (104, NULL, 'Roshan Jayasinghe',  'Car', 'PENDING')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('ride_requests','id'),
              GREATEST((SELECT MAX(id) FROM ride_requests), 200), true);

-- -----------------------------------------------------------------------
-- 9. BOOKINGS  (references users 100-104 and trip_schedules 100-104)
-- -----------------------------------------------------------------------
INSERT INTO bookings (booking_id, user_id, schedule_id, number_of_people, total_amount, booking_status, booked_at)
OVERRIDING SYSTEM VALUE
VALUES
  (100, 100, 100, 2,  30000.00, 'CONFIRMED', NOW() - INTERVAL '5 days'),
  (101, 101, 101, 3,  66000.00, 'CONFIRMED', NOW() - INTERVAL '4 days'),
  (102, 102, 102, 1,  18500.00, 'PENDING',   NOW() - INTERVAL '3 days'),
  (103, 103, 103, 4,  52000.00, 'CONFIRMED', NOW() - INTERVAL '2 days'),
  (104, 104, 104, 2,  19000.00, 'CANCELLED', NOW() - INTERVAL '1 day')
ON CONFLICT (booking_id) DO NOTHING;

SELECT setval('bookings_booking_id_seq',
              GREATEST((SELECT MAX(booking_id) FROM bookings), 200), true);

-- -----------------------------------------------------------------------
-- 10. FINANCIAL TRANSACTIONS  (references employees 100-104)
-- -----------------------------------------------------------------------
INSERT INTO financial_transactions
  (transaction_id, expense_id, revenue_id, employee_id, transaction_type, amount, description, transaction_date)
OVERRIDING SYSTEM VALUE
VALUES
  (100, NULL, NULL, 100, 'INCOME',  30000.00, 'Tour booking revenue - Sigiriya Heritage Trail (Booking #100)',   NOW() - INTERVAL '5 days'),
  (101, NULL, NULL, 101, 'INCOME',  66000.00, 'Tour booking revenue - Mirissa Beach Retreat (Booking #101)',     NOW() - INTERVAL '4 days'),
  (102, NULL, NULL, 102, 'EXPENSE',  5500.00, 'Guide transport reimbursement - Kandy cultural session',          NOW() - INTERVAL '3 days'),
  (103, NULL, NULL, 103, 'EXPENSE',  8200.00, 'Vehicle fuel & maintenance - Yala Safari fleet servicing',        NOW() - INTERVAL '2 days'),
  (104, NULL, NULL, 104, 'INCOME',  19000.00, 'Tour booking revenue - Kandy Cultural Tour (Booking #104)',       NOW() - INTERVAL '1 day')
ON CONFLICT (transaction_id) DO NOTHING;

SELECT setval('financial_transactions_transaction_id_seq',
              GREATEST((SELECT MAX(transaction_id) FROM financial_transactions), 200), true);

-- -----------------------------------------------------------------------
-- Verification summary
-- -----------------------------------------------------------------------
SELECT section, total FROM (
  SELECT 'users'                  AS section, COUNT(*) AS total FROM users                 UNION ALL
  SELECT 'trip_categories',                   COUNT(*) FROM trip_categories                UNION ALL
  SELECT 'trips',                             COUNT(*) FROM trips                          UNION ALL
  SELECT 'trip_schedules',                    COUNT(*) FROM trip_schedules                 UNION ALL
  SELECT 'employees',                         COUNT(*) FROM employees                      UNION ALL
  SELECT 'rider_profiles',                    COUNT(*) FROM rider_profiles                 UNION ALL
  SELECT 'vehicles',                          COUNT(*) FROM vehicles                       UNION ALL
  SELECT 'ride_requests',                     COUNT(*) FROM ride_requests                  UNION ALL
  SELECT 'bookings',                          COUNT(*) FROM bookings                       UNION ALL
  SELECT 'financial_transactions',            COUNT(*) FROM financial_transactions
) counts ORDER BY section;
