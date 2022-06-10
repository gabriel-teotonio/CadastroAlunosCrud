'use strict';

const btnCadastrar = document.getElementById('cadastrar');


const openModal = () => {
    document.querySelector('.modal').classList.add('active');
}
const closeModal = () =>  {
    clearFields();
    document.querySelector('.modal').classList.remove('active');
}


const getStorage = () => JSON.parse(localStorage.getItem('dbUsuario')) ?? [];
const setStorage = (dbUsuario) => {localStorage.setItem('dbUsuario', JSON.stringify(dbUsuario));}

//CRUD
function createUsuario (aluno){
    const dbUsuario = getStorage();
    dbUsuario.push(aluno)
    setStorage(dbUsuario);
}

function updateUsuario (index, aluno) {
    const dbUsuario = getStorage();
    dbUsuario[index] = aluno
    setStorage(dbUsuario);
}

function deleteUsuario(index){
    const dbUsuario = getStorage();
    dbUsuario.splice(index, 1)
    setStorage(dbUsuario);
}



//---interaçao com o layout ---//

function isValidFields() {
    return document.querySelector('form').reportValidity();
}

function clearFields () {
   const fields = document.querySelectorAll('.modal-field');
   fields.forEach(field => field.value = '');
}

function saveUsuario () {
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const curso = document.querySelector('#curso').value;
    const data = document.querySelector('#data').value;

    if(isValidFields()){
        const aluno = {
            nome,
            email,
            curso,
            data
        }

        const index = document.getElementById('nome').dataset.index;

        if(index == 'new'){
            createUsuario(aluno);
            updateTable()
            closeModal()
            showPopup('Aluno Cadastrado')
        }else{
            updateUsuario(index, aluno);
            updateTable();
            closeModal();
            showPopup('Aluno Editado');
        }
    }
}

function createRow(aluno, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${aluno.nome}</td>
    <td>${aluno.email}</td>
    <td>${aluno.curso}</td>
    <td>${aluno.data}</td>
    <td>
        <button type="button"  class="edit" id="edit-${index}"><i class="fa-solid fa-pen-to-square"></i></button>
        <button type="button" class="delete" id="delete-${index}"><i class="fa-regular fa-trash-can"></i></button>
    </td>
    `
    document.querySelector('.table>tbody').appendChild(row)
}

function clearTable() {
    const rows = document.querySelectorAll('.table>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

function updateTable() {
    const dbUsuario = getStorage();
    clearTable();
    dbUsuario.forEach(createRow);
}

function fillFields(aluno){
    document.querySelector('#nome').value = aluno.nome
    document.querySelector('#email').value = aluno.email
    document.querySelector('#curso').value = aluno.curso
    document.querySelector('#data').value = aluno.data
    document.querySelector('#nome').dataset.index = aluno.index
}

function editUsuario (index) {
    document.querySelector('.modal-header>h2').innerHTML = 'Editar Aluno'
    const aluno = getStorage()[index]
    aluno.index = index

    fillFields(aluno)
    openModal()
}



function editDelete (e) {
    if(e.target.type == 'button'){
        const [action, index] = e.target.id.split('-')

        if(action == 'edit'){
            editUsuario(index);
        }
        else{
            const aluno = getStorage()[index]
            const response = confirm(`você deseja deletar o aluno ${aluno.nome}`);
            
            if(response){
                deleteUsuario(index);
                updateTable();
            }
        }
    }
}



updateTable()

//--mostrar popup de confirmação

function showPopup(msgPopup) {
    const popUpAlunoAdd = document.querySelector('.popUp-alunoAdd');
    const contentPopup = document.querySelector('.popUp-alunoAdd>span')

    contentPopup.innerHTML = msgPopup

    popUpAlunoAdd.classList.add('showPopup');
    setTimeout(() => {
        popUpAlunoAdd.classList.remove('showPopup');
    }, 3000);
}

document.getElementById('save')
    .addEventListener('click', saveUsuario);

document.getElementById('modalClose')   
    .addEventListener('click', closeModal);

document.getElementById('cancel')
    .addEventListener('click', closeModal);

btnCadastrar.addEventListener('click', openModal);
btnCadastrar.addEventListener('click', () =>  document.querySelector('.modal-header>h2').innerHTML = 'Novo Aluno');

document.querySelector('.table>tbody')
    .addEventListener('click', editDelete);
