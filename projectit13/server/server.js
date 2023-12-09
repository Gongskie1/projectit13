const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const app = express();
const port = 8083;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const http = require("http");
const {Server} = require("socket.io");
const { default: axios } = require('axios');
// const server = http.createServer(app);
const { createProxyMiddleware } = require('http-proxy-middleware');
// const httpProxy = require('http-proxy');
// const proxy = httpProxy.createProxyServer();

// app.use((req, res) => {
//   proxy.web(req, res, { target: 'https://api.chatengine.io', changeOrigin: true });
// });
// const io = new Server(server,{
//   cors:{
//     origin: "http://localhost:5173",
//     methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']
//   },
//   path: "/socket.io",
// });

// app.use(
//   'http://localhost:8083/api/users/search/',  // Change '/api' to whatever path you want to use for proxying
//   createProxyMiddleware({
//     target: 'https://api.chatengine.io/users/search/',
//     changeOrigin: true,
//     pathRewrite: {
//       'http://localhost:8083/api/users/search/': 'http://localhost:8083/api/users/search/',  // Remove the '/api' prefix when forwarding the request
//     },
    
//   })
// );

app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Check if the origin is allowed
//     const allowedOrigins = ['https://api.chatengine.io/users/search/',"http://localhost:5173"];
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Content-Type,Authorization',
//   credentials: true,
// };
// app.use(
//   "/api", // Adjust the path as needed
//   createProxyMiddleware({
//     target: "https://api.chatengine.io", // Chat Engine API URL
//     changeOrigin: true,
//     secure: false, // For development, you can set it to false
//   })
// );
// app.use(cors(corsOptions));
app.use(express.json()); 
app.use(session(
  {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  }
));
// const whitelist = ["https://api.chatengine.io/users/search"]; 

// const corsOptions = { 
//     origin: (origin, callback) => { 
//         if (!origin || whitelist.includes(origin)) { 
//             callback(null, true); 
//         } else { 
//             callback(new Error("Not allowed by CORS")); 
//         } 
//     }, 
//     credentials: true, 
// }; 
// app.use(cors(corsOptions));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'joseph',
    password: 'NANBAKA123',
    database: 'react_node'
});
// ------------------------------------------------------------------------
// REGISTER ACCOUNTS 
app.post('/register', upload.single('profile_picture'), (req, res) => {
    const { email, username, password,profile_name } = req.body;
    const profile_picture = req.file.buffer.toString('base64');
    const query = "INSERT INTO user_register (email, username, password, profile_name, profile_picture) VALUES (?, ?,?, ?, ?) ";
    // console.log(profile_picture);
    db.query(query, [email, username, password, profile_name, profile_picture], (err, result) => {
    if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
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
  
  const query = "INSERT INTO user_posts (user_id, message, image_upload, profile_name,profile_picture) VALUES (?,?,?,?,?)";  
  const profileName = req.session.profile_name;
  const profile_picture = req.session.profile_picture;
  const user_id = req.session.user_id;

  db.query(query, [user_id ,message, imageUpload,profileName,profile_picture], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(result)

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
    // console.log('Stored id in session:', request.session.delete);

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
    const { message } = request.body;
     const image_upload = request.file.buffer.toString('base64');

    // console.log( image_upload);

    const sql = "UPDATE user_posts SET message=?, image_upload=? WHERE id=?";
    const params = [message, image_upload, id]; 

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
// getting all data from, user_register
app.get('/getcredentials', (req, res) => {
  const sql = `SELECT * FROM user_register WHERE id = ? LIMIT 1`;
  const id = req.session.user_id;
  console.log(id)
  db.query(sql, [id], (error, data) => {
    if (error) return res.json(error);
    const result = data.length > -1 ? data[0] : null;
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
    // console.log(dataExists);
    // res.json({exists:dataExists});
    if (dataExists) {
      req.session.profile_name = result[0].profile_name;
      req.session.user_id = result[0].id;
      req.session.email = result[0].email;
      req.session.profile_picture = result[0].profile_picture;
      // console.log('Session after setting email:', req.session);
      // console.log('req.session.profile_picture:', req.session.profile_picture);
      // console.log('ID NAKO NI:', req.session.user_id);
      return res.json({ exists: dataExists });
    }else{
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
// ------------------------------------------------------------------------
// for message socket.io

// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on("join_room", (data)=>{
//         socket.join(data);
//         console.log(`User With ID: ${socket.id} joined room: ${data}`)
//     });

//     socket.on("send_message", (data)=>{
//         console.log(data)
//         socket.to(data.room).emit('receive_message',data);
//     });

//     socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

// ----------------------------------------------------------------------
// Chat Back-end
// app.post("/authenticate", async (req, res) => {
//   const { username, secret } = req.body;
//   console.log("This is my username: ",username)
//   console.log("This is my password: ",secret)
//   try {
//     const r = await axios.put(
//       "https://api.chatengine.io/users/",
//       { username: username, secret: secret, username },
//       { headers: { 'private-key': "69ad5ab6-dcac-424b-a16f-a328b80275c2" } }
//     );
//     return res.status(r.status).json(r.data);
//   } catch (e) {
//     // Use 'e' instead of 'r' in the catch block
//     return res.status(e.response.status).json(e.response.data);
//   }
// });
app.post("/signup", async (req, res) => {
  const { username, secret, email } = req.body;

  console.log("my username: ",username);
  console.log("my secret: ",secret);
  console.log("my email: ",email);
  // Store a user-copy on Chat Engine!
  try {
    const r = await axios.post(
      "https://api.chatengine.io/users/",
      { username, secret, email },
      { headers: { "Private-Key": "1765b1d6-f0a2-4b19-8b5d-b9b5a54cdd13" } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response?.status || 500).json(e.response?.data || { error: 'Internal Server Error' });
  }
});

app.post("/login", async (req, res) => {
  const { username, secret } = req.body;

  // Fetch this user from Chat Engine in this project!
  try {
    const r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        "Project-ID": "d7b84d68-4d9c-4fab-b65e-f0b925d5257c",
        "User-Name": username,
        "User-Secret": secret,
      },
    });
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response?.status || 500).json(e.response?.data || { error: 'Internal Server Error' });
  }
});

// app.get('/search-users', async (req, res) => {
//   try {
//     const { query } = req.query;

//     // Use your Chat Engine API key and endpoint
//     const chatEngineApiKey = 'YOUR_CHAT_ENGINE_API_KEY';
//     const chatEngineApiEndpoint = `https://api.chatengine.io/users/search/?username=${query}`;

//     const response = await axios.get(chatEngineApiEndpoint, {
//       headers: {
//         'Project-ID': chatEngineApiKey,
//         'User-Name': 'admin', // Replace with your Chat Engine admin username
//         'User-Secret': 'admin-secret', // Replace with your Chat Engine admin secret
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error('Error searching users:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// Project ID:6e49091d-2d5f-4b89-a94b-ca0a527b67d8
// Private Key:69ad5ab6-dcac-424b-a16f-a328b80275c2
// ----------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

