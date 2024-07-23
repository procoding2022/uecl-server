import { pool } from './dbConfig'; // Ensure you have the correct path to your dbConfig file

export const uploadImage = async (req, res) => {
    try {
        const { title, content } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Ensure the uploaded file is a PDF
        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ msg: 'Invalid file type. Only PDF files are allowed.' });
        }

        // Insert post details and file path into the database
        let filePath = file.path; // The path of the uploaded file

        // Normalize the file path to use forward slashes
        filePath = filePath.replace(/\\/g, '/');

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ msg: 'Error during connection' });
            }

            const query = 'INSERT INTO Posts (title, content, pdf_file_path) VALUES (?, ?, ?)';
            connection.query(query, [title, content, filePath], (error, results) => {
                connection.release();

                if (error) {
                    console.error('Query Error:', error);
                    return res.status(500).json({ msg: 'Database error' });
                }

                return res.status(200).json({ msg: 'Post created successfully', filePath });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error during upload', error: error.message });
    }
};
