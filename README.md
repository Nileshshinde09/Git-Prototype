# Git Prototype

This project is a simplified Git prototype built using **Node.js**, **TypeScript**, and **Bun**. It replicates core Git commands like `init`, `commit`, `status`, and more, giving developers a deeper understanding of how Git works under the hood.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Init repository**: Initialize a new Git repository.
- **Hash Object**: Create a hash for an object and store it in the object store.
- **Add files**: Stage individual files or all files for the next commit.
- **Commit changes**: Save the current staged state to the repository with a commit message.
- **View file contents**: Read a file's contents through the Git prototype.
- **View the tree**: List the current state of the directory tree.
- **Check status**: Display the current state of files (modified, untracked).
- **Reset changes**: Unstage files or reset changes back to the previous state.

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Node.js** (v16+)
- **Bun** (for efficient building)
- **TypeScript** (latest version)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/git-prototype.git
   cd git-prototype
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Compile TypeScript:

   ```bash
   bun run build
   ```

4. Initialize the prototype repository:
   ```bash
   git-prototype init
   ```

## Usage

The Git prototype provides multiple Git-like commands for managing files and commits within a project. Here's a list of the available commands and how to use them:

### Available Commands

| Command      | Description                                          | Usage                                   |
| ------------ | ---------------------------------------------------- | --------------------------------------- |
| `Init`       | Initialize a new Git repository                      | `git-prototype init`                    |
| `AddFile`    | Stage a specific file for commit                     | `git-prototype add <file-path>`         |
| `AddAll`     | Stage all files in the current directory             | `git-prototype add .`                   |
| `Commit`     | Commit staged changes with a message                 | `git-prototype commit -m "<message>"`   |
| `Status`     | Display current status of files                      | `git-prototype status`                  |
| `Cat_File`   | Display the contents of a file                       | `git-prototype cat-file <file-path>`    |
| `HashObject` | Hash and store an object                             | `git-prototype hash-object <file-path>` |
| `LsTree`     | List the current directory tree                      | `git-prototype ls-tree`                 |
| `WriteTree`  | Write the current directory tree to the object store | `git-prototype write-tree`              |
| `Reset`      | Unstage or reset changes                             | `git-prototype reset`                   |

### Example Workflows

1. **Initialize a new repository**:

   ```bash
   git-prototype init
   ```

2. **Add a file to the staging area**:

   ```bash
   git-prototype add src/index.ts
   ```

3. **Stage all files**:

   ```bash
   git-prototype add .
   ```

4. **Commit changes with a message**:

   ```bash
   git-prototype commit -m "Initial commit"
   ```

5. **Check the status**:

   ```bash
   git-prototype status
   ```

6. **View file contents**:

   ```bash
   git-prototype cat-file src/index.ts
   ```

7. **Hash an object**:

   ```bash
   git-prototype hash-object src/index.ts
   ```

8. **Reset staged files**:
   ```bash
   git-prototype reset
   ```

## Project Structure

```
.
├── app
│ ├── git
│ │ ├── commands
│ │ │ ├── add.ts
│ │ │ ├── status.ts
│ │ │ ├── write-tree.ts
│ ├── utils
│ │ └── index.ts
├── main.ts
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore

```

### Notable Files:

- **`main.ts`**: The entry point for the command-line interface of the Git prototype.
- **`commands/`**: This directory contains implementations for Git-like commands (`add`, `status`, `commit`, etc.).
- **`utils/`**: Contains utility functions used across the commands.

## Contributing

Contributions are welcome! If you'd like to improve this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
