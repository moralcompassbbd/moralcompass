import { ApiError } from "../error";
import { logger } from "../logger";
import pool from "./pool";
import { User } from 'common/models';

export default {
    async retrieveOrInsertUser(googleId: string, name: string, email: string): Promise<User> {
        try {
            const userSelection = await pool.query(`
                WITH insertedUser AS (
                    INSERT INTO users (google_id, user_name, email)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (google_id) DO NOTHING
                    RETURNING 
                        user_id, google_id, user_name, email
                )
                SELECT 
                    user_id AS "userId", 
                    google_id AS "googleId", 
                    user_name AS "name", 
                    email
                FROM insertedUser
                UNION
                SELECT 
                    user_id AS "userId", 
                    google_id AS "googleId", 
                    user_name AS "name", 
                    email
                FROM users
                WHERE google_id = $1
                LIMIT 1;
            `, [googleId, name, email]);

            return userSelection.rows[0];
        } catch (error) {
            logger.error(error);
            throw new ApiError();
        }
    },
};
