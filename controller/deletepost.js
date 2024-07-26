import pool from '../database/pool.js'; // Ensure you have the correct path to your dbConfig file
import fs from 'fs'; // For file system operations

export const deletePost = async (req, res) => {
    const {title} = req.params;

    if (!title) {
        return res.status(400).json({ msg: 'Missing required field: title' });
    }

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ msg: 'Error during connection' });
            }

            const query = 'DELETE FROM Posts WHERE title = ?';
            connection.query(query, [title], (error, results) => {
                connection.release();

                if (error) {
                    console.error('Query error:', error);
                    return res.status(500).json({ msg: 'Error during query' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ msg: 'Post not found' });
                }

                return res.status(200).json({ msg: 'Post deleted successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error', error: error.message });
    }
};
