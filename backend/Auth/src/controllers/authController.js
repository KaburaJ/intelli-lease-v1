/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         FirstName:
 *           type: string
 *         LastName:
 *           type: string
 *         UserEmail:
 *           type: string
 *         UserPasswordHash:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registration successful
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User login successful
 *       400:
 *         description: Bad request or validation error
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: No user found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logout successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route
 *     description: Displays a message for authenticated users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Authentication failed
 */

const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const mssql = require("mssql");
const { Connection } = require("tedious");
const userSchema = require("../validators/userRegistrationValidator");
const loginSchema = require("../validators/userLoginValidator");
const config = require("../config/userConfig");
const ejs = require("ejs");
const path = require("path");
const sendMail = require("../utils/authMail");

const connection = new Connection(config);

connection.on("connect", function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = {
  registerUser: async (req, res) => {
    console.log(process.env.DB_USER);
    try {
      const { error, value } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = req.body;
      const hashedPassword = await bcrypt.hash(user.UserPasswordHash, 8);

      const sql = await mssql.connect(config);

      if (sql.connected) {
        const request = new mssql.Request(sql);
        request
          .input("FirstName", user.FirstName)
          .input("LastName", user.LastName)
          .input("UserEmail", user.UserEmail)
          .input("UserPasswordHash", hashedPassword);

        const results = await request.execute("dbo.AddUser");
        res.json(results.recordset);

        const emailBody = await ejs.renderFile(
          path.join(__dirname, "../views/email.ejs"),
          { userName: user.FirstName }
        );
        sendMail(user.UserEmail, "Verification Email", emailBody);
      }
    } catch (e) {
      console.error(e);
      res.status(500).send("An error occurred when registering a user");
    }
  },

  loginUser: async (req, res) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = value;
      console.log(user);

      const sql = await mssql.connect(config);

      try {
        if (sql.connected) {
          const request = new mssql.Request(sql);
          request.input("UserEmail", user.UserEmail);

          const result = await request.query(
            "SELECT * FROM Users WHERE UserEmail = @UserEmail"
          );

          if (result.recordset.length) {
            const dbPassword = result.recordset[0].UserPasswordHash;
            const passwordsMatch = await bcrypt.compare(
              user.UserPasswordHash,
              dbPassword
            );

            if (passwordsMatch) {
              const loggedInUser = result.recordset[0];
              console.log("logged in user", loggedInUser);

              const token = jwt.sign(
                { UserID: loggedInUser.UserID },
                process.env.JWT_SECRET,
                {
                  expiresIn: "30d",
                }
              );
              console.log(token);

              const insertTokenQuery = `
              INSERT INTO Tokens (UserID, Token, ExpiryDate)
              VALUES (@UserID, @Token, @ExpiryDate);
            `;

              const tokenRecord = {
                UserID: loggedInUser.UserID,
                Token: token,
                ExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              };

              const request = new mssql.Request(sql);

              request.input(
                "UserID",
                mssql.UniqueIdentifier,
                tokenRecord.UserID
              );
              request.input("Token", mssql.NVarChar(500), tokenRecord.Token);
              request.input(
                "ExpiryDate",
                mssql.DateTime,
                tokenRecord.ExpiryDate
              );

              try {
                await request.query(insertTokenQuery);
                console.log("Token inserted successfully");
              } catch (error) {
                console.error("Error inserting token:", error);
                res.status(500).json({
                  success: false,
                  message: "Error inserting token",
                  error: error.message,
                });
              }

              res.status(200).json({
                success: true,
                message: "Logged in successfully",
                token: token,
                user: loggedInUser,
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Incorrect password",
              });
            }
          } else {
            res.status(404).json({ success: false, message: "No user found" });
          }
        } else {
          res
            .status(500)
            .json({ success: false, message: "Database connection error" });
        }
      } finally {
        await sql.close();
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Login error",
      });
    }
  },

  logoutUser: async (req, res) => {
    try {
      const decodedToken = jwt.verify(req.body.token, process.env.JWT_SECRET);
      const userID = decodedToken.UserID;

      const getTokenQuery = `
        SELECT Token FROM Tokens
        WHERE UserID = @UserID AND IsDeleted = 0;
      `;

      const sql = await mssql.connect(config);

      try {
        if (sql.connected) {
          const request = new mssql.Request(sql);
          request.input("UserID", userID);

          const result = await request.query(getTokenQuery);

          if (result.recordset.length === 0) {
            return res
              .status(401)
              .json({
                success: false,
                message: "Token not found or already deleted",
              });
          }

          const token = result.recordset[0].Token;

          const updateTokenQuery = `
            UPDATE Tokens
            SET IsDeleted = 1
            WHERE UserID = @UserID AND Token = @Token;
          `;

          await request.query(updateTokenQuery, {
            UserID: userID,
            Token: token,
          });

          res.status(200).json({
            success: true,
            message: "You have been logged out",
          });
        } else {
          throw new Error("Database connection error");
        }
      } finally {
        await sql.close();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Logout error",
      });
    }
  },
};
