import time
from program import *
from util import *

def main():
    print("Welcome to the Cyberpunk Hacking Challenge!")
    method = input("How would you like to embark on this cyber adventure? (Enter 'C' for CLI or 'F' for file): ").strip().upper()
    
    if method == "F":
        file_path = 'input.txt'
        buffer_size, matrix, number_of_sequences, sequences, rewards = read_input_file(file_path)
        show_code_matrix(matrix, sequences, rewards)
        start = time.time()
        optimal_path, optimal_path_coords, max_reward = find_optimal_path(matrix, sequences, buffer_size)

        sequences_result = ' '.join(optimal_path)
        coordinates = ' -> '.join(f"({x},{y})" for x, y in optimal_path_coords)
        print("======= RESULT =======")

        if(max_reward == 0) :
            print("Max Reward: 0 (No sequence found)")
        else :
            print("Max Reward:", max_reward)
            print("Optimal Path:", sequences_result)
            print("Optimal Path Coordinates:", coordinates)

        end = time.time()
    else:
        unique_tokens = validate_input("\nEnter the number of unique tokens you want to use: ", min_value=2)
        tokens = collect_tokens(unique_tokens)
        buffer_size = validate_input("Enter the size of the buffer you want: ", min_value=1)
        row = validate_input("Enter the number of rows you want: ", min_value=1)
        column = validate_input("Enter the number of columns you want: ", min_value=1)
        number_of_sequences = validate_input("Enter the number of sequences you want: ", min_value=2)
        sequences_size = validate_input("Enter the maximum size of sequences you want: ", min_value=1, max_value=buffer_size)

        matrix = generate_matrix(row, column, tokens)
        sequences = generate_sequences(tokens, number_of_sequences, sequences_size)
        rewards = [random.randint(1, 100) for _ in range(number_of_sequences)]

        sequences = {tuple(seq): reward for seq, reward in zip(sequences, rewards)}
        show_code_matrix(matrix, sequences, rewards)
        
        start = time.time()
        optimal_path, optimal_path_coords, max_reward = find_optimal_path(matrix, sequences, buffer_size)
        end = time.time()

        sequences_result = ' '.join(optimal_path)
        coordinates = ' -> '.join(f"({x},{y})" for x, y in optimal_path_coords)

        print("======= RESULT =======")
        if(max_reward == 0) :
            print("Max Reward: 0 (No sequence found)")
        else :
            print("Max Reward:", max_reward)
            print("Optimal Path:", sequences_result)
            print("Optimal Path Coordinates:", coordinates)

    
    execution_time_ms = int((end - start) * 1000) 
    print(f"\n\nExecution time: {execution_time_ms} ms")

    output = input("\nDo you want to save the result? (Y/N) ").strip().upper()
    if output == "Y":
        save_output_to_file(max_reward, optimal_path, optimal_path_coords, execution_time_ms)
        print("Results saved.")
    else:
        print("Thank you for playing the game.")



if __name__ == "__main__":
    main()