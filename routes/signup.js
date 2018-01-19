var bcrypt = require('bcrypt');

module.exports = (app, client) => {
	app.post("/signup", (req,res)=>{
		const query2 = {
	            text:`CREATE TABLE IF NOT EXISTS users (id serial primary key,
	            email text,
	            password text);`
	    }
		const query = {
			text: `select * from users where (email) =('${req.body.email}');`
		}	
		bcrypt.hash(req.body.password, 8, function(err, hash) {
			const query1 = {
			       text: `insert into users (email,password) values ('${req.body.email}', '${hash}');`
			    }
			client.query(query2)
			.then (result=>{
				client.query(query, (err,result)=>{
					if(err) throw err
					if (result.rows.length !== 0){
						res.redirect("/")
					}
					else{
						client.query(query1, (err,result)=>{
							res.redirect("/randomchat")
						})
					}
				})
			})		
		})	
	})
}