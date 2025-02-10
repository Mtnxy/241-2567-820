const express = require('express');
const bodyParser = require('body-parser');
const app =express();


app.use(bodyParser.json());
const port =8000;

//เก็บ user 
let users =[]
let counter = 1
/*
//GET/Users สำหรับ get user ทั้งหมด
//POST /user สำหรับสร้าง user ใหม่บันทึกเข้าไป
GET /
*/

//path =/
app.get('/users',(req,res)=>{
    res.json(users);
})


//path = POST /user
app.post('/user',(req,res)=>{
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: "User created",
        user: user
    })

});

//path =PUT/user/:id
app.put('/user/:id',(req,res)=>{
    let id = req.params.id;
    let UpdateUser = req.body;
    //หา user จาก id ที่ส่งมา
    let selectIndex = users.findIndex(user => user.id == id)
    //Update user นั้น
    if(UpdateUser.firstname){
        users[selectIndex].firstname = UpdateUser.firstname
    }
    if(UpdateUser.lastname){
        users[selectIndex].lastname = UpdateUser.lastname
    }
    

    
    res.json({
        message: "User updated",
    data:{
    user : UpdateUser,
    indexUpdate:selectIndex
    }
});


    //ส่งข้อมูล User ที่ Update กลับไปที่เดิม

   res.send(selectIndex + '')
})
//path = DELETE /user/:id
app.delete('/user/:id',(req,res)=>{
    let id = req.params.id;
    //หาindex
    let selectIndex = users.findIndex(user => user.id == id)
    //ลบ user ที่เลือก
    users.splice(selectIndex,1)
    res.json({
        message: "Delete completed",
        indexDelete:selectIndex
    });
});


//คนมอนิเตอร์ คอยดูข้อมูล ดักจับ/
app.listen(port,(req,res) =>{
    console.log('Server is running on port '+ port);
});