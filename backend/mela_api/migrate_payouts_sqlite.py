"""Database Migration script for Payout Accounts table in SQLite"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "mela_dev.db")


def migrate_payout_table():
    print(f"Connecting to SQLite database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payout_accounts (
        id VARCHAR(36) PRIMARY KEY,
        artisan_id VARCHAR(36) UNIQUE NOT NULL,
        account_holder_name VARCHAR(150) NOT NULL,
        payout_type VARCHAR(50) NOT NULL DEFAULT 'UPI',
        upi_id VARCHAR(100),
        account_masked VARCHAR(50),
        bank_name VARCHAR(100),
        ifsc_code VARCHAR(20),
        is_verified BOOLEAN DEFAULT 1,
        created_at DATETIME,
        updated_at DATETIME
    );
    """)

    conn.commit()
    conn.close()
    print("Payout table migration executed successfully.")


if __name__ == "__main__":
    migrate_payout_table()
