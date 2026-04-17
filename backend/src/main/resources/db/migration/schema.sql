-- =============================================================================
-- Travel & Tourism Management System – Full PostgreSQL Schema
-- Target DB   : tourismdb
-- PostgreSQL  : 17
-- Generated   : 2026-02-28
--
-- Sections:
--   1.  users                       (auth module – canonical user table)
--   2.  sessions
--   3.  password_resets
--   4.  audit_logs
--   5.  staff_activity_logs
--   6.  members                     (ISA subtypes)
--   7.  admin_profiles
--   8.  accommodation_providers
--   9.  trip_categories
--  10.  trips
--  11.  trip_schedules
--  12.  bookings
--  13.  booking_status_history
--  14.  employees
--  15.  expenses
--  16.  revenues
--  17.  financial_transactions
--  18.  finance_records
--  19.  financial_reports
--  20.  payroll_payments
--  21.  service_provider_payments
--  22.  guides
--  23.  guide_performances
--  24.  guide_reviews
--  25.  training_enrollments
--  26.  post_training_evaluations
--  27.  training_recommendations
--  28.  rider_profiles
--  29.  vehicles
--  30.  service_providers
--  31.  service_requests
--  32.  ride_requests
--  33.  rides
--  34.  ride_locations
--  35.  assignments
--  36.  tour_packages
--  37.  package_offers
--  38.  discount_categories
--  39.  payments
--  40.  wallets
--  41.  wallet_transactions
--  42.  coin_redemptions
-- =============================================================================

-- Drop all tables in reverse dependency order (safe re-run)
DROP TABLE IF EXISTS coin_redemptions            CASCADE;
DROP TABLE IF EXISTS wallet_transactions         CASCADE;
DROP TABLE IF EXISTS wallets                     CASCADE;
DROP TABLE IF EXISTS payments                    CASCADE;
DROP TABLE IF EXISTS discount_categories         CASCADE;
DROP TABLE IF EXISTS package_offers              CASCADE;
DROP TABLE IF EXISTS tour_packages               CASCADE;
DROP TABLE IF EXISTS assignments                 CASCADE;
DROP TABLE IF EXISTS ride_locations              CASCADE;
DROP TABLE IF EXISTS rides                       CASCADE;
DROP TABLE IF EXISTS ride_requests               CASCADE;
DROP TABLE IF EXISTS service_requests            CASCADE;
DROP TABLE IF EXISTS service_providers           CASCADE;
DROP TABLE IF EXISTS vehicles                    CASCADE;
DROP TABLE IF EXISTS rider_profiles              CASCADE;
DROP TABLE IF EXISTS training_recommendations    CASCADE;
DROP TABLE IF EXISTS post_training_evaluations   CASCADE;
DROP TABLE IF EXISTS training_enrollments        CASCADE;
DROP TABLE IF EXISTS guide_reviews               CASCADE;
DROP TABLE IF EXISTS guide_performances          CASCADE;
DROP TABLE IF EXISTS guides                      CASCADE;
DROP TABLE IF EXISTS service_provider_payments   CASCADE;
DROP TABLE IF EXISTS payroll_payments            CASCADE;
DROP TABLE IF EXISTS financial_reports           CASCADE;
DROP TABLE IF EXISTS finance_records             CASCADE;
DROP TABLE IF EXISTS financial_transactions      CASCADE;
DROP TABLE IF EXISTS revenues                    CASCADE;
DROP TABLE IF EXISTS expenses                    CASCADE;
DROP TABLE IF EXISTS employees                   CASCADE;
DROP TABLE IF EXISTS booking_status_history      CASCADE;
DROP TABLE IF EXISTS bookings                    CASCADE;
DROP TABLE IF EXISTS trip_schedules              CASCADE;
DROP TABLE IF EXISTS trips                       CASCADE;
DROP TABLE IF EXISTS trip_categories             CASCADE;
DROP TABLE IF EXISTS accommodation_providers     CASCADE;
DROP TABLE IF EXISTS admin_profiles              CASCADE;
DROP TABLE IF EXISTS members                     CASCADE;
DROP TABLE IF EXISTS staff_activity_logs         CASCADE;
DROP TABLE IF EXISTS audit_logs                  CASCADE;
DROP TABLE IF EXISTS password_resets             CASCADE;
DROP TABLE IF EXISTS sessions                    CASCADE;
DROP TABLE IF EXISTS users                       CASCADE;

