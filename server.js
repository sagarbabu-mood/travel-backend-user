const express = require('express')
const path = require('path')
const cors = require('cors')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {request} = require('http')
const dbPath = path.join(__dirname, 'users.db')
const app = express()

app.use(cors())
app.use(express.json())

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    app.get('/', (req, res) => {
      res.send('Hello, this is your Express server!')
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(-1)
  }
}
initializeDBAndServer()

//User Login API
app.post('/user/login/', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid User')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid Password')
    }
  }
})

//User Signup API
app.post('/user/signup', async (request, response) => {
  const {username, password, gender} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    const createUserQuery = `
        INSERT INTO 
          user (username, password, gender) 
        VALUES 
          (
            '${username}',
            '${hashedPassword}', 
            '${gender}'
          )`
    const dbResponse = await db.run(createUserQuery)
    const newUserId = dbResponse.lastID
    response.send(`Created new user with ${newUserId}`)
  } else {
    response.status = 400
    response.send('User already exists')
  }
})
