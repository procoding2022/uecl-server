import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const Connection = (host, user, password, database, callback) => {
    const DB = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    DB.connect((err) => {
        if (err) {
            console.log("error connecting to database ", err);
            return;
        }
        console.log("Connected Successfully to database");
    });
};
export default Connection;

