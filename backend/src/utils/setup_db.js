const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
    // Use default postgres db to create dating_app
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: process.env.USER || 'sahilkhan'
    });

    try {
        await client.connect();
        console.log('Connected to postgres default DB');

        // Check if dating_app exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'dating_app'");
        if (res.rows.length === 0) {
            await client.query('CREATE DATABASE dating_app');
            console.log('Database dating_app created');
        } else {
            console.log('Database dating_app already exists');
        }
        await client.end();

        // Now connect to dating_app and run schema
        const appClient = new Client({
            host: 'localhost',
            port: 5432,
            database: 'dating_app',
            user: process.env.USER || 'sahilkhan'
        });

        await appClient.connect();
        console.log('Connected to dating_app');

        const schemaPath = path.join(__dirname, '../../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split schema into individual statements
        const statements = schema.split(';').filter(s => s.trim().length > 0);

        for (const statement of statements) {
            try {
                await appClient.query(statement);
            } catch (e) {
                console.error('Error in statement:', statement);
                throw e;
            }
        }
        console.log('Schema applied successfully');

        await appClient.end();
    } catch (err) {
        console.error('Setup failed:', err.message);
        process.exit(1);
    }
}

setup();
