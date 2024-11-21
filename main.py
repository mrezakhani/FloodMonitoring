from datetime import datetime, timedelta
from flask import Flask, render_template, request, jsonify
import requests
import statistics

app = Flask(__name__)

BASE_API_URL = "https://environment.data.gov.uk/flood-monitoring/id/stations/"

# Fetch station information
def fetch_stations():
    try:
        response = requests.get(f"{BASE_API_URL}?_limit=30")
        response.raise_for_status()
        stations = response.json().get("items", [])
        return [
            {"stationReference": station["stationReference"], "town": station.get("town", "Unknown")}
            for station in stations if "town" in station
        ]
    except requests.RequestException as e:
        print(f"Error fetching stations: {e}")
        return []

@app.route("/")
def home():
    stations = fetch_stations()
    return render_template("index.html", stations=stations)

# Fetch data for a selected station
@app.route("/get_data", methods=["POST"])
def get_data():
    station_id = request.json.get("station_id")
    if not station_id:
        return jsonify({"success": False, "message": "No station selected"})

    duration_value = int(request.json.get("duration_value"))
    # Get the current time
    now = datetime.now()
    # Get the time before user selected duration
    startSelectetDuration = now - timedelta(hours = duration_value)
    # Format the datetime to the desired format without milliseconds and with Z at the end 
    formatted_time = startSelectetDuration.isoformat(timespec='seconds')+"Z"
    # API Request
    url = f"{BASE_API_URL}{station_id}/readings?_sorted&since={formatted_time}&_limit=100"
    response = requests.get(url)
    

    if response.status_code != 200:
        return jsonify({"success": False, "message": "Failed to fetch data from API"})

    data = response.json()
    if "items" not in data:
        return jsonify({"success": False, "message": "No data available for this station"})

    readings = data["items"]
    values = [reading["value"] for reading in readings]

    # Advanced data analysis
    analysis = {
        "min": min(values) if values else None,
        "max": max(values) if values else None,
        "average": statistics.mean(values) if values else None,
        "median": statistics.median(values) if values else None,
        "trend": "upward" if values and values[-1] > values[0] else "downward",
    }

    return jsonify({"success": True, "data": readings, "analysis": analysis})


if __name__ == "__main__":
    app.run(debug=True)
