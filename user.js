const BASE_URL = 'http://localhost:8000'

//2.นำ user ที่โหลดมา แสดงผลใส่เข้าไปใน HTML

window.onload = async() => {
    await loadData(); 
    

    //1. load user ทั้งหมดออกมาจาก api

}
const loadData = async () => {
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data)

    //2. นำข้อมูลที่โหลดมาไปแสดงผลใน HTML
    const UserDOM = document.getElementById('user');
    let htmlData = '<div>';
    for (let i = 0; i < response.data.length; i++){
        let user = response.data[i];
        htmlData += `<div>
        ${user.id} ${user.firstname} ${user.lastname}
        <a href ='next.html?id=${user.id}'>
            <button>Edit</button>
        </a>

        <button class ='delete' data-id = '${user.id}')">Delete</button>
        </div>`
    }
    htmlData += '</div>';
    UserDOM.innerHTML = htmlData;

    const deleteDOM = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteDOM.length; i++){
        deleteDOM[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try{
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData(); //เรียกใหม่เพื่อโหลดข้อมูลใหม่

                
            }catch {
                console.error('error', error);
            }
        });
    }

}