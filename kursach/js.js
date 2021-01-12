let tasks = {
    cur: [],
    done: [],
    removed: []
};
let btn = document.querySelectorAll('.btn');
let content = document.querySelectorAll('.content');

function modify(className, modify, index) {
    let mass = document.querySelectorAll(className);

    for (let i = 0; i < mass.length; i++) {
        mass[i].classList.remove(modify);
        if (i === index) {
            mass[i].classList.add(modify);
        }
    }
}

function change(index) {
    modify('.btn', 'active', index);
    modify('.content', 'active', index);

}

for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', function () {
        change(i);
    })
}

function modalControl() {
    let $modal = document.querySelector(".modal");
    const open = () => {
        $modal.classList.add("show");
    };

    const close = () => {
        $modal.classList.remove("show");
    };

    const toggle = (event) => {
        if (event === "close") {
            close();
        } else {
            open();
        }
    };

    return {toggle};
}

let modal = modalControl();

function validate() {
    const $form = document.querySelector("form");
    const $input = $form.querySelector("input");
    const $area = $form.querySelector('textarea')
    const clearForm = () => {
        $input.value = "";
        $area.value='';
    };
    const getOk = () => {

        let field = document.querySelectorAll('.create-task');
        field = [...field];
        let nTask = field.reduce((_nTask, item) => {
           // console.log(item.name, item.value)
            _nTask[item.name] = item.value;
            return _nTask;
        }, {});

        tasks.cur.push(nTask)

        table();



        modal.toggle("close");
        clearForm();

    };
    const checkForm = () => {

        if (!$input.value) {

            $input.classList.add("error");

        } else {
            $input.classList.remove("error");
            getOk();
        }

    };

    return {checkForm, clearForm};
}

let valid = validate();

function table() {
    let $table = document.querySelector(".table");
    $table.innerHTML = "";
    for (let i=0; i<tasks.cur.length; i++) {
        $table.innerHTML += `<tr data-id="${i}">
            <td>${tasks.cur[i].taskName} </td>
            <td>${tasks.cur[i].taskDesc}  </td>
            <td>${tasks.cur[i].taskPriority}   </td>
            <td><div class="curBtn" >
            <button class="edit"><i class="far fa-edit"></i></button>
            <button class="done"><i class="far fa-check-circle"></i></button>
            <button class="remove"><i class="far fa-trash-alt"></i></button>
            </div></td>           
            </tr>`;
    }

}





function editTask() {
    const done = (id) => {
        tasks.done.push(tasks.cur.splice(id,1)[0])

          tableDone()
            table()

    }
    const remove = (id) =>{
        tasks.removed.push(tasks.cur.splice(id,1)[0])
        tableRemoved()
        table()

    }
    const removeFromDone = (id) => {
        tasks.removed.push(tasks.done.splice(id,1)[0])
        tableRemoved()
        tableDone()
    }
    const restore = (id) =>{
        tasks.cur.push(tasks.removed.splice(id,1)[0])
        tableRemoved()
        table()
    }
    const edit = (id) => {
        let field = document.querySelectorAll('.create-task');
        field = [...field];
        let nTask = field.reduce((_nTask, item) => {

            _nTask[item.name] = item.value;
            return _nTask;
        }, {});

       tasks.cur[id].push(tasks.cur.splice(id,1)[0])

        table()



    }
    return {done,remove,removeFromDone,restore,edit}

}
function tableDone() {

    let $tableDone = document.querySelector(".table-done");
    $tableDone.innerHTML = "";
    for (let i=0; i < tasks.done.length; i++) {
        $tableDone.innerHTML += `<tr data-id="${i}">
            <td>${tasks.done[i].taskName} </td>
            <td>${tasks.done[i].taskDesc}  </td>
            <td>${tasks.done[i].taskPriority}   </td>
            <td><div class="curBtn" >
            <button class="delete" ><i class="far fa-trash-alt"></i></button>
            </div></td>           
            </tr>`;

    }
}
function tableRemoved(){
    let $tableDone = document.querySelector(".table-remove");
    $tableDone.innerHTML = "";
    for (let i=0; i < tasks.removed.length; i++) {
        $tableDone.innerHTML += `<tr data-id="${i}">
            <td>${tasks.removed[i].taskName} </td>
            <td>${tasks.removed[i].taskDesc}  </td>
            <td>${tasks.removed[i].taskPriority}   </td>
            <td><div class="curBtn" >
            <button class="restore" ><i class="fa fa-window-restore" aria-hidden="true"></i></button>
            </div></td>           
            </tr>`;

    }
}

let edit = editTask();

document.addEventListener("click", function (e) {
    if (
        e.target.classList.contains("modal") ||
        e.target.classList.contains("close")
    ) {
        modal.toggle("close");
        valid.clearForm();
    }

    if (e.target.classList.contains("add")) {
        modal.toggle("open");
    }

    if (e.target.classList.contains("btn-ok")) {
        valid.checkForm();
    }
    if (e.target.classList.contains('done')) {
        edit.done(e.target.closest('tr').dataset.id);

    }
    if (e.target.classList.contains('remove')) {
        edit.remove(e.target.closest('tr').dataset.id);
    }
    if (e.target.classList.contains('delete')) {
        edit.removeFromDone(e.target.closest('tr').dataset.id);
    }
    if (e.target.classList.contains('restore')) {
        edit.restore(e.target.closest('tr').dataset.id);
    }
    if (e.target.classList.contains("edit")) {
        modal.toggle("open");
        edit.edit(e.target.closest('tr').dataset.id);
    }
})



