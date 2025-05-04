import pool from "./pool";
import { User } from 'common/models';

export default {
    async getById(user_id: number): Promise<User | undefined> {
        const result = await pool.query("SELECT user_id, google_id, user_name, email FROM users WHERE user_id = $1", [user_id]);
        const row = result.rows.at(0);

        if (!row)
            return undefined;

        return {
            userId: row.user_id,
            googleId: row.google_id,
            email: row.email,
            name: row.name,
        };
    },
};
