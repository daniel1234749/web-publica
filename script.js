let originalData = [];
let filteredData = [];

document.getElementById("csvFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        originalData = results.data;
        filteredData = [...originalData];
        document.getElementById("filterSection").style.display = "flex";
        renderTable(filteredData);
      },
      error: function (err) {
        alert("Error al leer el archivo: " + err.message);
      }
    });
  }
});

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function aplicarFiltro() {
  const searchText = searchInput.value.toLowerCase();
  filteredData = originalData.filter(row =>
    (row["Productos"] || "").toLowerCase().includes(searchText)
  );
  renderTable(filteredData);
}

searchBtn.addEventListener("click", aplicarFiltro);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    aplicarFiltro();
  }
});

document.getElementById("exportBtn").addEventListener("click", function () {
  if (filteredData.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(filteredData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos CSV");
  XLSX.writeFile(wb, "datos_filtrados.xlsx");
});

function renderTable(data) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = "<tr><td>No hay datos para mostrar</td></tr>";
    return;
  }

  const headers = Object.keys(data[0]);
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach(row => {
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = row[h] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}
