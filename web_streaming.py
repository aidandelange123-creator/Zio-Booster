from flask import Flask, render_template, Response
import psutil
import time
import json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('dashboard.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('request_metrics')
def handle_request_metrics():
    metrics = get_system_metrics()
    emit('metrics_update', metrics)

def get_system_metrics():
    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory()
    temperature = get_temperature()
    processes = get_process_info()
    return json.dumps({
        'cpu': cpu,
        'memory': memory.percent,
        'temperature': temperature,
        'processes': processes
    })

def get_temperature():
    # Placeholder function to get temperature. Adjust according to the platform.
    return 75.0  # Dummy temperature value

def get_process_info():
    # Get process information
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'memory_info']):
        processes.append(proc.info)
    return processes

if __name__ == '__main__':
    socketio.run(app, debug=True)