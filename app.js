const express = require("express");
const app = express();
const mysql = require("mysql");
const ejs = require("ejs");
const path = require("path");



const db = mysql.createConnection({
    host: 'nhn.c30krjrlm8rn.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'hoangnam', 
    password: 'nam011092',
    database: 'db1',
});


app.use(express.urlencoded({ extended: true }));

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Database is connected");
});

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')))


app.get("/login", (req, res) => {
    res.render("login");

});
app.get("/", (req, res) => {
    res.render("login");

});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database for user authentication
    db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
        console.error(err);
        res.send('Error occurred');
      } else {
        const account = results[0];
  
        if (account) {
          // Render admin or user page based on the role
          if (account.role === 'admin') {
            res.render("admin");
          } else {
            res.render("user");
          }
        } else {
          res.send('Invalid credentials');
        }
      }
    });
  });

// Route to display the search page

app.get("/search", (req, res) => {
    res.render("search");
});

// Route to handle search based on keyword
app.get("/search/:keyword", (req, res) => {
    const keyword = req.params.keyword;
    const query = "SELECT * FROM users WHERE name LIKE ?"; // Assuming the column for user names is "name"

    db.query(query, [`%${keyword}%`], (err, result) => {
        if (err) {
            console.error("Error fetching data from the database:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.json(result);
    });
});

app.use(express.urlencoded({ extended: true }));

// Route to display the registration form
app.get("/register", (req, res) => {
    res.render("register");
});

// Route to handle user registration form submission
app.post("/register", (req, res) => {
    const { name, email, age, gender, country } = req.body;
    const insertQuery = "INSERT INTO users (name, email, age, gender, country) VALUES (?, ?, ?, ?, ?)";

    db.query(insertQuery, [name, email, age, gender, country], (err, result) => {
        if (err) {
            console.error("Error inserting data into the database:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        console.log("User registered:", name);
        res.redirect("/"); // Redirect to the homepage or any other page you prefer
    });
});

app.post('/logout', (req, res) => {
    // Clear the session or remove the authentication-related data
    delete req.session.user;

    // Redirect to the home page or login page
    res.redirect('/');
});

app.get("/TX_report", (req, res) => {
    res.render("TX_report");
});

app.get("/CA_report", (req, res) => {
    res.render("CA_report");
});

app.get("/Partners", (req, res) => {
    res.render("Partners");
});

app.get("/Education", (req, res) => {
    res.render("Education");
});

app.get("/research", (req, res) => {
    res.render("research");
});

app.get("/medical", (req, res) => {
    res.render("medical");
});
const PORT = process.env.PORT || 80; 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});