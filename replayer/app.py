from flask import Flask, request
from flask_cors import CORS
import json
import atexit

app = Flask(__name__)
CORS(app)

steps = []


@app.route("/event", methods=['POST'])
def event():
    event = json.loads(request.data)
    print(event)
    steps.append(event)
    return "ok"

def write_steps():
    with open("steps.json", "w") as file:
        file.write(json.dumps(steps, indent=4))
#Register the function to be called on exit
atexit.register(write_steps)
