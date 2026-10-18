# StudyMate — Interactive To-Do List App

## Student Information
- **Student Name:** Emerance Himbazwe
- **Project:** Interactive To-Do List App
- **Course:** Advanced Frontend Web Development

## Project Description
StudyMate is an interactive to-do list application that helps students organize and track their daily tasks. It is built using HTML, Tailwind CSS v4, JavaScript, and Vite.

## Project Links
- **GitHub Repository:** https://github.com/emerancehimbazwe/week4-todo-app-3.
- **Live Application:** https://emerancehimbazwe.github.io/week4-todo-app-3./
- **Demo Video:** Add your 3–5 minute video link here.

## Features
- Add tasks using the form or Enter key.
- Validate task input and display error messages.
- Mark tasks as completed or active.
- Edit tasks using Enter to save and Escape to cancel.
- Delete tasks with confirmation.
- Filter tasks by All, Active, and Completed.
- Display the number of remaining tasks.
- Clear completed tasks.
- Save tasks and selected filters in localStorage.
- Display a friendly empty state.
- Responsive design for mobile and desktop screens.

## Extra Features
- **Dark Mode:** Users can switch between light and dark themes. The selected theme is saved in localStorage.
- **Progress Bar:** Displays the percentage of completed tasks.

## Example User Story
As a student, I want to add, edit, complete, and delete tasks so that I can organize my schoolwork and monitor my progress.

## Example Application State

Example tasks stored in the application's state:

- Task 1: Study PL/SQL — Active
- Task 2: Practice JavaScript — Completed

The tasks array is the application's state. When the state changes, the `render()` function updates the displayed task list.

## Screenshots

### Desktop View
Insert your desktop screenshot here.

### Mobile View
Insert your mobile screenshot here.

## Challenges and Lessons Learned
During this project, I learned how to use JavaScript to manage an application's state and update the user interface. I practiced event handling, event delegation, and array methods to manage tasks. I learned how to use localStorage to preserve tasks, filters, and theme preferences after refreshing the page. I also learned to validate user input and display helpful error messages. I used browser DevTools to inspect JavaScript behavior and debug problems during testing. Finally, I learned to make a responsive interface using Tailwind CSS and to display task text safely using `textContent`.

Before submitting, make sure the sentence about debugging reflects a problem you actually investigated and fixed.

## How to Run Locally

1. Install Node.js.
2. Clone this repository.
3. Open the project folder in a terminal.
4. Install dependencies by running `npm install`.
5. Start the development server by running `npm run dev`.
6. Open the local URL displayed in the terminal.
7. To create a production build, run `npm run build`.
