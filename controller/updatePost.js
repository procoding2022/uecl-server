import { pool } from './dbConfig'; // Ensure you have the correct path to your dbConfig file
import fs from 'fs'; // For file system operations

export const updatePost = async (req, res) => {
    try {
        const { id, title, content } = req.body;
        const file = req.file;

        // Ensure ID is provided
        if (!id) {
            return res.status(400).json({ msg: 'Post ID is required' });
        }

        let filePath = null;

        if (file) {
            // Ensure the uploaded file is a PDF
            if (file.mimetype !== 'application/pdf') {
                return res.status(400).json({ msg: 'Invalid file type. Only PDF files are allowed.' });
            }

            filePath = file.path; // The path of the uploaded file

            // Normalize the file path to use forward slashes
            filePath = filePath.replace(/\\/g, '/');

            // Fetch the existing file path from the database to delete the old file
            const [rows] = await pool.query('SELECT pdf_file_path FROM Posts WHERE id = ?', [id]);
            if (rows.length > 0) {
                const oldFilePath = rows[0].pdf_file_path;
                if (oldFilePath && fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath); // Delete the old file
                }
            }
        }

        // Update post details and file path in the database
        const query = 'UPDATE Posts SET title = ?, content = ?, pdf_file_path = ? WHERE id = ?';
        const values = [title, content, filePath || null, id];

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ msg: 'Error during connection' });
            }

            connection.query(query, values, (error, results) => {
                connection.release();

                if (error) {
                    console.error('Query Error:', error);
                    return res.status(500).json({ msg: 'Database error' });
                }

                return res.status(200).json({ msg: 'Post updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error during update', error: error.message });
    }
};
