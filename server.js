const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require('cors');
const knex = require('knex');
const register = require("./controllers/register.js");
const signIn = require("./controllers/sign-in.js");
const image = require("./controllers/image.js");
const profile = require("./controllers/profile.js");


const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		port: '5432',
		user: 'abrahambriones',
		password: '',
		database: 'smart-brain'
	}
});

db.select('*').from('users');

/*
 Middleware necessary to read the incoming body of a JSON object.
 This is often found in all programs, so it is good to always type.
 */
app.use(express.json());
app.use(cors());

/*
 A reminder of GET, POST, UPDATE, DELETE:
 * GET: get information from the web
 * POST: "POST" something to the web page for the first time; it will update the website's servers.
 * PUT: Make changes to content that already exists in the website.
 * DELETE: Delete existing information.

 * Example:
 * Logging onto Instagram. my web browser will GET images, text, etc. from Instagram servers.
 * When I upload a new picture to my profile. I am going to "POST" it onto Instagram's servers.
 * If I make a comment on someone's picture, I am going to "POST" my comment. Perhaps later I want
 * to fix a type in the comment. Let me "PUT" the correct letter to correct my typo.
 *
 * If I want to remove a picture off my profile, I will DELETE it off the server.
 */


// Create an object to represent a database. Each user is an object of key:value pairs stored in the users array.
// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'candy',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
// }


/**
 * (/)
 * Create the root of the page that responds with a JSON of the current users stored in the database.
 */
app.get('/', (req, response) => {
	db('users')
		.returning('*')
		.then(rows => {
			response.json(rows)
		})
})

/**
 * POST (/sign-in)
 * Create the sign-in route that responds with a success or fail message.
 *
 * If the incoming JSON matches user information existing in the database, the sign in is successful.
 */
app.post('/sign-in', (req, res) => {
	signIn.handleSignIn(req, res, db, bcrypt)
})

/**
 * POST (/register)
 * Create the register root that will create a new user. It returns the new user's info.
 */
app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt)
});

/**
 * GET (profile/:userId)
 * Create the profile root so that each user can view their personal information.
 * It will have a "userId" parameter.
 */
app.get('/profile/:id', (req, res) => {
	profile.handleProfile(req, res, db)
})

/**
 * PUT (/image)
 * Allow the user to upload an image. It will return how many images the user has uploaded
 * to the page.
 */
app.put('/image', (req, res) => {
	image.handleImage(req, res, db)
})

app.post('/imageurl', (req, res) => {
	image.handleAPIcall(req, res)
})

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
	console.log(`app is running on port ${PORT} `)
})


/*
 B-crypt is a useful module that comes with a hash function that will allow us to generate
 hashed-strings that are nearly impossible to crack.
 B-crypt's hash function is a little more powerful than ordinary hash functions which are ordinarily
 deterministic.
 */
//
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store a hashed password in the database.
// });
//
// // Load has from the database.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
//
//
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });