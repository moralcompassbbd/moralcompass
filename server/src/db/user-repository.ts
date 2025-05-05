import { ApiError } from "../error";
import pool from "./pool";
import { User } from 'common/models';

export default {
    async getOrInsert(googleId: string, name: string, email: string): Promise<User> {
        try {
            const result = await pool.query('INSERT INTO users (google_id, user_name, email) VALUES ($1, $2, $3) ON CONDLICT DO UPDATE user_id = user_id RETURNING user_id, google_id, user_name, email', [googleId, name, email]);
            const row = result.rows[0];

            return {
                userId: row.user_id,
                googleId: row.google_id,
                email: row.email,
                name: row.name,
            };
        } catch {
            throw new ApiError();
        }
    },
};
