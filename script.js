document.getElementById("standup-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const yesterday = document.getElementById("yesterday").value;
  const today = document.getElementById("today").value;
  const blockers = document.getElementById("blockers").value;
  const date = document.getElementById("date").value;

  const editingIndex = this.getAttribute('data-editing');
  let entries = JSON.parse(localStorage.getItem("standupEntries")) || [];

  const newEntry = { name, yesterday, today, blockers, date };

  if (editingIndex !== null) {
    entries[editingIndex] = newEntry;
    this.removeAttribute('data-editing');
  } else {
    entries.push(newEntry);
  }

  localStorage.setItem("standupEntries", JSON.stringify(entries));
  this.reset();
  loadEntries();
});

function loadEntries() {
  const table = document.getElementById("log-table");
  table.innerHTML = "";

  let entries = JSON.parse(localStorage.getItem("standupEntries")) || [];

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.yesterday}</td>
      <td>${entry.today}</td>
      <td>${entry.blockers}</td>
      <td>${entry.date}</td>
      <td>
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </td>
    `;

    table.appendChild(row);
    updateSummary(entries);

  });
}

function deleteEntry(index) {
  let entries = JSON.parse(localStorage.getItem("standupEntries")) || [];
  entries.splice(index, 1);
  localStorage.setItem("standupEntries", JSON.stringify(entries));
  loadEntries();
}

function editEntry(index) {
  let entries = JSON.parse(localStorage.getItem("standupEntries")) || [];
  const entry = entries[index];

  document.getElementById("name").value = entry.name;
  document.getElementById("yesterday").value = entry.yesterday;
  document.getElementById("today").value = entry.today;
  document.getElementById("blockers").value = entry.blockers;
  document.getElementById("date").value = entry.date;

  const form = document.getElementById("standup-form");
  form.setAttribute('data-editing', index);
}

window.onload = loadEntries;
function updateSummary(entries) {
  document.getElementById("total-entries").textContent = entries.length;

  const names = [...new Set(entries.map(e => e.name))];
  document.getElementById("names-submitted").textContent = names.join(', ');

  const blockers = entries.filter(e => e.blockers.trim() !== "").length;
  document.getElementById("blocker-count").textContent = blockers;

  const dates = entries.map(e => new Date(e.date));
  if (dates.length > 0) {
    const minDate = new Date(Math.min(...dates)).toISOString().split('T')[0];
    const maxDate = new Date(Math.max(...dates)).toISOString().split('T')[0];
    document.getElementById("date-range").textContent = `${minDate} to ${maxDate}`;
  } else {
    document.getElementById("date-range").textContent = "N/A";
  }
}

