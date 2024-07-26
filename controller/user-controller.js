import jwt from 'jsonwebtoken';
import pool from '../database/pool.js'; // Make sure to use the correct import
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
export const loginUser = async (request, response) => {
    try {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return response.status(500).json({ msg: 'Error during connection' });
            }

            // 1. Fetch User from MySQL (Parameterized Query)
            const query = `SELECT * FROM users WHERE username = ?`;
            connection.query(query, [request.body.username], async (err, results) => {
                if (err) {
                    connection.release();
                    console.error('Query Error:', err);
                    return response.status(500).json({ msg: 'Query error' });
                }

                const user = results[0];
                if (!user) {
                    connection.release();
                    return response.status(400).json({ msg: 'Invalid username' });
                }

                let match = await bcrypt.compare(request.body.password, user.password);
                if (!match) {
                    connection.release();
                    return response.status(400).json({ msg: 'Incorrect password' });
                }

                // 3. Generate tokens
                const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET_KEY);

                // 4. Store refresh token (replace with your preferred storage mechanism if needed)
                const tokenQuery = `INSERT INTO token (tokenNumber) VALUES (?)`;
                connection.query(tokenQuery, [refreshToken], (err) => {
                    connection.release();
                    if (err) {
                        console.error('Token Query Error:', err);
                        return response.status(500).json({ msg: 'Error storing token' });
                    }

                    return response.status(200).json({
                        accessToken,
                        refreshToken,
                        name: user.name,
                        username: user.username
                    });
                });
            });
        });
    } catch (error) {
        console.error('Login Error:', error);
        return response.status(500).json({ msg: 'Error during login', error: error.message });
    }
};

