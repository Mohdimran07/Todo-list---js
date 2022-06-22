const submitBtn = document.querySelector('#sub-btn');
const input = document.querySelector('#form-inp');
const list = document.querySelector('.list-items');
console.log(input.value)
submitBtn.addEventListener('click', addItem);
list.addEventListener('click', deleteItem);
 list.addEventListener('click', editItem);

function addItem(e) {
    e.preventDefault();
    console.log("clicked")
    if (input.value === '') {
        alert('Please enter some value');
    } else {
        let obj = {
            'task': input.value
        }
        console.log(obj)
        axios.post('https://crudcrud.com/api/29f0058b75f44a76b61488e7da252ff0/task', obj)
            .then((res) => {
                showData(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                document.querySelector('.err-div').style.display = 'block';
                setTimeout((e) => {
                    document.querySelector('.err-div').style.display = 'none'
                }, 5000);
                console.log(err)
            })
    }
}

function showData(data) {
    const item = document.createElement('li');
    item.textContent = data.task;
    item.className = 'item';

    // ADDING EDIT BUTTON
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    item.appendChild(editBtn);

    // ADDING DELETE BUTTON
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    item.appendChild(deleteBtn)

    list.appendChild(item)
    input.value = ''
}

// DELETE ITEM
function deleteItem(e) {
    if (e.target.classList.contains('delete-btn')) {
        const itemToBeRemoved = e.target.parentElement;
        const val = itemToBeRemoved.firstChild.textContent;

        axios.get('https://crudcrud.com/api/29f0058b75f44a76b61488e7da252ff0/task')
            .then((res) => {
                const taskList = res.data;
                taskList.forEach((item) => {
                    if (val === item.task) {
                        const id = item._id;
                        //  console.log(id);
                        axios.delete(`https://crudcrud.com/api/29f0058b75f44a76b61488e7da252ff0/task/${id}`)
                            .then((res) => {
                                list.removeChild(itemToBeRemoved)
                                console.log(res)
                            })
                            .catch((err) => console.log(err));
                    }
                })
            })
            .catch((err) => console.log(err))
    }
}

// EDIT ITEM
function editItem(e) {
    const item = e.target.parentElement;
    console.log(item)
    if(e.target.classList.contains('edit-btn')){
        //Checks if no edit form is present then create a edit form  
        if(!item.lastElementChild.classList.contains('edit-form')){
            //create edit form
            const editForm = document.createElement('form');
            //create input field
            const editText = document.createElement('input');
            editText.setAttribute('class','editText');
            //Adding value to be edited in input field
            editText.setAttribute('value',e.target.parentElement.firstChild.textContent);
            
            //create change button
            const changeBtn = document.createElement('button');
             changeBtn.textContent = 'Change';
            changeBtn.setAttribute('class','change-btn');

            //create cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.setAttribute('class','cancel-btn');

            editForm.appendChild(editText);
            editForm.appendChild(changeBtn);
            editForm.appendChild(cancelBtn);
            editForm.className = 'edit-form';
            e.target.parentElement.appendChild(editForm);

            item.addEventListener('click',changeValue);
            item.addEventListener('click',cancelChange); 
        }       
    }

}

//Cancel the Edit Value
function cancelChange(e){
    e.preventDefault();
    if(e.target.classList.contains('cancel-btn')){
        e.target.parentElement.remove(e.target.parentElement);
    }
}

// Change Value;
function changeValue(e){
    e.preventDefault();
    const form = e.target.parentElement;
    const listItem = form.parentElement;
    let val = listItem.firstChild.textContent;
    // let btn = e.target.classList.contains('change-btn');
    // console.log(btn)
    if(e.target.classList.contains('change-btn')){
       axios.get('https://crudcrud.com/api/29f0058b75f44a76b61488e7da252ff0/task')
       .then((res) => {
        const task = res.data;
        task.forEach((item) => {
            if(item.task === val){
                const id = item._id;
                axios.put(`https://crudcrud.com/api/29f0058b75f44a76b61488e7da252ff0/task/${id}`, {
                    task: form.firstChild.value
                }).then((res) => {
                    console.log('success');
                    listItem.firstChild.textContent = form.firstChild.value;
                    form.remove(form);
                }).catch((err) => console.log('err', err))
            }
        })
       })
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    axios.get('https://crudcrud.com/api/29f0058b75f44a76b61488e7da252ff0/task')
        .then(res => {
            const item = res.data;
            item.forEach((i) => {
                console.log(i)
                showData(i);
            })
        })
        .catch(err => console.log(err));
})