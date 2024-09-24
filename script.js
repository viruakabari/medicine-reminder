document.addEventListener('DOMContentLoaded', function () {
    loadRemindersFromLocalStorage();

    // Navbar toggle for mobile
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });

    // Add Reminder Event
    document.getElementById('add-reminder-btn').addEventListener('click', function () {
        const name = document.getElementById('medicine-name').value.trim();
        const dosage = document.getElementById('medicine-dosage').value.trim();
        const time = document.getElementById('reminder-time').value;

        if (name && dosage && time) {
            const reminder = {
                id: Date.now(),
                name,
                dosage,
                time
            };
            addReminderToDOM(reminder);
            addReminderToLocalStorage(reminder);
            setMedicineReminder(reminder);
            document.getElementById('medicine-name').value = '';
            document.getElementById('medicine-dosage').value = '';
            document.getElementById('reminder-time').value = '';
        } else {
            alert('Please fill out all fields');
        }
    });

    // Clear Reminders Event
    document.getElementById('clear-reminders-btn').addEventListener('click', clearAllReminders);
});

function addReminderToDOM(reminder) {
    const reminderList = document.getElementById('reminder-list');

    const reminderItem = document.createElement('li');
    reminderItem.setAttribute('data-id', reminder.id);

    reminderItem.innerHTML = `
        <span><strong>${reminder.name}</strong> - ${reminder.dosage} at ${reminder.time}</span>
        <button class="delete-btn">Delete</button>
    `;

    reminderItem.querySelector('.delete-btn').addEventListener('click', function () {
        removeReminder(reminder.id);
    });

    reminderList.appendChild(reminderItem);
}

function addReminderToLocalStorage(reminder) {
    const reminders = getRemindersFromLocalStorage();
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function loadRemindersFromLocalStorage() {
    const reminders = getRemindersFromLocalStorage();
    reminders.forEach(reminder => {
        addReminderToDOM(reminder);
        setMedicineReminder(reminder);
    });
}

function getRemindersFromLocalStorage() {
    return JSON.parse(localStorage.getItem('reminders')) || [];
}

function removeReminder(id) {
    const reminders = getRemindersFromLocalStorage();
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));

    const reminderItem = document.querySelector(`[data-id="${id}"]`);
    if (reminderItem) {
        reminderItem.remove();
    }
}

function clearAllReminders() {
    localStorage.removeItem('reminders');
    document.getElementById('reminder-list').innerHTML = '';
}

// Function to set medicine reminder notifications
function setMedicineReminder(reminder) {
    const reminderTime = new Date();
    const [hours, minutes] = reminder.time.split(':');
    reminderTime.setHours(hours);
    reminderTime.setMinutes(minutes);

    const currentTime = new Date();
    const timeDifference = reminderTime.getTime() - currentTime.getTime();

    if (timeDifference > 0) {
        setTimeout(() => {
            alert(`Time to take your medicine: ${reminder.name} (${reminder.dosage})`);
        }, timeDifference);
    }
}
