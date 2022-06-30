let DB;

// Selectors 
const form = document.querySelector('form'),
    petName = document.querySelector('#pet'),
    ownerName = document.querySelector('#owner'),
    phone = document.querySelector('#phone'),
    date = document.querySelector('#date'),
    hour = document.querySelector('#hour'),
    symptoms = document.querySelector('#symptoms'),
    headerAdministra = document.querySelector('#administra'),
    appointments = document.querySelector('#appointments');

// wait for the DOM
document.addEventListener('DOMContentLoaded', () => {

    //Creating the database.
    let createDB = window.indexedDB.open('appointments', 1);

    // If there is an error show it.
    createDB.onerror = function() {
            console.log('There was an error');
        }
        // If all goes fine then shows the account, and assign the data base.

    createDB.onsuccess = function() {
            //Asign to the data base.
            DB = createDB.result;
            showAppointments();
        }
        // This method just runs once and is ideal for create the Schema.
    createDB.onupgradeneeded = function(e) {
        // This event is the same database
        let db = e.target.result;

        //Define the object store, take 2 params, 1 the name, 2 the options.
        //keyPath is the index of te data base.
        let objectStore = db.createObjectStore('appointments', {
            keyPath: 'key',
            autoIncrement: true
        });

        // Create index and fields of the databse, createIndex:  3 parameters, name, keyPath and options.
        objectStore.createIndex('petName', 'petName', { unique: false });
        objectStore.createIndex('ownerName', 'ownerName', { unique: false });
        objectStore.createIndex('phone', 'phone', { unique: false });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('hour', 'hour', { unique: false });
        objectStore.createIndex('symptoms', 'symptoms', { unique: false });
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const appointment = {}
    appointment.petName = petName.value;
    appointment.ownerName = ownerName.value;
    appointment.phone = phone.value;
    appointment.date = date.value;
    appointment.hour = hour.value;
    appointment.symptoms = symptoms.value;


    //In the IndexedDB the transactions are used.
    let transaction = DB.transaction(['appointments'], 'readwrite');
    let objectStore = transaction.objectStore('appointments');

    let request = objectStore.add(appointment);

    console.log(request);


    request.onsuccess = () => {
        form.reset();
    }

    transaction.oncomplete = () => {
        console.log('Appointment added.');
        showAppointments();
    }

    transaction.onerror = () => {
        console.log('There was an error.');
    }

});


function showAppointments() {

    //Clear the previous ones.
    while (appointments.firstChild) {

        appointments.removeChild(appointments.firstChild);
    }
    //Creating objectStore
    let objectStore = DB.transaction('appointments').objectStore('appointments');

    //Returning the request.
    objectStore.openCursor().onsuccess = function(e) {

        let cursor = e.target.result;
        let count = 0

        if (cursor) {

            let appointmentHTML = document.createElement('li');
            appointmentHTML.setAttribute('data-appointment-id', cursor.value.key);
            appointmentHTML.classList.add('list-group-item');

            appointmentHTML.innerHTML = `
            <p class="font-weight-bold">Mascota: <span class ="font-weight-normal">${cursor.value.petName}</span></p>
            <p class="font-weight-bold">Owner: <span class ="font-weight-normal">${cursor.value.ownerName}</span></p>
            <p class="font-weight-bold">Phone: <span class ="font-weight-normal">${cursor.value.phone}</span></p>
            <p class="font-weight-bold">Date: <span class ="font-weight-normal">${cursor.value.date}</span></p>
            <p class="font-weight-bold">Hour: <span class ="font-weight-normal">${cursor.value.hour}</span></p>
            <p class="font-weight-bold">Symptoms: <span class ="font-weight-normal">${cursor.value.symptoms}</span></p>
            `;

            //Adding a delete Button.
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete', 'btn', 'btn-danger');
            deleteButton.innerHTML = `<span aria-hidden="true">x Cancel</span>`;
            deleteButton.onclick = deleteAppointment;
            appointmentHTML.appendChild(deleteButton);

            //Append in the father.
            appointments.appendChild(appointmentHTML);
            headerAdministra.textContent = `Pending appointments: ${appointments.childElementCount}`

            cursor.continue();


        } else {

            if (!appointments.firstChild) {
                headerAdministra.textContent = 'Add Services';
                let list = document.createElement('p');
                list.classList.add('text-center');
                list.textContent = 'There aren\'t any Services provided by you yet.';
                appointments.appendChild(list);
            }

        }
    }

}

function deleteAppointment(e) {
    let appointmentId = Number(e.target.parentElement.getAttribute('data-appointment-id'));

    let transaction = DB.transaction(['appointments'], 'readwrite');
    let objectStore = transaction.objectStore('appointments');
    let request = objectStore.delete(appointmentId);

    transaction.oncomplete = (e) => {
        showAppointments();
    }
}