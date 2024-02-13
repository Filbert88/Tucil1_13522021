<h1 align="center">Tugas Kecil 1 IF2211 Strategi Algoritma</h1>
<h2 align="center">Semester II tahun 2023/2024</h2>
<h3 align="center">Penyelesaian Cyberpunk 2077 Breach Protocol dengan Algoritma Brute Force</p>

## Table of Contents

- [Short Description](#short-description)
- [Creator](#creator)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Guides](#guides)
  - [Input File Method](#input-file-method)
  - [Manual Input Method](#manual-input-method)
  - [Saving the Solution](#saving-the-solution)
  - [For CLI Users](#for-cli-users)
- [Links](#links)

## Short Description

This program is designed to solve the Cyberpunk 2077 Breach Protocol mini-game using a brute-force algorithm. The majority of the program is written in Python, with a web-based GUI implemented using NextJS and Tailwind Css for the frontend framework and Flask for the backend framework.

Cyberpunk 2077 Breach Protocol is a hacking mini-game within the Cyberpunk 2077 video game. It simulates local network hacking of ICE (Intrusion Countermeasures Electronics) in Cyberpunk 2077. The components of this mini-game include:

- Tokens - consisting of two alphanumeric characters such as E9, BD, and 55.
- Matrix - composed of tokens that will be selected to form a sequence of codes.
- Sequences - a series of tokens (two or more) that must be matched.
- Buffer - the maximum number of tokens that can be arranged sequentially.

Rules of the Breach Protocol mini-game include:

- Players move in a pattern of horizontal, vertical, horizontal, vertical (alternating) until all sequences are successfully matched or the buffer is full.
- Players start by selecting one token at the top row position of the matrix.
- Sequences are matched against the tokens in the buffer.
- One token in the buffer can be used in more than one sequence.
- Each sequence has varying reward weights.
- Sequences must have a minimum length of two tokens.

For more detailed information on Cyberpunk 2077 Breach Protocol, refer to this [link](https://cyberpunk.fandom.com/wiki/Quickhacking).

## Creator

| NIM      | Nama    | Kelas |
| -------- | ------- | ----- |
| 13522021 | Filbert | K-01  |

## Built With

- [NextJs](https://nextjs.org/)
- [Flask](https://flask.palletsprojects.com/en/3.0.x/)
- [Tailwind](https://tailwindcss.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Git
- Node.js and npm
- Python 3 and pip

## Installation

## WEB-BASED GUI

If you want to run this program you will need to do these steps

1. Clone this repository :

```shell
git clone https://github.com/Filbert88/Tucil1_13522021.git
```

2. Navigate to the `src` directory:

```shell
cd .\Tucil1_13522021\
cd src
```

3. Open another terminal in the same folder directory. Now, you should have two terminals open, both in the `Tucil1_13522045/src` directory.

### First Terminal (To run frontend server)

4. Change directory to the frontend folder and execute the following commands:

```shell
cd frontend
npm install
npm run dev
```

5. Open a web browser and navigate to [http://localhost:3000/](http://localhost:3000/). Note: The port number may vary if the default port is in use. Check the terminal to determine which port the server is running on.

### Second terminal (To run backend server)

6. Change directory to the backend folder:

```shell
cd backend
```

Now, we need to set venv in order to run the program

_For windows user_

```shell
python -m venv venv or
venv\Scripts\activate
```

_For linux/macOS user_

```shell
python3 -m venv .venv
. .venv/bin/activate
```

**Download packages needed, by following below steps**

```shell
python -m pip install Flask Flask-CORS
```

7. Start the Flask server by typing the following command:

```shell
python app.py
```

8. The backend server should now be running at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## CLI

1. Clone this repository :

```shell
git clone https://github.com/Filbert88/Tucil1_13522021.git
```

2. Navigate to the `src` directory:

```shell
cd .\Tucil1_13522021\
cd src
cd CLI
```

3. Open terminal in current directory and just type `python main.py`

## Guides

### Input file method

1. Choose a `.txt` file to upload. Make sure the file follows the correct input format; any errors may prevent the website from processing it correctly.
2. After selecting the file, upload it. You will see the matrix, sequences, and associated rewards displayed on the screen.
3. To solve the matrix, click the `Solve` button. Once the solution is ready, the `View Result` button will appear. Click it to display the solution in a modal popup.
4. In the popup window, you have the option to save the solution or close the window. If you wish to process another file, it's recommended to refresh the page before proceeding.

### Manually Input Method

1. Select the buffer size from the options provided.
2. Input unique tokens that will populate the matrix and sequences.
3. Define the dimensions of the matrix by specifying the desired width and height.
4. Determine the number of sequences to generate along with the maximum length for each sequence.
5. Click on `Generate Matrix and Sequences` once all the information is entered.
6. Verify the generated matrix and sequences on the screen.
7. Press the `Solve` button to find the optimal path, which will then be displayed in a modal popup window upon completion.

### Saving the Solution
1. When the solution is displayed in the popup window, click on the `Download Solution` button. The solution will be downloaded to your default downloads folder.

### FOR CLI USERS

Just note that there is no specific guides on how to use the terminal program, just run the main.py program and make sure to follow the guides and instructions on what is being asked by the terminal. For the random input method, just make sure that you have the format with you, so you could run the program perfectly.

## Links

- Repository : https://github.com/Filbert88/Tucil1_13522021.git
- Issue tracker :
  - If you encounter any issues with the program, come across any disruptive bugs, or have any suggestions for improvement, please don't hesitate to reach out by sending an email to filbertfilbert21@gmail.com. Your feedback is greatly appreciated.
