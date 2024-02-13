def find_optimal_path(matrix, sequences, buffer_size):
    rows, cols = len(matrix), len(matrix[0])
    max_reward = 0
    optimal_path = []
    optimal_path_coords = []
    max_sequence_reward = max(sequences.values())

    def check_sequences_in_path(path):
        total_reward = 0
        
        for seq, reward in sequences.items():
            seq_str = ' '.join(seq)
            if seq_str in ' '.join(path):
                total_reward += reward
        return total_reward

    def generate_path(row, col, path, coords, step, current_reward, direction):
        nonlocal max_reward, optimal_path, optimal_path_coords
        
        potential_reward = current_reward + (buffer_size - step) * max_sequence_reward
        if potential_reward < max_reward:
            return  
        
        if step == buffer_size or row >= rows or row < 0 or col >= cols or col < 0:
            return

        new_path = path + [matrix[row][col]]
        new_coords = coords + [(row+1, col+1)]
        new_reward = check_sequences_in_path(new_path)
        
        if new_reward > max_reward:
            max_reward = new_reward
            optimal_path = new_path
            optimal_path_coords = new_coords
        
        if direction == 'row':
            for next_col in range(cols):
                if next_col != col:  
                    generate_path(row, next_col, new_path, new_coords, step + 1, new_reward, 'col')
        else:
            for next_row in range(rows):
                if next_row != row: 
                    generate_path(next_row, col, new_path, new_coords, step + 1, new_reward, 'row')

    for col_start in range(cols):
        generate_path(0, col_start, [], [], 0, 0, 'col')

    return optimal_path, optimal_path_coords, max_reward

