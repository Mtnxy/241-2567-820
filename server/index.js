
const validateData  = (userData) => {
  let errors = []
  if(!userData.firstName){
      errors.push('กรุณากรอกชื่อ')
  }
  if (!userData.lastName){
      errors.push('กรุณากรอกนามสกุล')
  }
  if (!userData.age){
      errors.push('กรุณากรอกอายุ')
  }
  if (!userData.gender){
      errors.push('กรุณาเลือกเพศ')
  }
  if (!userData.interests){
      errors.push('กรุณาเลือกความสนใจ')
  }
  if (!userData.description){
      errors.push('กรุณากรอกข้อมูลตัวเอง')
  }
  return errors
}

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 8000;

// เก็บ user
let users = []
let conn = null

/* GET /users สำหรับ get users ทั้งหมด
POST /user สำหรับสร้าง user ใหม่บันทึกเข้าไป
PUT /user/:id สำหรับแก้ไข user รายคนที่ต้องการบันทึก
GET /user/:id สำหรับดึงข้อมูล user รายคน
PUT /user/:id สำหรับแก้ไข user รายคนที่ต้องการบันทึก
DELETE /user/:id สำหรับลบ user รายคนที่ต้องการลบ
*/
// path = GET /users5
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user:'root',
        password:'root',
        database:'webdb',
        port:8830
    })
}
app.get('/testdb', (req, res) => {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8830

}).then((conn) => {
  conn
  .query('SELECT * FROM users')
  .then((results) => {
    res.json(results[0])
  })
  .catch((error) => {
    console.log('Erro fetching users:', error.message)
    res.status(500).json({error:'Error fetching users'})
    })
  })
});



/*
app.get('/testdb-new', async (req, res) => {
    try{
    
      const result = await conn.query('SELECT * FROM users')
      res.json(result[0])
 

    }catch(error){
        console.log('Erro fetching users:', error.message)
        res.status(500).json({error:'Error fetching users'})

    }
})
*/
app.get('/users', async (req, res) => {
    const result = await conn.query('SELECT * FROM users')
    res.json(result[0])
})


// path = POST /user
app.post('/users', async(req, res) => {
  try {
    let user = req.body;
    const errors = validateData(user)
    if(errors.length > 0){
      throw {
        massage:'กรุณากรอกข้อมูลให้ครบถ้วน',
        errors: errors
      }
    }
    const results = await conn.query('INSERT INTO users SET ?', user)
    res.json({
      message: 'User created',
      data: results[0]
      })
    
  } catch (error){
    const errorMessage = error.message || 'something went wrong'
    const errors = error.errors || []
    console.error('errorMessage:', error.message)
    res.status(500).json({
      message : errorMessage,
      errorMessage: error.message,
      errors: errors
    })
  }
});

app.get('/users/:id', async(req, res) => {
  try{
    let id = req.params.id;
    const result = await conn.query('SELECT * FROM users WHERE id = ?', id)
    if(result[0].length == 0){
      throw {statusCode: 404, message: 'User not found'}
    }
    res.json(result[0][0])
  }catch(error){
    console.error('errorMessage:', error.message)
    let statusCode = error.statusCode || 500
    res.status(500).json({
      message : 'something went wrong',
      errorMessage: error.message  
    })
}
});
  


//path = PUT /user/:id
app.put('/users/:id', async(req, res) => {
 
  try {
    let id = req.params.id;
    let updateUser = req.body
    const results = await conn.query(
      'UPDATE users SET ? WHERE id = ?',
      [updateUser, id]
    )
    res.json({
      message: 'Update user Completed',
      data: results[0]
      })
    
  } catch (error){
    console.error('errorMessage:', error.message)
    res.status(500).json({
      message : 'something went wrong',
      errorMessage: error.message  
    })
  }
});

/*
  //หา user จาก id ที่ส่งมา
  let selectedIndex = users.findIndex(user => user.id == id);
  //update user นั้น
  if (updateUser.firstname) {
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
  }
  if (updateUser.lastname) {
  users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
  }
  res.json({
    message : "User updated",
    data: {
      user: updateUser,
      indexUpdate: selectedIndex
    }
  });*/


//Path = DELETE /user/:id
app.delete('/users/:id', async(req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body
    const results = await conn.query(
      'DELETE FROM users WHERE id = ?',id)
    res.json({
      message: 'Delete user Completed',
      data: results[0]
      })
    
  } catch (error){
    console.error('errorMessage:', error.message)
    res.status(500).json({
      message : 'something went wrong',
      errorMessage: error.message  
    })
  }
});

app.listen(port,async(req,res) => {
  await initMySQL()
  console.log('Server is running on port'+port);
});