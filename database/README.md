# Database Management

This directory manages database schemas, versioned migrations (Alembic), and baseline seed data.

## Structure
- `migrations/`: Alembic migration scripts tracking relational schema changes over time.
- `schema/`: Raw SQL definitions (`001_initial_schema.sql`) for clean bootstrapping and Docker entrypoint initialization.
- `seed/`: Seed records (`001_initial_seed.sql`) containing craft categories, default artisan personas, and geographic clusters.
