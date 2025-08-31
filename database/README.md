# Database

This directory contains the database dump file for the PS3Stack Voting System.

## Files

- `database.bak` - PostgreSQL database dump containing sample data

## Database Restoration

To restore the database with sample data, use the following command:

```bash
pg_restore -v -d "<neon_database_connection_string>" database/database.bak
```

### Example with Neon DB

```bash
pg_restore -v -d "postgresql://username:password@host.neon.tech:5432/database?sslmode=require" database/database.bak
```

## Database Contents

The database dump includes:

### Core Tables
- `users` - User accounts for all roles
- `elections` - Election definitions and configurations
- `candidates` - Candidate information with photo URLs
- `votes` - Vote records
- `voters` - Voter registration data

### Sample Data
- **Elections**: Pre-configured elections with candidates
- **Users**: Demo accounts for testing (admin, observer, field staff, polling staff, voters)
- **Candidates**: Sample candidates with photos from Unsplash
- **Census Data**: Population and household records

### Demo Accounts

| Role | Email | Password | Role ID |
|------|-------|----------|---------|
| Admin | admin@test.com | password123 | 1 |
| Observer | observer@test.com | password123 | 2 |
| Field Staff | field@test.com | password123 | 3 |
| Polling Staff | polling@test.com | password123 | 4 |
| Voter | voter1@test.com | password123 | 5 |

## Schema Updates

If you need to update the database schema, check the individual service directories for migration scripts:

- `services/auth_service/database_migration.sql`
- `services/election_service/database_migration.sql`
- `services/voter_service/database_migration.sql`
- `services/census_service/database_migration.sql`

## Manual Setup

If you prefer to set up the database manually without the dump file, each service includes:
- Schema definitions in their respective README files
- Sample data creation in service initialization code
- Migration scripts for schema updates
