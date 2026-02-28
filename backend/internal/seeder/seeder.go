package seeder

import (
	"database/sql"
	"log"
	"math/rand"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Seed initializes the database schema and seeds default data.
// It is safe to call on every startup — it only inserts when tables are empty.
func Seed(db *sql.DB) error {
	if err := createTables(db); err != nil {
		return err
	}
	if err := seedUsers(db); err != nil {
		return err
	}
	if err := seedPayments(db); err != nil {
		return err
	}

	const dbLifetime = time.Minute * 5
	db.SetConnMaxLifetime(dbLifetime)
	return nil
}

// Ensure the required tables exist.
func createTables(db *sql.DB) error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS users (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  email TEXT NOT NULL UNIQUE,
		  password_hash TEXT NOT NULL,
		  role TEXT NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS payments (
		  id TEXT PRIMARY KEY,
		  merchant TEXT NOT NULL,
		  status TEXT NOT NULL,
		  amount TEXT NOT NULL,
		  created_at DATETIME NOT NULL
		);`,
	}
	for _, s := range stmts {
		if _, err := db.Exec(s); err != nil {
			return err
		}
	}
	return nil
}

// Inserts default user accounts when the users table is empty.
func seedUsers(db *sql.DB) error {
	var cnt int
	if err := db.QueryRow("SELECT COUNT(1) FROM users").Scan(&cnt); err != nil {
		return err
	}
	if cnt > 0 {
		return nil
	}

	defaultHash, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	defaultUsers := []struct {
		email string
		hash  []byte
		role  string
	}{
		{"cs@test.com", defaultHash, "cs"},
		{"operation@test.com", defaultHash, "operation"},
	}

	for _, u := range defaultUsers {
		if _, err := db.Exec(
			"INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)",
			u.email, string(u.hash), u.role,
		); err != nil {
			return err
		}
	}

	// Superuser account with a stronger password
	superuserHash, err := bcrypt.GenerateFromPassword([]byte("Password@123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	if _, err := db.Exec(
		"INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)",
		"superuser@test.com", string(superuserHash), "superuser",
	); err != nil {
		return err
	}

	log.Println("seeded default users")
	return nil
}

// Inserts sample payment records when the payments table is empty.
func seedPayments(db *sql.DB) error {
	var cnt int
	if err := db.QueryRow("SELECT COUNT(1) FROM payments").Scan(&cnt); err != nil {
		return err
	}
	if cnt > 0 {
		return nil
	}

	payments := []struct {
		id       string
		merchant string
		status   string
		amount   string
	}{
		{"pay_001", "Tokopedia", "completed", "50000.00"},
		{"pay_002", "Shopee", "processing", "75000.00"},
		{"pay_003", "Bukalapak", "failed", "25000.00"},
		{"pay_004", "Lazada", "completed", "100000.00"},
		{"pay_005", "Blibli", "completed", "150000.00"},
		{"pay_006", "Gojek", "processing", "45000.00"},
		{"pay_007", "Grab", "failed", "82000.00"},
		{"pay_008", "Traveloka", "completed", "200000.00"},
		{"pay_009", "Dana", "completed", "35000.00"},
		{"pay_010", "OVO", "processing", "62000.00"},
		{"pay_011", "LinkAja", "completed", "88000.00"},
		{"pay_012", "Tiket.com", "failed", "120000.00"},
		{"pay_013", "Akulaku", "completed", "47000.00"},
		{"pay_014", "Kredivo", "processing", "93000.00"},
		{"pay_015", "JD.ID", "completed", "155000.00"},
		{"pay_016", "Alfamart", "completed", "12000.00"},
		{"pay_017", "Indomaret", "processing", "18500.00"},
		{"pay_018", "Bank BCA", "completed", "500000.00"},
		{"pay_019", "Bank Mandiri", "failed", "250000.00"},
		{"pay_020", "Telkomsel", "completed", "50000.00"},
		{"pay_021", "XL Axiata", "processing", "75000.00"},
		{"pay_022", "Indosat", "completed", "30000.00"},
		{"pay_023", "Pertamina", "completed", "350000.00"},
		{"pay_024", "PLN", "failed", "175000.00"},
		{"pay_025", "BPJS Kesehatan", "completed", "42000.00"},
		{"pay_026", "Garuda Indonesia", "processing", "2500000.00"},
		{"pay_027", "Lion Air", "completed", "850000.00"},
		{"pay_028", "Pos Indonesia", "failed", "15000.00"},
		{"pay_029", "JNE Express", "completed", "28000.00"},
		{"pay_030", "SiCepat", "processing", "22000.00"},
		{"pay_031", "Anteraja", "completed", "19500.00"},
		{"pay_032", "Tokopedia Official", "completed", "1250000.00"},
		{"pay_033", "Shopee Mall", "failed", "975000.00"},
		{"pay_034", "Blibli Official", "processing", "3200000.00"},
		{"pay_035", "Apple Store ID", "completed", "1599000.00"},
		{"pay_036", "Google Play ID", "completed", "49000.00"},
		{"pay_037", "Netflix ID", "processing", "186000.00"},
		{"pay_038", "Spotify ID", "completed", "54990.00"},
		{"pay_039", "Disney+ Hotstar", "failed", "39000.00"},
		{"pay_040", "Vidio Premium", "completed", "59000.00"},
	}

	now := time.Now()
	rng := rand.New(rand.NewSource(42))
	for _, p := range payments {
		daysAgo := rng.Intn(30)
		hoursAgo := rng.Intn(24)
		ts := now.AddDate(0, 0, -daysAgo).Add(-time.Duration(hoursAgo) * time.Hour)

		if _, err := db.Exec(
			"INSERT INTO payments(id, merchant, status, amount, created_at) VALUES (?, ?, ?, ?, ?)",
			p.id, p.merchant, p.status, p.amount, ts.Format(time.RFC3339),
		); err != nil {
			return err
		}
	}

	log.Println("seeded sample payments")
	return nil
}
