# Real-Time Flood Monitoring

This project is a web application that fetches and visualizes real-time flood monitoring data from a public API. The application allows users to select a station and view the flood monitoring readings over a specified duration. Additionally, the app provides some basic statistical analysis, including minimum, maximum, average, and trend (upward/downward) of the readings.

## Features
- Select a monitoring station from a list of available stations.
- View real-time flood monitoring readings for the selected station.
- Display the readings in a line chart.
- Display statistical analysis of the readings, including:
  - Minimum, Maximum, and Average values
  - Median value
  - Trend (upward/downward)
- Option to choose the duration for which the data is displayed (e.g., last 24 hours).
- Display the readings in a Table.

## Requirements

- Python 3.x
- Flask
- Requests
- Plotly (for chart rendering)

## Setup

1. Clone this repository:
   git clone https://github.com/mrezakhani/flood-monitoring.git
   cd flood-monitoring

2. Install the required dependencies:
pip install -r requirements.txt

3. Run the Flask app:
python main.py
Open your browser and go to http://127.0.0.1:5000/ to access the application.