document.getElementById("fetch-data").addEventListener("click", () => {
    const stationId = document.getElementById("station-select").value;
    const durationValue = document.getElementById("duration-select").value;

    if (!stationId) {
        alert("Please select a station!");
        return;
    }

    const info = document.getElementById("station-info");
    info.innerHTML = "Loading data...";

    fetch("/get_data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ station_id: stationId, duration_value: durationValue }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                updateChart(data.data);
                updateStationInfo(data.data);
                updateAnalysis(data.analysis);
                updateTable(data.data);  // Add this line to update the table
            } else {
                info.innerHTML = "No data available.";
                resetChart();
                clearTable();  // Clear the table if no data
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            info.innerHTML = "Error fetching data.";
        });
});

// Plotly.js chart setup
function updateChart(data) {
    if (data.length === 0) {
        resetChart();
        return;
    }

    const labels = data.map((item) => new Date(item.dateTime).toLocaleString());
    const values = data.map((item) => item.value);

    const trace = {
        x: labels,
        y: values,
        type: "scatter",
        mode: "lines+markers",
        line: { color: "rgba(75, 192, 192, 1)" },
        marker: { size: 8, color: "rgba(75, 192, 192, 1)" },
    };

    const layout = {
        title: "Measurement Data",
        xaxis: { title: "Timestamp", showgrid: true },
        yaxis: { title: "Measurement Value", showgrid: true },
        margin: { l: 50, r: 50, t: 50, b: 50 },
    };

    Plotly.newPlot("chart", [trace], layout);
}

function resetChart() {
    const layout = {
        title: "No Data Available",
    };
    Plotly.newPlot("chart", [], layout);
}

function updateStationInfo(data) {
    const latestReading = data[0];
    const info = document.getElementById("station-info");
    info.innerHTML = `
        <strong>Station Details:</strong><br>
        <strong>Latest Reading:</strong> ${latestReading.value}<br>
        <strong>Time:</strong> ${new Date(latestReading.dateTime).toLocaleString()}
    `;
}

function updateAnalysis(analysis) {
    const analysisDiv = document.getElementById("analysis");
    analysisDiv.innerHTML = `
        <h3>Analysis</h3>
        <table width="100%">
            <tr>
                <td>Minimum Value: <font class="min">${analysis.min}</font></td>
                <td>Maximum Value: <font class="max">${analysis.max}</font></td>
                <td>Average Value: <font class="avg">${analysis.average}</font></td>
            </tr>
            <tr>
                <td>Median Value: <font class="moreAnalysis">${analysis.median}</font></td>
                <td colspan="2">Trend: <font class="moreAnalysis">${analysis.trend}</font></td>
            </tr>
        </table>
    `;
}

// Function to update the table with the fetched data
function updateTable(data) {
    const tableBody = document.getElementById("data-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing table rows

    data.forEach(item => {
        const row = tableBody.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        const timestamp = new Date(item.dateTime).toLocaleString();
        const value = item.value;

        cell1.textContent = timestamp;
        cell2.textContent = value;
    });
}

// Function to clear the table if no data is available
function clearTable() {
    const tableBody = document.getElementById("data-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear the table
}
