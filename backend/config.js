module.exports = {
    jwtSecret:"SCECT",
    DB: process.env.MONGODB_URI
        //DB: process.env.MONGODB_URI || 'mongodb://localhost/tsuapp'
}