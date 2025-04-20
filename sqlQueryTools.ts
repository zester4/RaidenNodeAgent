import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { z } from 'zod';

// Function to execute SQL queries
export async function executeSqlQuery(databasePath: string, query: string): Promise<string> {
    try {

        const db = await open({
            filename: databasePath,
            driver: sqlite3.Database
        })

        const result = await db.all(query)

        await db.close()

        return `SQL query executed successfully. Result: ${JSON.stringify(result)}`

    } catch (error: any) {
        console.error('Error executing SQL query:', error);
        return `Could not execute SQL query. ${error.message}`;
    }
}