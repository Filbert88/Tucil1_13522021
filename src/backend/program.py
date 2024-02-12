def find_optimal_path(matrix, sequences, buffer_size):
    rows, cols = len(matrix), len(matrix[0])
    max_reward = 0
    optimal_path = []
    optimal_path_coords = []

    def check_sequences_in_path(path):
        total_reward = 0
        
        for seq, reward in sequences.items():
            seq_str = ' '.join(seq)
            if seq_str in ' '.join(path):
                total_reward += reward
        return total_reward

    # Generate paths and calculate rewards
    def generate_path(row, col, path, coords, step, direction):
        nonlocal max_reward, optimal_path, optimal_path_coords
        if step == buffer_size or row >= rows or row < 0 or col >= cols or col < 0:
            return
        
        new_path = path + [matrix[row][col]]
        new_coords = coords + [(row + 1, col + 1)]
        
        reward = check_sequences_in_path(new_path)
        if reward > max_reward:
            max_reward = reward
            optimal_path = new_path
            optimal_path_coords = new_coords

        if direction == 'row':
            for next_col in range(cols):
                generate_path(row, next_col, new_path, new_coords, step + 1, 'col')
        else:
            for next_row in range(rows):
                generate_path(next_row, col, new_path, new_coords, step + 1, 'row')

    # Initiate path generation from the first row
    for col_start in range(cols):
        generate_path(0, col_start, [], [], 0, 'col')

    return optimal_path, optimal_path_coords, max_reward

