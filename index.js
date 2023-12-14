import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "7838",
  database: "world",
  port: 5432
})
db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.

  const countries = await db.query("SELECT country_code FROM visited_countries");
  let visited_countries = []
  countries.rows.forEach((country) => {
    visited_countries.push(country.country_code)})
  console.log(visited_countries)
  res.render("index.ejs", {countries: visited_countries, total: visited_countries.length});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
