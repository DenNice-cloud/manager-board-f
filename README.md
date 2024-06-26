# Manager board

## Technologies used
- **React:** Used to build the user interface and manage component states.
- **Axios:** Processes HTTP requests to interact with the backend API.
- **React Beautiful DND:** Implements the drag-and-drop function for managing tasks.
- **Tailwind CSS:** Provides utility CSS for quick styling and responsiveness.

## Frontend
### Components
- **TodoList.js:** Displays tasks grouped by columns of their status ("In progress", "In progress", "Completed"). 
Allows you to filter tasks by title and supports adding new tasks, updating existing ones, and deleting tasks.
When adding and updating a task, the title and description fields must be filled in.
- **TodoItem.js:** Represents each individual task item, allowing users to edit its name and description in real time. It also handles drag and drop operations, using react-beautiful-dnd to rearrange tasks between columns.

**Link to backend part** - https://github.com/DenNice-cloud/task-manager-board

## Setup Instructions
To run this project locally, follow these steps:

Node.js Version
- v16.20.2

Clone the repository:
```sh
git clone https://github.com/DenNice-cloud/manager-board-f.git
cd manager-board-f
```

Install dependencies:
```sh
npm install
```

Start the frontend development server:
```sh
npm start
```

Open your browser and navigate to http://localhost:3000 to view the application
