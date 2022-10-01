const Clarifai = require('clarifai');
const clari_key = require('../clari_key.js')

const app = new Clarifai.App({
	apiKey: clari_key.key
})


const handleAPIcall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input,)
		.then(data => {res.json(data)})
		.catch(err => res.status(400).json('Unable to connect to the API.'))
}


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
	handleImage: handleImage,
	handleAPIcall:handleAPIcall
}