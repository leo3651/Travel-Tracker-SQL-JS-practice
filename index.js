import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
var alreadyExists;

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
  const countries = await db.query(
    "SELECT country_code FROM visited_countries");
  let visited_countries = [];
  countries.rows.forEach((country) => {
    visited_countries.push(country.country_code)});
  res.render("index.ejs", {
    countries: visited_countries, 
    total: visited_countries.length});
});

app.post("/add", async(req, res) => {
  const input = req.body["country"].toLowerCase();
  const country = await db.query(
    "SELECT country_code FROM countries WHERE LOWER(country_name) = $1", 
    [input])
  const countries_visited = await db.query("SELECT country_code from visited_countries")
  
  if (country.rowCount != 0) 
  {
    countries_visited.rows.forEach((countryVisited) => {
      if (countryVisited.country_code === country.rows[0]["country_code"])
      {
        alreadyExists = true
      }
    })
    if (alreadyExists === false)
    {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [country.rows[0]["country_code"]])
    }
  } 
  res.redirect("/") 
  alreadyExists = false 
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
