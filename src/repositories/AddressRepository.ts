import Database from 'better-sqlite3';
import { AppError } from '../errors/AppError';

interface Address {
    id: number;
    address: string;
    label: string;
    created_at: string;
}

interface AddressData {
    address: string;
    label: string;
}

export class AddressRepository {
    db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
        this._ensureSchema();
    }

    private _ensureSchema(): void {
        this.db.exec(`
        CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            address TEXT NOT NULL UNIQUE,
            label TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        `);
    }

    create(data: AddressData): Address {
        try {
            const stmt = this.db.prepare(
                'INSERT INTO addresses (address, label) VALUES (?, ?)'
            );
            const info = stmt.run(data.address, data.label);
            return {
                id: Number(info.lastInsertRowid),
                address: data.address,
                label: data.label,
                created_at: new Date().toISOString()
            };
        } catch (err) {
            const error = err as NodeJS.ErrnoException;
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new AppError(`Address '${data.address}' already exists`, 409);
            }
            throw new AppError(`Failed to create address: ${error.message}`, 500);
        }
    }

    findAll(): Address[] {
        try {
            return this.db.prepare(
                'SELECT id, address, label, created_at FROM addresses ORDER BY id DESC'
            ).all() as Address[];
        } catch (err) {
            throw new AppError(`Failed to fetch addresses: ${(err as Error).message}`, 500);
        }
    }

    findById(id: number): Address | undefined {
        try {
            return this.db.prepare(
                'SELECT id, address, label, created_at FROM addresses WHERE id = ?'
            ).get(id) as Address | undefined;
        } catch (err) {
            throw new AppError(`Failed to find address by id ${id}: ${(err as Error).message}`, 500);
        }
    }

    findByAddress(address: string): Address | undefined {
        try {
            return this.db.prepare(
                'SELECT id, address, label, created_at FROM addresses WHERE address = ?'
            ).get(address) as Address | undefined;
        } catch (err) {
            throw new AppError(`Failed to find address: ${(err as Error).message}`, 500);
        }
    }

    update(id: number, data: Partial<AddressData>): Address | undefined {
        try {
            const existing = this.findById(id);
            if (!existing) return undefined;

            const sets: string[] = [];
            const params: unknown[] = [];

            if (data.address !== undefined) {
                sets.push('address = ?');
                params.push(data.address);
            }

            if (data.label !== undefined) {
                sets.push('label = ?');
                params.push(data.label);
            }

            if (sets.length === 0) return existing;

            params.push(id);
            this.db.prepare(
                `UPDATE addresses SET ${sets.join(', ')} WHERE id = ?`
            ).run(params);

            return this.findById(id);
        } catch (err) {
            const error = err as NodeJS.ErrnoException;
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new AppError(`Address '${data.address}' is already taken`, 409);
            }
            throw new AppError(`Failed to update address ${id}: ${error.message}`, 500);
        }
    }

    remove(id: number): boolean {
        try {
            const info = this.db.prepare('DELETE FROM addresses WHERE id = ?').run(id);
            return info.changes > 0;
        } catch (err) {
            throw new AppError(`Failed to delete address ${id}: ${(err as Error).message}`, 500);
        }
    }

    clear(): void {
        this.db.exec('DELETE FROM addresses');
        this.db.exec("DELETE FROM sqlite_sequence WHERE name = 'addresses'");
    }
}

module.exports = AddressRepository;
module.exports.AddressRepository = AddressRepository;