module.exports = (app, client) => {
	app.get("/randomchat", (req,res)=>{
		if(req.session.user){	
		res.render("randomchat", {user:req.session.user})
		}
		else{
			res.redirect("/")
		}
	})
}
