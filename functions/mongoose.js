const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(`${process.env.MONGOOSE_URL}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
  }, () => {
	console.log("Connected to mongoose successfully")
});