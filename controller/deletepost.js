import { pool } from './dbConfig'; // Ensure you have the correct path to your dbConfig file
import fs from 'fs'; // For file system operations

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure ID is provided
        if (!id) {
            return res.status(400).json({ msg: 'Post ID is required' });
        }

        // Fetch the existing file path from the database to delete the file
        const [rows] = await pool.query('SELECT pdf_file_path FROM Posts WHERE id = ?', [id]);
        if (rows.length > 0) {
            const filePath = rows[0].pdf_file_path;
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file
            }
        }

        // Delete the post record from the database
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ msg: 'Error during connection' });
            }

            connection.query('DELETE FROM Posts WHERE id = ?', [id], (error, results) => {
                connection.release();

                if (error) {
                    console.error('Query Error:', error);
                    return res.status(500).json({ msg: 'Database error' });
                }

                return res.status(200).json({ msg: 'Post deleted successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error during deletion', error: error.message });
    }
};
