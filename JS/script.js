
let API_URL = "https://69675216bbe157c088b18ab3.mockapi.io/Phonebook";



let form = document.getElementById('phonebook');
let contactlist = document.getElementById('contactlist');

let nameInput = document.getElementById('nameInput');
let numberInput = document.getElementById('numInput');
let searchInput = document.getElementById('searchInput');
let searchbtn = document.getElementById('searchbtn');

let viewbtn = document.getElementById('viewbtn');
let editId = "";

let isVisible = false;



const addContact = async (e) => {

    e.preventDefault();

    try {

        const contactdata = {

            Name: nameInput.value,
            PhoneNumber: numberInput.value

        };

        //UPDATE

        if (editId !== "") {
            await fetch(`${API_URL}/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactdata),
            });

            editId = "";
            form.querySelector("#addbtn").innerText = "Add Contact";

            isVisible = false;
            getcontact();

        }
        //ADD CONTACT
        else {

            await fetch(API_URL, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactdata)

            });
        }

        form.reset();
    }
    catch (error) {
        alert("Failed");
        console.log(error);
    }


};




async function getcontact() {

    if (isVisible) {
        contactlist.innerHTML = "";
        isVisible = false;
        return;
    }

    const res = await fetch(API_URL);
    const contacts = await res.json();

    displayContact(contacts);
    isVisible = true;

}

function displayContact(list) {               // DISPLAY 


    contactlist.innerHTML = " ";

    for (let i = 0; i < list.length; i++) {
        const contact = list[i];
        contactlist.innerHTML += `<div  class="gallery">
        <h1>${contact.Name}</h1>
        <h2>${contact.PhoneNumber}</h2>
        <button onclick="editContact(${contact.id})">EDIT</button>
        <button onclick="deleteContact(${contact.id})">DELETE</button>

        </div> `;
    };



}




//DELETE

async function deleteContact(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });


    isVisible = false;
    getcontact();

}




//EDIT

async function editContact(id) {

    const response = await fetch(`${API_URL}/${id}`);
    const contact = await response.json();

    nameInput.value = contact.Name;
    numberInput.value = contact.PhoneNumber;

    editId = id;

    form.querySelector("#addbtn").innerText = "Update Contact";


}




// SEARCH using button --search

async function searchContact() {

    let searchValue = searchInput.value.trim();

    if (searchValue === "") {
        alert("Please enter name or number");
        return;
    }

    const response = await fetch(API_URL);
    const contacts = await response.json();

    let result = [];

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact.Name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            contact.PhoneNumber.includes(searchInput.value)) {

            result.push(contact);
        }


    }


    if (result.length === 0) {

        alert("Contact not found");
        form.reset();
        return;

    }

    displayContact(result);
    form.reset();
    isVisible = true;



}



form.addEventListener('submit', addContact);
viewbtn.addEventListener('click', getcontact);
searchbtn.addEventListener('click', searchContact);




