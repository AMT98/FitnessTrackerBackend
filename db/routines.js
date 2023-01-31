const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {rows: [routine],} = await client.query(`
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.log(error);
  }
}


async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT *
    FROM routines
    `);
    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT *
    FROM routines
    `);
    return routines;
  } catch (error) {
    console.log(error);
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
