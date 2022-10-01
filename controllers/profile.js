/**
 * GET (profile/:userId)
 * Create the profile root so that each user can view their personal information.
 * It will have a "userId" parameter.
 */
const handleProfile = (req, res, db) => {
	const {id} = req.params;
	db.select('*')
		.from('users')
		.where('id', id)
		.returning('*')
		.then((user) => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('User not found')
			}
		})
}

module.exports = {
	handleProfile: handleProfile
}