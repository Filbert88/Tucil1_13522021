# src/backend/app.py
import os
import time
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from random import randint
from util import generate_matrix, generate_sequences, read_input_file  # Ensure util.py is accessible
from program import find_optimal_path

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def handle_generate():
    data = request.json
    matrix = generate_matrix(data['rows'], data['columns'], data['tokens'])
    sequences = generate_sequences(data['tokens'], data['numSequences'], data['sequenceSize'])

    sequences_with_rewards = [{'tokens': seq, 'reward': randint(1, 100)} for seq in sequences]
    return jsonify({'matrix': matrix, 'sequences': sequences_with_rewards})

@app.route('/solve', methods=['POST'])
def handle_solve():
    data = request.json
    sequences_with_rewards = {tuple(seq['tokens']): seq['reward'] for seq in data['sequences']}
    
    start = time.time()
    optimal_path, optimal_path_coords, max_reward = find_optimal_path(data['matrix'], sequences_with_rewards, data['bufferSize'])
    end = time.time()
    execution_time = (end-start) * 1000
    return jsonify({'maxReward': max_reward, 'optimalPath': optimal_path, 'coordinates': optimal_path_coords, 'executionTime' : execution_time})

UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file:
        if not file.filename.endswith('.txt'):
            return jsonify(message="Please upload a .txt file."), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            buffer_size, matrix, number_of_sequences, sequences, rewards = read_input_file(filepath)
            sequences_with_rewards = [{'tokens': list(seq), 'reward': reward} for seq, reward in sequences.items()]

            os.remove(filepath)  # Clean up by removing the file after processing

            return jsonify({
                'bufferSize': buffer_size,
                'matrix': matrix,
                'sequences': sequences_with_rewards
            }), 200
        except (ValueError, IOError) as e:
            os.remove(filepath)  # Clean up by removing the file if error occurs
            return jsonify(message=str(e)), 400       
    else:
        return jsonify(message="No file uploaded."), 400

    
if __name__ == '__main__':
    app.run(debug=True)
