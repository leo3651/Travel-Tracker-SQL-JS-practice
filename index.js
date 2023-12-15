import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
var alreadyVisited;

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
  //Array of visited countries

  const countries = await db.query(
    "SELECT country_code FROM visited_countries");
  let visitedCountries = [];
  countries.rows.forEach((country) => {
    visitedCountries.push(country.country_code)});
  res.render("index.ejs", {
    countries: visitedCountries, 
    total: visitedCountries.length});
});

app.post("/add", async(req, res) => {
  //Inserting inputed country in db therefore in array of visited countries

  const input = req.body["country"].toLowerCase();
  const countryCode = await db.query(
    "SELECT country_code FROM countries WHERE LOWER(country_name) = $1", 
    [input]);
  if (countryCode.rowCount != 0) 
  {
    visitedCountries.forEach((visitedCountry) => {
      if (visitedCountry.country_code === countryCode.rows[0]["country_code"]);
      {
        alreadyVisited = true;
      }})
    if (alreadyVisited === false)
    {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)", 
        [countryCode.rows[0]["country_code"]]);
    }
  } 
  res.redirect("/");
  alreadyExists = false;
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
