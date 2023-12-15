import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "7838",
  database: "world",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async(req, res) => {
  //Write your code here.
  const countries = await db.query("SELECT country_code FROM visited_countries");
  let visited_countries = [];
  countries.rows.forEach((country) => {
    visited_countries.push(country.country_code)});
  //console.log(visited_countries);
  res.render("index.ejs", {
    countries: visited_countries, 
    total: visited_countries.length});
});

app.post("/add", async(req, res) => {
  const input = req.body["country"].toLowerCase();
  const results = await db.query("SELECT * FROM countries");
  results.rows.forEach((country) => {
    console.log(country)
    if(input === country["country_name"].toLowerCase())
    {
      try
      {
        db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [country["country_code"]])
        console.log("Found")
      }
      catch(error)
      {
        console.error("Error: ", error.message)
      }
    }
  }); 
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
