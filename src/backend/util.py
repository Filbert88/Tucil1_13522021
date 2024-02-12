import random
import os

def read_input_file(file_path):
    try:
        with open(file_path, 'r') as file:
            buffer_size = int(file.readline().strip())
            if buffer_size <= 0:
                raise ValueError("Buffer size must be positive.")

            rows, columns = map(int, file.readline().split())
            if rows <= 0 or columns <= 0:
                raise ValueError("Rows and columns must be positive.")

            matrix = [file.readline().strip().split() for _ in range(rows)]
            if any(len(row) != columns for row in matrix):
                raise ValueError("Matrix dimensions mismatch.")

            number_of_sequences = int(file.readline().strip())
            if number_of_sequences <= 0:
                raise ValueError("Number of sequences must be positive.")

            sequences = {}  
            rewards = []
            for _ in range(number_of_sequences):
                sequence = tuple(file.readline().strip().split())
                if not sequence:
                    raise ValueError("Empty sequence found.")
                reward = int(file.readline().strip())
                sequences[sequence] = reward
                rewards.append(reward)

        return buffer_size, matrix, number_of_sequences, sequences, rewards
    except ValueError as e:
        raise ValueError(f"Invalid file format: {e}")
    except Exception as e:
        # Catch other potential errors, e.g., file not found, permission issues
        raise IOError(f"Error reading file: {e}")

def get_valid_filename(prompt, initial_filename=None, directory="output"):
    filename = initial_filename
    while True:
        if filename is None:
            filename = input(prompt) 

        full_path = os.path.join(directory, filename)

        if not os.path.exists(full_path):
            return filename
        else:
            print(f"File {filename} already exists. Please enter a different name.")
            filename = None  

def save_output_to_file(reward, sequence, coordinates, execution_time_ms, file_name=None):
    directory = "../test"
    os.makedirs(directory, exist_ok=True)  

    if file_name is None or os.path.exists(os.path.join(directory, file_name)):
        file_name_prompt = "Enter the desired file name (with .txt extension): "
        file_name = get_valid_filename(file_name_prompt, file_name, directory)

    full_path = os.path.join(directory, file_name)

    with open(full_path, 'w') as file:
        file.write(f"{reward}\n")
        sequence_str = ' '.join(sequence) if sequence else "No sequence found"
        file.write(f"{sequence_str}\n")
        for coord in coordinates:
            file.write(f"{coord[0]}, {coord[1]}\n")
        file.write(f"{execution_time_ms} ms\n")

    print(f"Results saved to {full_path}.")

def generate_matrix(row, column, tokens):
    matrix = []
    for _ in range(row):
        matrix.append([random.choice(tokens) for _ in range(column)])
    return matrix

def generate_sequences(tokens, number_of_sequences, max_sequence_size):
    sequences = []
    for _ in range(number_of_sequences):
        sequence_length = random.randint(1, max_sequence_size)
        sequences.append([random.choice(tokens) for _ in range(sequence_length)])
    return sequences

def show_code_matrix(matrix, sequences, rewards):
    print("\nCODE MATRIX")
    for row in matrix:
        print(" | ".join(row))
    print("\nSequences:")
    for sequence in sequences:
        print(sequence)
    print("\nRewards:")
    for reward in rewards:
        print(reward)
    print()

def validate_input(prompt):
    while True:
        try:
            value = int(input(prompt))
            if value < 0:
                print("Error: Please re-enter a non-negative integer.")
            else:
                return value
        except ValueError:
            print("Error: Please re-enter a valid integer.")


