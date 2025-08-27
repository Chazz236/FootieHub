# FootieHub

A Next.js application designed to track and analyze player performance data from recreational soccer games. It provides detailed statistics and insights, allowing players to better understand individual performance and how they perform with different teammates on the pitch.

## 💻 Built With

* **Next.js**: The React framework used for server-side rendering and routing
* **React**: The core JavaScript library for building the user interface
* **Tailwind CSS**: A utility-first CSS framework used for styling and responsive design
* **MySQL**: The relational database used to store player and match data
* **Chart.js**: A powerful charting library for creating dynamic and interactive data visualizations

## ✨ Features

* **Player and Match Management**: Users can add new players and matches, logging information for each game
* **Dynamic Player & Match Pages**: Each player and match has a unique, dynamically generated URL, offering a dedicated page for in-depth statistics
* **Interactive Player Table**: View players in a sortable table with key statistics, allowing for quick data overview and organization
* **Match Overview**: A dedicated page provides an overview of every recorded match
* **Player-Centric Analytics**: Explore individual player pages that display detailed statistics, charts, and graphs
* **Comprehensive Teammate Performance Analysis**: A unique feature that includes a chart displaying assists received vs. assists provided, and a sortable table highlighting the best teammates based on win percentage or goal contributions
* **Player Comparison Tool**: Compare detailed statistics and trends for 2-3 players side-by-side on a dedicated page

## 🛠️ Installation & Setup

To get a local copy of this project up and running, follow these steps.

### Prerequisites

* **Node.js** and **npm** installed on your machine.
* A running **MySQL** instance. The database tables must be created manually before proceeding, as this project does not include a migration script.

### Database Setup

You must first create the following tables with the exact schemas in your MySQL database.

#### `players`
| Field      | Type         | Null | Key | Extra          |
| :--------- | :----------- | :--- | :-- | :------------- |
| `id`       | `INT`        | NO   | PRI | auto_increment |
| `name`     | `VARCHAR(100)` | NO   |     |                |
| `value`    | `BIGINT`     | NO   |     |                |

#### `matches`
| Field        | Type     | Null | Key | Extra          |
| :----------- | :------- | :--- | :-- | :------------- |
| `id`         | `INT`    | NO   | PRI | auto_increment |
| `date`       | `DATE`   | NO   |     |                |
| `home_score` | `INT`    | NO   |     |                |
| `away_score` | `INT`    | NO   |     |                |

#### `player_performance`
| Field        | Type                  | Null | Key | Extra |
| :----------- | :-------------------- | :--- | :-- | :---- |
| `player_id`  | `INT`                 | NO   | PRI |       |
| `match_id`   | `INT`                 | NO   | PRI |       |
| `team`       | `ENUM('home','away')` | NO   |     |       |
| `goals`      | `INT`                 | NO   |     |       |
| `assists`    | `INT`                 | NO   |     |       |
| `value_change` | `BIGINT`            | NO   |     |       |

#### `goal_contributions`
| Field            | Type         | Null | Key | Extra          |
| :--------------- | :----------- | :--- | :-- | :------------- |
| `id`             | `INT`        | NO   | PRI | auto_increment |
| `match_id`       | `INT`        | NO   | MUL |                |
| `goal_scorer_id` | `INT`        | YES  | MUL |                |
| `assist_player_id` | `INT`      | YES  | MUL |                |

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd [your-repo-name]
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create and configure your `.env` file:**
    Create a file named `.env` in the root of the project and add your database credentials:
    ```
    DB_HOST=[your_host]
    DB_USER=[your_username]
    DB_PASSWORD=[your_password]
    DB_SCHEMA=[your_database_name]
    DB_PORT=[your_port]
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📸 Screenshots

Here are a few screenshots showcasing the main pages and functionalities of the application:
* **Homepage**
    ![Screenshot of the Homepage](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Home.PNG)
    _The application's homepage, displaying important statistics and the best/worst players_

* **Players Table**
    ![Screenshot of the sortable Players Table](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Players.PNG)
    _An interactive table displaying players and basic statistics, with sorting functionality_

* **Teammate Performance**
    ![Screenshot of the Teammate Performance Page](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Teammate%20Dynamics.PNG)
    _The teammate analysis page, featuring charts to display effectiveness with teammates, and a table of top teammates_

* **Player Comparison Tool**
    ![Screenshot of the Player Comparison Tool](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Compare.PNG)
    _A dedicated page for comparing up to three players side-by-side with charts and data_
