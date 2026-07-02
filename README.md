# Swiggy Data Analytics & 3D Dashboard

An interactive, feature-rich web dashboard designed to visualize and analyze Swiggy restaurant data. This project combines immersive 3D graphics, real-time data filtering, dynamic charting, and an AI-powered chat assistant into a modern, glassmorphic UI.

## 🚀 Key Features

*   **Interactive Data Visualizations:** Utilizes Chart.js to render dynamically updated charts, including top cities (bar chart), cuisine distribution (doughnut chart), rating histograms, cost vs. rating scatter plots, average cost trends, and delivery time radar charts.
*   **Immersive 3D Experience:** Powered by Three.js, the UI features a rotating 3D delivery box surrounded by floating food orbs and an interactive, mouse-responsive particle background.
*   **AI Insights & Chat Assistant:** Includes an automated insights generator highlighting metrics like fast-delivery satisfaction and premium restaurant revenue. A floating chat assistant helps users query top-rated restaurants, best cities, and cuisine recommendations.
*   **Predictive Analytics Mockup:** An ML-style heuristic prediction tool calculates estimated popularity, revenue, orders, and success rates based on user-adjusted sliders for rating, votes, cost, and delivery time.
*   **Dynamic Filtering & Data Table:** Users can filter the dataset by city, cuisine, minimum rating, and maximum cost. The data is displayed in a sortable, paginated table with an option to export the filtered results as a CSV file.
*   **Modern UI/UX:** Features a glassmorphism design with a custom cursor glow, 3D tilt effects on cards, scroll animations via AOS, and a toggleable dark/light theme. The design is fully responsive across desktop and mobile devices.

---

## 🛠️ Tech Stack

*   **Frontend Vanilla:** HTML5, CSS3, JavaScript (ES6)
*   **Data Parsing:** PapaParse (for handling CSV data)
*   **Visualizations:** Chart.js
*   **3D Graphics:** Three.js
*   **Animations:** AOS (Animate On Scroll), custom CSS keyframes

---

## 📂 Dataset Details

The dashboard relies on a local dataset named **swiggy.csv**. The application parses this file on load, extracting and cleaning essential columns to power the dashboard:
*   `ID`, `Restaurant`, `City`, `Area`, `Address`
*   `Price` (Cost)
*   `Avg ratings` & `Total ratings` (Votes)
*   `Food type` (Parsed into primary and multiple cuisines)
*   `Delivery time`

*Note: Ensure the dataset is located in the `data/` directory for the application to fetch it correctly.*

---

## ⚙️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/swiggy-3d-dashboard.git](https://github.com/yourusername/swiggy-3d-dashboard.git)
    cd swiggy-3d-dashboard
    ```
2.  **Add the dataset:**
    Ensure the file **swiggy.csv** is placed inside a `data/` folder at the root of the project.
3.  **Run a local server:**
    Because the project uses Javascript to fetch a local CSV file, opening the HTML file directly in the browser may cause CORS errors. Use a local server to run the app:
    *   *Using Python:* `python -m http.server 8000`
    *   *Using Node.js:* `npx serve`
    *   *Using VS Code:* Install and click "Live Server".
4.  **View the app:** Open your browser and navigate to `http://localhost:8000`.

---

## 📁 File Structure Overview

*   **`data.js`**: Handles the loading and cleaning of the **swiggy.csv** dataset using PapaParse.
*   **`dashboard.js`**: Manages the KPI counters, filter logic, table pagination, and CSV export functionality.
*   **`charts.js`**: Configures and updates all Chart.js visualizations based on current data filters.
*   **`ai.js`**: Contains the logic for the automated insights, the heuristic prediction model, and the chatbot interface.
*   **`three-scene.js`**: Sets up the Three.js WebGL renderers for the background particles and the hero section's 3D elements.
*   **`main.js`**: Initializes global interactions like the loading screen, theme toggling, cursor tracking, and 3D card tilt effects.
*   **Stylesheets**: Custom CSS utilizing CSS variables for theme management, responsive media queries, and layout formatting.
