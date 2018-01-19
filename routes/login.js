var bcrypt = require('bcrypt');

module.exports = (app, client) => {
	app.post("/login", (req,res) => {
		const query = {
			text: `select * from users where (email) = ('${req.body.loginemail}');`
		}
		client.query(query, (err,resultQ)=>{
			if(err) throw err
			debugger
			if (resultQ.rowCount == 1){
				debugger
				bcrypt.compare(req.body.loginpassword, resultQ.rows[0].password, function(err, resultBC) {console.log('result', resultBC)
					if (resultBC){
						req.session.user = {
							email: resultQ.rows[0].email,
							id: resultQ.rows[0].id
						}
						res.redirect("/randomchat");
					}
					else {
						res.redirect("/")
					}
				})
			}
			else {
				res.redirect("/")
			}
		})
	})
}