-- =============================================================================
-- 1. USERS  (canonical – used by auth module and referenced system-wide)
-- =============================================================================
CREATE TABLE users (
    user_id        BIGSERIAL       PRIMARY KEY,
    full_name      VARCHAR(255)    NOT NULL,
    email          VARCHAR(255)    NOT NULL UNIQUE,
    password       VARCHAR(255)    NOT NULL,
    role           VARCHAR(50)     NOT NULL,           -- TRAVELER | GUIDE | RIDER | ADMIN | PROVIDER
    account_status VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | INACTIVE | SUSPENDED
    created_at     TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. SESSIONS
-- =============================================================================
CREATE TABLE sessions (
    session_id  BIGSERIAL        PRIMARY KEY,
    user_id     BIGINT           NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token       VARCHAR(512)     NOT NULL,
    login_time  TIMESTAMP        NOT NULL DEFAULT NOW(),
    expiry_time TIMESTAMP        NOT NULL DEFAULT (NOW() + INTERVAL '1 day')
);

-- =============================================================================
-- 3. PASSWORD RESETS
-- =============================================================================
CREATE TABLE password_resets (
    reset_id    BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reset_token VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMP    NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
    used        BOOLEAN      NOT NULL DEFAULT FALSE
);

-- =============================================================================
-- 4. AUDIT LOGS
-- =============================================================================
CREATE TABLE audit_logs (
    log_id      BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action      VARCHAR(255) NOT NULL,
    action_time TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. STAFF ACTIVITY LOGS
-- =============================================================================
CREATE TABLE staff_activity_logs (
    activity_id          BIGSERIAL    PRIMARY KEY,
    user_id              BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_description TEXT,
    activity_time        TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. MEMBERS  (ISA sub-type of users – TRAVELER)
-- =============================================================================
CREATE TABLE members (
    user_id         BIGINT       PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    membership_type VARCHAR(50)              -- BASIC | PREMIUM | VIP
);

-- =============================================================================
-- 7. ADMIN PROFILES  (ISA sub-type of users – ADMIN)
-- =============================================================================
CREATE TABLE admin_profiles (
    user_id      BIGINT       PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    access_level VARCHAR(50)              -- FULL | PARTIAL | READ_ONLY
);

-- =============================================================================
-- 8. ACCOMMODATION PROVIDERS  (ISA sub-type of users – PROVIDER)
-- =============================================================================
CREATE TABLE accommodation_providers (
    user_id          BIGINT       PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    business_name    VARCHAR(255),
    business_address TEXT,
    contact_phone    VARCHAR(50),
    business_type    VARCHAR(50)            -- HOTEL | HOSTEL | RESORT | VILLA
);

-- =============================================================================
-- 9. TRIP CATEGORIES
-- =============================================================================
CREATE TABLE trip_categories (
    category_id   BIGSERIAL    PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    description   TEXT
);

-- =============================================================================
-- 10. TRIPS
-- =============================================================================
CREATE TABLE trips (
    trip_id          BIGSERIAL    PRIMARY KEY,
    trip_name        VARCHAR(255),
    trip_description TEXT,
    location         VARCHAR(255),
    duration         INTEGER,                    -- legacy column (days)
    duration_days    INTEGER,                    -- JPA-mapped column
    capacity         INTEGER,
    price            NUMERIC(15,2),
    category         VARCHAR(255),               -- free-text category (legacy)
    category_id      BIGINT REFERENCES trip_categories(category_id) ON DELETE SET NULL,
    difficulty       VARCHAR(100),
    image_url        VARCHAR(512),
    status           VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE'  -- ACTIVE | INACTIVE
);

-- =============================================================================
-- 11. TRIP SCHEDULES
-- =============================================================================
CREATE TABLE trip_schedules (
    schedule_id     BIGSERIAL PRIMARY KEY,
    trip_id         BIGINT    NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    start_date      DATE      NOT NULL,
    end_date        DATE      NOT NULL,
    available_slots INTEGER
);

-- =============================================================================
-- 12. BOOKINGS
-- =============================================================================
CREATE TABLE bookings (
    booking_id       BIGSERIAL    PRIMARY KEY,
    user_id          BIGINT       REFERENCES users(user_id) ON DELETE SET NULL,
    trip_id          BIGINT       REFERENCES trips(trip_id) ON DELETE SET NULL,
    schedule_id      BIGINT       REFERENCES trip_schedules(schedule_id) ON DELETE SET NULL,
    number_of_people INTEGER,
    total_amount     NUMERIC(15,2),
    booking_status   VARCHAR(50)  NOT NULL DEFAULT 'PENDING', -- PENDING | CONFIRMED | CANCELLED
    special_requests TEXT,
    booked_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 13. BOOKING STATUS HISTORY
-- =============================================================================
CREATE TABLE booking_status_history (
    status_history_id BIGSERIAL    PRIMARY KEY,
    booking_id        BIGINT       NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    old_status        VARCHAR(50),
    new_status        VARCHAR(50)  NOT NULL,
    change_date       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 14. EMPLOYEES
-- =============================================================================
CREATE TABLE employees (
    employee_id BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       REFERENCES users(user_id) ON DELETE SET NULL,
    name        VARCHAR(255),
    department  VARCHAR(255),
    position    VARCHAR(255),
    base_salary NUMERIC(15,2),
    hire_date   DATE,
    status      VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE'
);

-- =============================================================================
-- 15. EXPENSES
-- =============================================================================
CREATE TABLE expenses (
    expense_id     BIGSERIAL    PRIMARY KEY,
    expense_amount NUMERIC(15,2),
    description    TEXT,
    category       VARCHAR(255),
    expense_date   DATE,
    status         VARCHAR(50)  NOT NULL DEFAULT 'PENDING'
);

-- =============================================================================
-- 16. REVENUES
-- =============================================================================
CREATE TABLE revenues (
    revenue_id     BIGSERIAL    PRIMARY KEY,
    revenue_amount NUMERIC(15,2),
    source         VARCHAR(255),
    revenue_date   DATE,
    description    TEXT,
    category       VARCHAR(255)
);

-- =============================================================================
-- 17. FINANCIAL TRANSACTIONS
-- =============================================================================
CREATE TABLE financial_transactions (
    transaction_id   BIGSERIAL    PRIMARY KEY,
    expense_id       BIGINT       REFERENCES expenses(expense_id) ON DELETE SET NULL,
    revenue_id       BIGINT       REFERENCES revenues(revenue_id) ON DELETE SET NULL,
    employee_id      BIGINT       NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
    transaction_type VARCHAR(50)  NOT NULL,   -- INCOME | EXPENSE
    amount           NUMERIC(15,2) NOT NULL,
    description      TEXT,
    transaction_date TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 18. FINANCE RECORDS  (general ledger convenience table)
-- =============================================================================
CREATE TABLE finance_records (
    id               BIGSERIAL    PRIMARY KEY,
    transaction_type VARCHAR(50),              -- income | expense
    amount           NUMERIC(15,2),
    description      TEXT,
    transaction_date DATE
);

-- =============================================================================
-- 19. FINANCIAL REPORTS
-- =============================================================================
CREATE TABLE financial_reports (
    report_id      BIGSERIAL    PRIMARY KEY,
    report_period  VARCHAR(100),              -- e.g. MONTHLY, QUARTERLY, ANNUAL
    start_date     DATE,
    end_date       DATE,
    generated_by   VARCHAR(255),
    total_revenue  NUMERIC(15,2),
    total_expense  NUMERIC(15,2),
    net_profit     NUMERIC(15,2),
    generated_date DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- =============================================================================
-- 20. PAYROLL PAYMENTS
-- =============================================================================
CREATE TABLE payroll_payments (
    payroll_id     BIGSERIAL    PRIMARY KEY,
    employee_id    BIGINT       NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    amount_paid    NUMERIC(15,2),
    paid_date      DATE,
    payment_method VARCHAR(100),
    status         VARCHAR(50)
);

-- =============================================================================
-- 21. SERVICE PROVIDER PAYMENTS
-- =============================================================================
CREATE TABLE service_provider_payments (
    provider_payment_id BIGSERIAL    PRIMARY KEY,
    provider_id         BIGINT       NOT NULL,
    amount              NUMERIC(15,2) NOT NULL,
    payment_date        DATE,
    status              VARCHAR(50),           -- PAID | PENDING
    service_type        VARCHAR(100)
);

-- =============================================================================
-- 22. GUIDES
-- =============================================================================
CREATE TABLE guides (
    guide_id           BIGSERIAL    PRIMARY KEY,
    user_id            BIGINT       REFERENCES users(user_id) ON DELETE SET NULL,
    name               VARCHAR(255),
    license_number     VARCHAR(100),
    specialization     VARCHAR(255),
    languages          TEXT,
    experience_years   INTEGER,
    certification_level VARCHAR(100),
    contact_email      VARCHAR(255),
    phone              VARCHAR(50),
    bio                TEXT,
    status             VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE'
);

-- =============================================================================
-- 23. GUIDE PERFORMANCES
-- =============================================================================
CREATE TABLE guide_performances (
    performance_id  BIGSERIAL    PRIMARY KEY,
    guide_id        BIGINT       NOT NULL REFERENCES guides(guide_id) ON DELETE CASCADE,
    average_rating  NUMERIC(3,2),
    total_reviews   INTEGER,
    evaluation_date DATE
);

-- =============================================================================
-- 24. GUIDE REVIEWS
-- =============================================================================
CREATE TABLE guide_reviews (
    review_id   BIGSERIAL    PRIMARY KEY,
    guide_id    BIGINT       NOT NULL REFERENCES guides(guide_id) ON DELETE CASCADE,
    user_id     BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating      SMALLINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    review_date TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 25. TRAINING ENROLLMENTS
-- =============================================================================
CREATE TABLE training_enrollments (
    training_id       BIGSERIAL    PRIMARY KEY,
    guide_id          BIGINT       NOT NULL REFERENCES guides(guide_id) ON DELETE CASCADE,
    training_name     VARCHAR(255),
    training_provider VARCHAR(255),
    enrollment_date   DATE,
    status            VARCHAR(50)            -- ENROLLED | COMPLETED | DROPPED
);

-- =============================================================================
-- 26. POST TRAINING EVALUATIONS
-- =============================================================================
CREATE TABLE post_training_evaluations (
    evaluation_id   BIGSERIAL    PRIMARY KEY,
    guide_id        BIGINT       NOT NULL REFERENCES guides(guide_id) ON DELETE CASCADE,
    training_id     BIGINT       NOT NULL REFERENCES training_enrollments(training_id) ON DELETE CASCADE,
    score           INTEGER,
    feedback        TEXT,
    evaluation_date DATE
);

-- =============================================================================
-- 27. TRAINING RECOMMENDATIONS
-- =============================================================================
CREATE TABLE training_recommendations (
    recommendation_id   BIGSERIAL    PRIMARY KEY,
    guide_id            BIGINT       NOT NULL REFERENCES guides(guide_id) ON DELETE CASCADE,
    program_name        VARCHAR(255),
    reason              TEXT,
    recommendation_date DATE
);

-- =============================================================================
-- 28. RIDER PROFILES
-- =============================================================================
CREATE TABLE rider_profiles (
    rider_id        BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       REFERENCES users(user_id) ON DELETE SET NULL,
    name            VARCHAR(255),
    license_number  VARCHAR(100),
    phone           VARCHAR(50),
    vehicle_type    VARCHAR(100),            -- CAR | VAN | BUS | TUKTU
    years_experience INTEGER,
    status          VARCHAR(50)  NOT NULL DEFAULT 'AVAILABLE'
);

-- =============================================================================
-- 29. VEHICLES
-- =============================================================================
CREATE TABLE vehicles (
    vehicle_id          BIGSERIAL    PRIMARY KEY,
    rider_id            BIGINT       NOT NULL REFERENCES rider_profiles(rider_id) ON DELETE CASCADE,
    vehicle_type        VARCHAR(100),
    registration_number VARCHAR(50) UNIQUE,
    model               VARCHAR(255),
    year                INTEGER,
    seating_capacity    INTEGER,
    status              VARCHAR(50)  NOT NULL DEFAULT 'AVAILABLE'
);

-- =============================================================================
-- 30. SERVICE PROVIDERS  (rides module – transport/service companies)
-- =============================================================================
CREATE TABLE service_providers (
    service_provider_id BIGSERIAL    PRIMARY KEY,
    user_id             BIGINT       REFERENCES users(user_id) ON DELETE SET NULL,
    service_type        VARCHAR(100),
    business_name       VARCHAR(255),
    contact_email       VARCHAR(255),
    phone               VARCHAR(50),
    address             TEXT,
    status              VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE'
);

-- =============================================================================
-- 31. SERVICE REQUESTS
-- =============================================================================
CREATE TABLE service_requests (
    request_id        BIGSERIAL    PRIMARY KEY,
    user_id           BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    pickup_location   VARCHAR(255),
    drop_location     VARCHAR(255),
    service_type      VARCHAR(100),
    status            VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    requested_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    number_of_people  INTEGER,
    notes             TEXT
);

-- =============================================================================
-- 32. RIDE REQUESTS
-- =============================================================================
CREATE TABLE ride_requests (
    id           BIGSERIAL    PRIMARY KEY,
    booking_id   BIGINT       REFERENCES bookings(booking_id) ON DELETE SET NULL,
    rider_name   VARCHAR(255),
    service_type VARCHAR(100),              -- Car | Van | Bus | Tuk
    status       VARCHAR(50)               -- PENDING | ASSIGNED | COMPLETED
);

-- =============================================================================
-- 33. RIDES
-- =============================================================================
CREATE TABLE rides (
    ride_id    BIGSERIAL    PRIMARY KEY,
    request_id BIGINT       NOT NULL REFERENCES ride_requests(id) ON DELETE CASCADE,
    rider_id   BIGINT       REFERENCES rider_profiles(rider_id) ON DELETE SET NULL,
    status     VARCHAR(50)  NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS | COMPLETED | CANCELLED
    fare       NUMERIC(15,2),
    start_time TIMESTAMP    NOT NULL DEFAULT NOW(),
    end_time   TIMESTAMP
);

-- =============================================================================
-- 34. RIDE LOCATIONS
-- =============================================================================
CREATE TABLE ride_locations (
    location_id   BIGSERIAL    PRIMARY KEY,
    ride_id       BIGINT       NOT NULL REFERENCES rides(ride_id) ON DELETE CASCADE,
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    location_name VARCHAR(255)
);

-- =============================================================================
-- 35. ASSIGNMENTS
-- =============================================================================
CREATE TABLE assignments (
    assignment_id       BIGSERIAL    PRIMARY KEY,
    rider_id            BIGINT       REFERENCES rider_profiles(rider_id) ON DELETE SET NULL,
    service_provider_id BIGINT       REFERENCES service_providers(service_provider_id) ON DELETE SET NULL,
    assignment_location VARCHAR(255),
    assignment_time     TIMESTAMP    NOT NULL DEFAULT NOW(),
    status              VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE'
);

-- =============================================================================
-- 36. TOUR PACKAGES
-- =============================================================================
CREATE TABLE tour_packages (
    package_id   BIGSERIAL    PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    description  TEXT,
    base_price   NUMERIC(15,2),
    duration     INTEGER,                   -- days
    image_url    VARCHAR(512),
    status       VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE'
);

-- =============================================================================
-- 37. PACKAGE OFFERS
-- =============================================================================
CREATE TABLE package_offers (
    offer_id      BIGSERIAL    PRIMARY KEY,
    package_id    BIGINT       NOT NULL REFERENCES tour_packages(package_id) ON DELETE CASCADE,
    offer_name    VARCHAR(255) NOT NULL,
    discount_type VARCHAR(50),              -- PERCENTAGE | FIXED
    value         NUMERIC(15,2),
    start_date    DATE,
    end_date      DATE
);

-- =============================================================================
-- 38. DISCOUNT CATEGORIES
-- =============================================================================
CREATE TABLE discount_categories (
    discount_id         BIGSERIAL    PRIMARY KEY,
    role_type           VARCHAR(100) NOT NULL,   -- TRAVELER | GUIDE | RIDER | etc.
    discount_percentage NUMERIC(5,2) NOT NULL,
    description         TEXT
);

-- =============================================================================
-- 39. PAYMENTS
-- =============================================================================
CREATE TABLE payments (
    payment_id      BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    package_id      BIGINT       REFERENCES tour_packages(package_id) ON DELETE SET NULL,
    booking_id      BIGINT       REFERENCES bookings(booking_id) ON DELETE SET NULL,
    amount          NUMERIC(15,2) NOT NULL,
    payment_method  VARCHAR(100),            -- CARD | WALLET | CASH
    payment_status  VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    transaction_date TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 40. WALLETS
-- =============================================================================
CREATE TABLE wallets (
    wallet_id   BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    balance     NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total_coins INTEGER       NOT NULL DEFAULT 0
);

-- =============================================================================
-- 41. WALLET TRANSACTIONS
-- =============================================================================
CREATE TABLE wallet_transactions (
    transaction_id   BIGSERIAL    PRIMARY KEY,
    wallet_id        BIGINT       NOT NULL REFERENCES wallets(wallet_id) ON DELETE CASCADE,
    coins            INTEGER,
    amount           NUMERIC(15,2),
    transaction_type VARCHAR(50),             -- CREDIT | DEBIT
    description      TEXT,
    transaction_date TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 42. COIN REDEMPTIONS
-- =============================================================================
CREATE TABLE coin_redemptions (
    redemption_id   BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    coins_used      INTEGER,
    discount_amount NUMERIC(15,2),
    redemption_date DATE         NOT NULL DEFAULT CURRENT_DATE
);


-- =============================================================================
-- INDEXES  (commonly queried FK columns)
-- =============================================================================
CREATE INDEX idx_sessions_user_id          ON sessions(user_id);
CREATE INDEX idx_password_resets_user_id   ON password_resets(user_id);
CREATE INDEX idx_audit_logs_user_id        ON audit_logs(user_id);
CREATE INDEX idx_staff_activity_user_id    ON staff_activity_logs(user_id);
CREATE INDEX idx_bookings_user_id          ON bookings(user_id);
CREATE INDEX idx_bookings_trip_id          ON bookings(trip_id);
CREATE INDEX idx_bookings_schedule_id      ON bookings(schedule_id);
CREATE INDEX idx_booking_hist_booking_id   ON booking_status_history(booking_id);
CREATE INDEX idx_trips_category_id         ON trips(category_id);
CREATE INDEX idx_trip_schedules_trip_id    ON trip_schedules(trip_id);
CREATE INDEX idx_employees_user_id         ON employees(user_id);
CREATE INDEX idx_fin_trans_employee_id     ON financial_transactions(employee_id);
CREATE INDEX idx_payroll_employee_id       ON payroll_payments(employee_id);
CREATE INDEX idx_guides_user_id            ON guides(user_id);
CREATE INDEX idx_guide_perf_guide_id       ON guide_performances(guide_id);
CREATE INDEX idx_guide_reviews_guide_id    ON guide_reviews(guide_id);
CREATE INDEX idx_training_enroll_guide_id  ON training_enrollments(guide_id);
CREATE INDEX idx_post_train_guide_id       ON post_training_evaluations(guide_id);
CREATE INDEX idx_rider_profiles_user_id    ON rider_profiles(user_id);
CREATE INDEX idx_vehicles_rider_id         ON vehicles(rider_id);
CREATE INDEX idx_service_req_user_id       ON service_requests(user_id);
CREATE INDEX idx_ride_req_booking_id       ON ride_requests(booking_id);
CREATE INDEX idx_rides_request_id          ON rides(request_id);
CREATE INDEX idx_ride_locations_ride_id    ON ride_locations(ride_id);
CREATE INDEX idx_pkg_offers_package_id     ON package_offers(package_id);
CREATE INDEX idx_payments_user_id          ON payments(user_id);
CREATE INDEX idx_payments_booking_id       ON payments(booking_id);
CREATE INDEX idx_wallet_trans_wallet_id    ON wallet_transactions(wallet_id);
CREATE INDEX idx_coin_redemptions_user_id  ON coin_redemptions(user_id);


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
