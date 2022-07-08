var sqlite3 = require('sqlite3').verbose()
//var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            username text UNIQUE,
            email text UNIQUE, 
            posts text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, username, email) VALUES (?,?,?)'
                db.run(insert, ["john", "admin", "admin@example.com"])
            }
        });  
    }
});

module.exports = db
//https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/