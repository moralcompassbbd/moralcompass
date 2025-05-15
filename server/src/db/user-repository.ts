import pool from "./pool";
import { User } from 'common/models';

export default {
    async insertAndRetrieveUser(googleId: string, name: string, email: string): Promise<User> {
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
    },
    async checkIfUserIsManager(googleId: string): Promise<boolean>{
        const userSelection = await pool.query(`
            SELECT EXISTS (
                SELECT users.user_id
                FROM users
                INNER JOIN user_roles ON users.user_id = user_roles.user_id
                INNER JOIN roles ON roles.role_id = user_roles.role_id
                WHERE 
                    users.google_id = $1 
                    AND 
                    roles.role_name = 'Manager'
            ) AS user_exists;
        `, [googleId]);

        return userSelection.rows[0].user_exists;
    },
    async makeUserManager(userId: string): Promise<boolean>{
        const userSelection = await pool.query(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, (SELECT role_id FROM roles WHERE role_name = 'Manager'))
            RETURNING *;
        `, [userId]);

        return userSelection.rowCount ? userSelection.rowCount > 0 : false;
    },
    async demoteUserManagerStatus(userId: string): Promise<boolean>{
        const userSelection = await pool.query(`DELETE FROM user_roles WHERE user_id = $1;`, [userId]);

        return userSelection.rowCount ? userSelection.rowCount > 0 : false;
    },
    async getAllUsers(): Promise<any[]>{
        const userSelection = await pool.query(`
            SELECT 
                users.user_id AS "userId", 
                users.google_id AS "googleId", 
                users.user_name AS "name", 
                users.email,
                roles.role_name AS "roleName"
            FROM users
                LEFT JOIN user_roles ON users.user_id = user_roles.user_id
                LEFT JOIN roles ON roles.role_id = user_roles.role_id
        `);

        return userSelection.rows;
    },
    async getUserByGoogleId(googleId: string): Promise<User | null>{
        const result = await pool.query(
            'SELECT user_id, google_id, email, user_name FROM users WHERE google_id = $1 LIMIT 1',
            [googleId],
        );

        const row = result.rows.at(0);

        if (!row) {
            return null;
        }

        return {
            userId: row.user_id,
            googleId: row.google_id,
            email: row.email,
            name: row.user_name,
            roleName: row
        };
    },
    async getGoogleSub(userId: string): Promise<string>{
        const googleSubSelection = await pool.query(`
            SELECT 
                google_id AS "googleId"
            FROM users
                WHERE user_id = $1 
        `, [userId]);

        return googleSubSelection.rows.length > 0 ? googleSubSelection.rows[0].googleId : "";
    },
};
