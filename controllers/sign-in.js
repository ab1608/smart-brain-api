/**
 * POST (/sign-in)
 * Create the sign-in route that responds with a success or fail message.
 *
 * If the incoming JSON matches user information existing in the database, the sign in is successful.
 */
const handleSignIn = (req, res, db, bcrypt) => {
	const { email, password } = req.body;

	db.select('hash')
		.from('login')
		.where('email', email)
		.then( (data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash)
			if (isValid) {
				db.select('*')
					.from('users')
					.where('email', email)
					.then(user => {
						res.json(user[0])
					})
					.catch(error => res.status(400).json("Unable to get user."))
			}
			else {
				res.status(400).json("Wrong username or password.")
			}
		})
}


module.exports = {
	handleSignIn: handleSignIn
}