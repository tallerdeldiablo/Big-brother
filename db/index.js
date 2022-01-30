
db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
  
  // Query database
  db.query('SELECT * FROM course_names', function (err, results) {
    console.log(results);
  });