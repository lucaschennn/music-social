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

db.get_row_from_email = (email) => {
    var sql = "select * from user where id = ?"
    db.get(sql, email, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return;
          }
          console.log(row)
          res.json({
            "data":row
          })
    })
}

//db.get_id_from_email

//db.get_row_from_id/email

module.exports = db
//https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/