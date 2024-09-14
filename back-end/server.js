const app = require("./app");
const config = require("./app/config");
const mongoose = require("mongoose");
const ngrok = require('ngrok');

async function startServer() {
  try {
    await mongoose.connect(config.db.uri);
    console.log("Connected to the database!");
    const PORT = config.app.port;
    app.listen(PORT, () => {
      // const url = await ngrok.connect({
      //   addr: PORT,
      //   authtoken: '2lyvJguVSfGCnwLvsnFuLRbhvss_2z3zr2Jj73DbamT49NoUi', 
      // });
  
      // console.log(`Ngrok URL: ${url}`);
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Can not connect to the database!", error);
    process.exit();
  }
}

startServer();
