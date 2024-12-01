// Globaalsed muutujad
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Laadime ülesanded localStorage-st, kui neid seal pole, siis kasutame tühja massiivi
let currentPriority = 'low'; // Algne prioriteet on madal ('low')

// Ülesannete salvestamine localStorage-sse
function saveTasksToLocalStorage() {
    // Salvestame ülesannete massiivi JSON-formaadis localStorage-sse
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Uue ülesande lisamine
function addTask() {
    // Saame kasutaja sisestatud ülesande kirjelduse
    const taskInput = document.getElementById('new-task').value.trim(); // Trim eemaldab tühikud algusest ja lõpust
    const taskDate = document.getElementById('task-date').value; // Kuupäeva väärtus

    // Kui ülesande kirjeldus on tühi, siis kuvatakse hoiatus
    if (!taskInput) {
        alert('Palun sisestage ülesande kirjeldus.'); // Kui ülesanne pole sisestatud, kuvatakse hoiatus
        return; // Kui ülesannet pole, siis ei tee midagi rohkem
    }

    // Kui kuupäeva ei ole sisestatud, siis kasutame praegust kuupäeva
    const taskDateFormatted = taskDate ? formatDate(taskDate) : formatDate(new Date());

    // Lisame ülesande massiivi
    tasks.push({
        name: taskInput, // Ülesande nimi
        date: taskDateFormatted, // Ülesande kuupäev
        priority: currentPriority // Ülesande prioriteet
    });

    saveTasksToLocalStorage(); // Salvestame ülesanded localStorage-sse

    // Tühjendame sisestatud väärtused
    document.getElementById('new-task').value = '';
    document.getElementById('task-date').value = '';
    currentPriority = 'low'; // Lähtestame prioriteedi 'low'

    renderTasks(); // Kuvame uuesti kõik ülesanded
}

// Kõikide ülesannete kuvamine
function renderTasks() {
    const taskList = document.getElementById('task-list'); // Leiame HTML-is ülesandeloendi
    taskList.innerHTML = ''; // Eemaldame kõik varasemad ülesanded, et ei jääks vanu ülesandeid

    // Läbime kõik ülesanded ja kuvame need loendis
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li'); // Loome uue loendi elemendi

        // Loome HTML struktuuri, et kuvada ülesande nime, kuupäeva ja prioriteedi
        taskItem.innerHTML = `
            <div class="task-priority">${capitalizeFirstLetter(task.priority)}</div> <!-- Kuvame ülesande prioriteedi -->
            <div class="task-name"><strong>${task.name}</strong></div> <!-- Kuvame ülesande nime -->
            <div class="task-date">${task.date}</div> <!-- Kuvame ülesande kuupäeva -->
            <button onclick="deleteTask(${index})">X</button> <!-- Kustutamise nupp -->
        `;
        taskList.appendChild(taskItem); // Lisame ülesande loendisse
    });
}

// Ülesande kustutamine
function deleteTask(index) {
    // Eemaldame ülesande massiivist vastavalt indexile
    tasks.splice(index, 1);

    saveTasksToLocalStorage(); // Salvestame muudatused localStorage-sse
    renderTasks(); // Kuvame uuesti kõik ülesanded
}

// Kuupäeva formaadi muutmine (DD.MM.YYYY)
function formatDate(date) {
    const d = new Date(date); // Loome kuupäeva objekti
    const day = String(d.getDate()).padStart(2, '0'); // Päev, tagame, et see oleks kaheastmeline (nt '01')
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Kuu, kuupäevaindeks on nullipõhine, seega lisame 1
    const year = d.getFullYear(); // Aasta
    return `${day}.${month}.${year}`; // Tagastame kuupäeva formaadis 'DD.MM.YYYY'
}

// Avame/suletame prioriteedi valiku nimekirja
function togglePriority() {
    const priorityOptions = document.getElementById('priority-options');
    // Kui prioriteedi nimekiri on avatud, siis sulgeme selle, vastasel juhul avame
    priorityOptions.style.display = priorityOptions.style.display === 'block' ? 'none' : 'block';
}

// Prioriteedi seadmine ülesandele
function setPriority(priority) {
    currentPriority = priority; // Seame praeguseks prioriteediks valitud väärtuse
    document.getElementById('priority').value = capitalizeFirstLetter(priority); // Kuvame valitud prioriteedi sisendväljal
    document.getElementById('priority-options').style.display = 'none'; // Peidame prioriteedi valiku nimekirja
}

// Esimese tähe suurte tähtedega muutmine
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); // Tagastame sõna, mille esimene täht on suurtäht
}

// Ülesannete otsimine
function searchTasks() {
    // Saame otsingusõna ja muudame selle väikesteks tähtedeks
    const searchTerm = document.getElementById('search').value.toLowerCase(); 
    // Filtreerime ülesanded vastavalt sisestatud otsingule
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm)); 

    const taskList = document.getElementById('task-list'); // Leiame ülesandeloendi
    taskList.innerHTML = ''; // Eemaldame kõik eelnevad ülesanded

    // Kuvame ainult need ülesanded, mis vastavad otsingule
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li'); // Loome ülesande elemendi
        taskItem.innerHTML = `
            <div class="task-priority">${capitalizeFirstLetter(task.priority)}</div> <!-- Kuvame prioriteedi -->
            <div class="task-name"><strong>${task.name}</strong></div> <!-- Kuvame ülesande nime -->
            <div class="task-date">${task.date}</div> <!-- Kuvame ülesande kuupäeva -->
            <button onclick="deleteTask(${index})">X</button> <!-- Kustutamise nupp -->
        `;
        taskList.appendChild(taskItem); // Lisame ülesande loendisse
    });
}

// Lehe alglaadimine ja ülesannete kuvamine
document.addEventListener('DOMContentLoaded', () => {
    renderTasks(); // Kuvame ülesanded, kui leht on laaditud
});
