/* eslint-disable no-useless-catch */
const jwt = require("jsonwebtoken");
const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const { requireUser } = require("./utils");
const { UserDoesNotExistError } = require("../errors");
const { createUser, getUserByUsername, getUser } = require("../db/users");

const { JWT_SECRET } = process.env;
const users = [];

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = req.body;
    const _user = await getUserByUsername(newUser.username);
    if (_user) {
      next({
        name: "UserNameExistsError",
        message: `User ${newUser.username} is already taken.`,
      });
      res.status(401);
    } else if (newUser.password.length < 8) {
      res.status(401);
      next({
        name: "PasswordTooShortError",
        message: `Password Too Short!`,
      });
    } else {
      const user = await createUser(newUser);
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.send({
        user: user,
        message: "User created!",
        token: token,
      });
    }
  } catch (error) {
    console.log(error, "got here!");
    next(error);
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect.",
      });
    }
  } catch (error) {
    next(error);
  }
});
// GET /api/users/me
usersRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {
      next({
        name: "Authorization error",
        message: "You must be logged in to perform the task",
      });
    } else {
      res.send(req.user);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/:username/routines

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
