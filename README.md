# NeonGenesis Game

**NeonGenesis** is a futuristic strategy game that leverages AWS services for state management and asset storage. The game offers a sleek and interactive user interface where players can engage with strategic maps, manage units, complete quests, and more.

![NeonGenesis Screenshot](./Screenshot%202025-01-15%20024425.png)

---

## Features

- **Strategic Map**: Players can navigate and interact with a grid-based map to manage their resources and progress.
- **Real-Time Notifications**: Game updates and events are displayed in real-time.
- **AWS Integration**:
  - **DynamoDB** for saving and loading game states.
  - **S3** for storing and retrieving game assets.
- **Fallback Mechanisms**:
  - LocalStorage is used as a fallback when AWS services are unavailable.

---

## Technology Stack

- **Frontend**: Modern web technologies for a responsive and immersive UI.
- **Backend**:
  - **AWS SDK** for DynamoDB and S3 integrations.
  - Fallback storage with `localStorage`.

---

## AWS Services Used

1. **DynamoDB**:
   - Stores user game states with a timestamp.
   - Ensures seamless progress saving and retrieval.
2. **S3**:
   - Hosts game assets for fast and reliable delivery.
   - Fallback to local assets when S3 is unreachable.

---

## Setup and Configuration

### Prerequisites

- Node.js installed.
- AWS credentials with access to DynamoDB and S3.
- An S3 bucket for storing assets.
- A DynamoDB table named `NeonGenesisGameState`.

### Steps to Set Up the Repository Locally

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     VITE_AWS_REGION=your-aws-region
     VITE_AWS_ACCESS_KEY_ID=your-access-key-id
     VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser at `http://localhost:3000`.

---

## How It Works

### DynamoDB Integration

- **Save Game State**:
  - Saves the user's game state in the `NeonGenesisGameState` table.
  - Includes fallback to `localStorage` if DynamoDB is unavailable.

- **Load Game State**:
  - Retrieves the saved game state from DynamoDB.
  - Uses `localStorage` as a fallback mechanism.

### S3 Integration

- Retrieves game assets from the `neogenesis-assets` bucket.
- Fallback to local `/assets` directory when S3 is unreachable.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork.
4. Open a pull request.

---

## License

This project is licensed under the [MIT License](./LICENSE).