export const newsletterEE = async (request, response) => {
    try {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return response.status(500).json({ msg: 'Error during connection' });
            }

            const query = `INSERT INTO Newsletter (email,date) VALUES (?,?)`;
            connection.query(query, [request.body.email,request.body.date], async (err, results) => {
                if (err) {
                    connection.release();
                    console.error('Query Error:', err);
                    return response.status(500).json({ msg: 'Query error' });
                }

               return response.status(200).json({ msg: 'Email added to newsletter' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ msg: 'Error', error: error.message });
    }
};

export const formSubmit = async (request, response) => {
    try {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.error('Error getting connection:', err);
                return response.status(500).json({ msg: 'Error during connection' });
            }
            const { firstname, lastname, number, email, description } = request.body;
            const query = `INSERT INTO ContactUs (FirstName,LastName,MobileNo,Email,Description) VALUES (?,?,?,?,?)`;
            connection.query(query, [firstname, lastname, number, email, description], async (err, results) => {
                if (err) {
                    connection.release();
                    console.error('Query Error:', err);
                    return response.status(500).json({ msg: 'Query error' });
                }

               return response.status(200).json({ msg: 'Form Submitted Successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ msg: 'Error', error: error.message });
    }
};

    export const userSignup = async (request, response) => {
        try {
            pool.getConnection(async (err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err);
                    return response.status(500).json({ msg: 'Error during connection' });
                }

                const { username, name, password } = request.body;

                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password,salt);

                const query = `INSERT INTO users (username, name, password) VALUES (?, ?, ?)`;
                connection.query(query, [username, name, hashedPassword], async (err, results) => {
                    connection.release(); // Ensure connection is released

                    if (err) {
                        console.error('Query Error:', err);
                        return response.status(500).json({ msg: 'Query error' });
                    }

                    return response.status(200).json({ msg: 'User added successfully' });
                });
            });
        } catch (error) {
            console.error('Error:', error);
            return response.status(500).json({ msg: 'Error', error: error.message });
        }
    };


    export const newsletterFetch = async (req, res) => {
        try {
          pool.getConnection((err, connection) => {
            if (err) {
              console.error('Error getting connection:', err);
              return res.status(500).json({ msg: 'Error during connection' });
            }
      
            const query = 'SELECT email, date FROM Newsletter';
            connection.query(query, (error, results) => {
              connection.release();
      
              if (error) {
                console.error('Query error:', error);
                return res.status(500).json({ msg: 'Error during query' });
              }
      
              return res.status(200).json(results);
            });
          });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ msg: 'Error', error: error.message });
        }
      };

      export const userfetch = async (req, res) => {
        try {
          pool.getConnection((err, connection) => {
            if (err) {
              console.error('Error getting connection:', err);
              return res.status(500).json({ msg: 'Error during connection' });
            }
      
            const query = 'SELECT username,name FROM users';
            connection.query(query, (error, results) => {
              connection.release();
      
              if (error) {
                console.error('Query error:', error);
                return res.status(500).json({ msg: 'Error during query' });
              }
      
              return res.status(200).json(results);
            });
          });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ msg: 'Error', error: error.message });
        }
      };

      export const updateUser = async (req, res) => {
        const { currentUsername, newUsername, newName } = req.body;
    
        if (!currentUsername || !newUsername || !newName) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }
    
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err);
                    return res.status(500).json({ msg: 'Error during connection' });
                }
    
                const query = 'UPDATE users SET username = ?, name = ? WHERE username = ?';
                connection.query(query, [newUsername, newName, currentUsername], (error, results) => {
                    connection.release();
    
                    if (error) {
                        console.error('Query error:', error);
                        return res.status(500).json({ msg: 'Error during query' });
                    }
    
                    if (results.affectedRows === 0) {
                        return res.status(404).json({ msg: 'User not found' });
                    }
    
                    return res.status(200).json({ msg: 'User updated successfully' });
                });
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ msg: 'Error', error: error.message });
        }
    };

    export const deleteUser = async (req, res) => {
        const { username } = req.params;
    
        if (!username) {
            return res.status(400).json({ msg: 'Missing required field: username' });
        }
    
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err);
                    return res.status(500).json({ msg: 'Error during connection' });
                }
    
                const query = 'DELETE FROM users WHERE username = ?';
                connection.query(query, [username], (error, results) => {
                    connection.release();
    
                    if (error) {
                        console.error('Query error:', error);
                        return res.status(500).json({ msg: 'Error during query' });
                    }
    
                    if (results.affectedRows === 0) {
                        return res.status(404).json({ msg: 'User not found' });
                    }
    
                    return res.status(200).json({ msg: 'User deleted successfully' });
                });
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ msg: 'Error', error: error.message });
        }
    };


    export const contactUsFetch = async (req, res) => {
        try {
          pool.getConnection((err, connection) => {
            if (err) {
              console.error('Error getting connection:', err);
              return res.status(500).json({ msg: 'Error during connection' });
            }
      
            const query = 'SELECT FirstName, LastName, MobileNo, Email, Description FROM ContactUs';
            connection.query(query, (error, results) => {
              connection.release();
      
              if (error) {
                console.error('Query error:', error);
                return res.status(500).json({ msg: 'Error during query' });
              }
      
              return res.status(200).json(results);
            });
          });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ msg: 'Error', error: error.message });
        }
      };

      export const postFetch = async (req, res) => {
        try {
          pool.getConnection((err, connection) => {
            if (err) {
              console.error('Error getting connection:', err);
              return res.status(500).json({ msg: 'Error during connection' });
            }
      
            const query = 'SELECT * FROM Posts';
            connection.query(query, (error, results) => {
              connection.release();
      
              if (error) {
                console.error('Query error:', error);
                return res.status(500).json({ msg: 'Error during query' });
              }
      
              return res.status(200).json(results);
            });
          });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ msg: 'Error', error: error.message });
        }
      };

      export const getPostById = async (req, res) => {
        try {
          pool.getConnection((err, connection) => {
            if (err) {
              console.error('Error getting connection:', err);
              return res.status(500).json({ msg: 'Error during connection' });
            }
            const {id} = req.params;
      
            const query = 'SELECT * FROM Posts WHERE title = ?';
            connection.query(query, [id], (error, results) => {
              connection.release();
      
              if (error) {
                console.error('Query error:', error);
                return res.status(500).json({ msg: 'Error during query' });
              }
      
              return res.status(200).json(results);
            });
          });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ msg: 'Error', error: error.message });
        }
      };

