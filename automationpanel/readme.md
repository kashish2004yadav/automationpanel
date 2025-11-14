# Project: Dynamic Dashboard & Task Automation Panel

## Overview

This project is a fully responsive, dynamic admin dashboard built with pure HTML, CSS, and Vanilla JavaScript. It features reusable UI components, real-time API data integration, local storage state management, and a task automation panel.

### Core Features

* **Responsive Layout:** Collapsible sidebar, top navbar, and main content area.
* **API Integration:** Fetches user data from `jsonplaceholder.typicode.com`.
* **API Features:** Includes live search, A-Z/Z-A sorting, and pagination.
* **Task Automation:** Full CRUD (Create, Read, Update, Delete) for tasks.
* **State Management:** Saves tasks and the UI theme (Light/Dark) to LocalStorage.
* **Advanced JS:** Includes custom toast notifications, a reusable modal, and pure JS form validation.

## Challenges Faced

*(Example)*
One challenge was managing the state for the API data (search, sort, and pagination simultaneously). I solved this by creating a single `displayUsers()` function that takes all state parameters (page, sort, query) and derives the view from the master `allUsers` array. This ensures all features work together.

## Potential Improvements

*(Example)*
* Refactor the JavaScript into modules (e.g., `api.js`, `tasks.js`, `ui.js`).
* Add more complex filtering to the Task panel (e.g., filter by upcoming deadline).
* Replace the CSS-based chart with a library like Chart.js for real data visualization.