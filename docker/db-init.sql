-- This script runs automatically when the MySQL container starts.
-- It grants the minimum required permissions for Prisma Migrate to the database user.

-- The "root" user is implicitly used by the MySQL image to run this script.

-- Ensure the user uses caching_sha2_password authentication
-- Note: The user is created by MySQL from MYSQL_USER env var, but we need to ensure it uses the correct auth plugin
ALTER USER 'timetable_user'@'%' IDENTIFIED WITH caching_sha2_password BY 'timetable_password';

-- Grant CREATE DATABASE, ALTER, and DROP privileges on ALL databases
-- to the database user (needed for Docker networking and Prisma migrations).
-- Note: Replace 'timetable_user' with your actual MYSQL_USER if different
GRANT CREATE, ALTER, DROP ON *.* TO 'timetable_user'@'%';

-- Flush privileges to make the change effective immediately.
FLUSH PRIVILEGES;

-- NOTE: We are granting more than strictly "create" because Prisma Migrate also needs
-- ALTER/DROP for its internal shadow database operations.

