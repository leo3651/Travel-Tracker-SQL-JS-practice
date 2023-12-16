import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
let visitedCountries;

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
  visitedCountries = [];
  countries.rows.forEach((country) => {
    visitedCountries.push(country.country_code)});
  res.render("index.ejs", {
    countries: visitedCountries, 
    total: visitedCountries.length});
});

app.post("/add", async(req, res) => {
  const input = req.body["country"].toLowerCase();
  //Verify the input
  try
  {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) = $1", [input])
    const countryCode = result.rows[0].country_code
    //Verify the INSERT
    try
    {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode])
      res.redirect("/")
    }
    catch(error)
    {
      console.error("Error is: ", error)
      res.render("index.ejs", {
        countries: visitedCountries,
        total: visitedCountries.length,
        error: "Country already marked."
      })
    }
  }
  catch(error)
  {
    console.error("Error is: ", error)
    res.render("index.ejs", {
      countries: visitedCountries,
      total: visitedCountries.length,
      error: "Country does not exist."
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
