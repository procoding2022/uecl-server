import pool from '../database/pool.js'; // Ensure you have the correct path to your dbConfig file

export const updatePost = async (req, res) => {
    const {currentTitle, newTitle , newContent} = req.body;

    if (!currentTitle || !newTitle || !newContent) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ msg: 'Error during connection' });
            }

            const query = 'UPDATE Posts SET title = ?, content = ? WHERE title = ?';
            connection.query(query, [newTitle, newContent, currentTitle], (error, results) => {
                connection.release();

                if (error) {
                    console.error('Query error:', error);
                    return res.status(500).json({ msg: 'Error during query' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ msg: 'Post not found' });
                }

                return res.status(200).json({ msg: 'Post updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error', error: error.message });
    }

};