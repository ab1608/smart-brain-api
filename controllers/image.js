/**
 * PUT (/image)
 * Allow the user to upload an image. It will return how many images the user has uploaded
 * to the page.
 */
const handleImage = (req, res, db) => {
	const {id} = req.body;
	db.from('users')
		.where('id', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => res.json(entries[0].entries))
		.catch(error => res.status(400).json("Unable to get entries."))

}


module.exports = {
	handleImage: handleImage
}