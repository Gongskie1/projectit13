const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const app = express();
const port = 8081;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], methods:['GET,HEAD,PUT,PATCH,POST,DELETE'], credentials: true }));
app.use(express.json()); 
app.use(session(
  {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24
    }
  }
));



const db = mysql.createConnection({
    host: 'localhost',
    user: 'joseph',
    password: 'NANBAKA123',
    database: 'react_node'
});
// ------------------------------------------------------------------------
// REGISTER ACCOUNTS 
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    const query = "INSERT INTO user_register (email, username, password) VALUES (?, ?, ?) ";

    db.query(query, [email,username,password], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});
// ------------------------------------------------------------------------
// Endpoint to check if email exists
app.get('/check', (req, res) => {
    let { email } = req.query;
    const query = "SELECT email FROM user_register WHERE email=?";

    db.query(query, [email], (error, result) => {
        if (error) return res.json(false);
        const dataExists = result.length > 0;
        console.log(dataExists); 
        return res.json({ exists: dataExists });
    });
});
// ------------------------------------------------------------------------
// UPLOAD MESSAGE AND PHOTO OR FILES 

app.post("/upload", upload.single("imageUpload"), (req, res) => {
  const { message } = req.body;
  const imageUpload = req.file.buffer.toString('base64');

  const query = "INSERT INTO user_posts (user_id, message, image_upload, profile_name) VALUES (?,?,?,?)";  
  const profileName = req.session.profile_name;
  const user_id = req.session.user_id;

  db.query(query, [user_id ,message, imageUpload,profileName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(result)

    // Assuming 'result' contains the information about the inserted row
    return res.status(200).json({ success: true, insertedRow: result });
  });
});

app.get('/user-upload', (request, response) => {
 

  const sql = 'SELECT * FROM user_posts';


    db.query(sql, (error, data) => {
      if (error) return response.json(error);
      // console.log(request.session.email)
      return response.json({data:data});
    });
});
// ------------------------------------------------------------------------
// DELETE USER POSTS
app.delete('/delete/:id', (request, res) => {
    const id = request.params.id;
    console.log('Received DELETE request for post with id:', id);

    request.session.delete = id;
    console.log('Stored id in session:', request.session.delete);

    const sql = 'DELETE FROM user_posts WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error('Error deleting post:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(`Post with id ${id} deleted successfully`);
            res.send('User deleted');
        }
    });
});
// ------------------------------------------------------------------------
// GETTING DATA 
app.get('/posts/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'SELECT * FROM user_posts WHERE id=?';

    db.query(sql, [id], (error, data) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }

        if (data.length === 0) {
            return response.status(404).json({ error: 'Post not found' });
        }

        const post = data[0];
        return response.json(post);
    });
});

// Update a post
app.put('/posts/:id', upload.single('image_upload'), (request, response) => {
    const id = request.params.id;
    const { message, profile_name } = request.body;
     const image_upload = request.file.buffer.toString('base64');

    console.log( image_upload);

    const sql = "UPDATE user_posts SET message=?, image_upload=?, profile_name=? WHERE id=?";
    const params = [message, image_upload, profile_name, id];  // Use uploadedFile.buffer

    db.query(sql, params, (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.affectedRows === 0) {
            return response.status(404).json({ error: 'Post not found' });
        }

        response.json({ message: 'User updated' });
    });
});

// ------------------------------------------------------------------------
app.get('/getcredentials', (req, res) => {
  const sql = `SELECT * FROM user_posts WHERE user_id = ? LIMIT 1`;
  const user_id = req.session.user_id;

  db.query(sql, [user_id], (error, data) => {
    if (error) return res.json(error);
    const result = data.length > 0 ? data[0] : null;
    return res.json(result);
  });
});

// ------------------------------------------------------------------------
// FINDING USER
app.post('/auth', async (req, res) => {
  const { username, password, email} = req.body;

  try {
    const result = await new Promise((resolve, reject) => {
      const q = 'SELECT * FROM user_register WHERE username=? AND password=? LIMIT 1';
      db.query(q, [username, password, email], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const dataExists = result.length > 0;
    if (dataExists) {
      req.session.profile_name = result[0].profile_name;
      req.session.user_id = result[0].id;
      req.session.email = result[0].email 
      // console.log('Session after setting email:', req.session);
      // console.log('req.session.email:', req.session.profile_name);
      console.log('ID NAKO NI:', req.session.email);
      return res.json({ exists: dataExists });
    }
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ------------------------------------------------------------------------
// DISPLAY ALL USERS ACCOUNT
app.get('/accounts', (request, response) => { 
    const sql = 'SELECT * FROM user_register';
    db.query(sql, (error, data) => { 
        if (error) return response.json(error)
        return response.json(data)
     }); 
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});