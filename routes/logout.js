module.exports = (app, client) => {
	app.get('/logout', (req, res) => {
		req.session.destroy();
		res.redirect("/login")
	})
}