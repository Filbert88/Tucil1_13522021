import random
import os

def read_input_file(file_path):
    try:
        with open(file_path, 'r') as file:
            buffer_size = int(file.readline().strip())
            if not file_path.endswith('.txt'):
                raise ValueError("Only .txt files are allowed.")
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
        raise IOError(f"Error reading file: {e}")

def get_valid_filename(prompt, initial_filename=None, directory="output"):
    while True:
        filename = initial_filename or input(prompt)
        if not filename.endswith('.txt'):
            print("The file must have a .txt extension.")
            initial_filename = None  
            continue

        full_path = os.path.join(directory, filename)
        if not os.path.exists(full_path):
            return filename
        else:
            print(f"File {filename} already exists. Please enter a different name.")
            initial_filename = None  

def save_output_to_file(reward, sequence, coordinates, execution_time_ms, file_name=None):
    directory = "output"
    os.makedirs(directory, exist_ok=True)

    if file_name is None:
        file_name_prompt = "Enter the desired file name (with .txt extension): "
        file_name = get_valid_filename(file_name_prompt, directory=directory)
    elif not file_name.endswith('.txt'):
        print("The file must have a .txt extension.")

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


def validate_input(prompt, min_value=1, max_value=None, exact_value=None, token=False):
    while True:
        value = input(prompt)
        try:
            if token:  # Token validation
                if len(value) != 2:
                    raise ValueError("Each token must be exactly two characters long.")
                if not value.isalnum():
                    raise ValueError("Tokens must be alphanumeric.")
                return value.upper()  
            else:  
                value = int(value)
                if min_value is not None and value < min_value:
                    raise ValueError(f"The value must be at least {min_value}.")
                if max_value is not None and value > max_value:
                    raise ValueError(f"The value must not exceed {max_value}.")
                if exact_value is not None and value != exact_value:
                    raise ValueError(f"The value must exactly be {exact_value}.")
                return value
        except ValueError as e:
            print("Invalid input:", e)

def collect_tokens(unique_tokens):
    tokens = []
    for i in range(unique_tokens):
        token = validate_input(f"Enter token {i+1}: ", token=True)
        while token in tokens:
            print("This token has already been entered. Please enter a unique token.")
            token = validate_input(f"Enter token {i+1}: ", token=True)
        tokens.append(token)
    return tokens


