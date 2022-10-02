/**
 * POST (/register)
 * Create the register root that will create a new user. It returns the new user's info.
 */
const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password} = req.body;
	if (!email || !name || !password) {
		return res.status(400).json("Missing fields")
	}

	const hash = bcrypt.hashSync(password);
	db.transaction((trx) => {
		trx.insert({
			email: email,
			hash: hash
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined_on: new Date(),
					})
					// Successful response - only send the user
					.then(user => {
						res.json(user[0])
					})
					// Error response
					.catch(error => res.status(400).json('Unable to register.'))
			})
			.then(trx.commit)
			.then(trx.rollback)
	})
		.catch(error => res.status(400).json("Unable to register."))
}


module.exports = {
	handleRegister: handleRegister,
}