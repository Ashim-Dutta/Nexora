
require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");
const listner = require("./src/broker/listners");

connectToDB();
connect().then(() => {
    listner();
})

app.listen(3007, () => {
    console.log(`Server is running on port 3007`);
});