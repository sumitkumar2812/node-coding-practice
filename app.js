const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY
      player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  const addplayerQuery = `
    INSERT INTO
      cricket_team ( playerName, jerseyNumber, role)
    VALUES
      (
          '${playerName}',
          ${jerseyNumber},
          '${role}'
      );`;

  const dbResponse = await db.run(addplayerQuery);
  console.log(dbResponse);
  const playerId = dbResponse.lastID;
  response.send({ playerId: playerId });
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getplayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${player_id};`;
  const player = await db.get(getplayerQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updateplayerQuery = `
    UPDATE
      cricket_team
    SET
        player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}

    WHERE
      player_id = ${playerId};`;
  await db.run(updateplayerQuery);
  response.send("player Updated Successfully");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteplayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deleteplayerQuery);
  response.send("player Deleted Successfully");
});

module.exports = app;
