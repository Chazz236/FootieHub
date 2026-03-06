<div align="center">

# FootieHub

### Advanced Analytics for Grassroots Football

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=flat&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

**A high-performance Next.js application built to transform recreational soccer data into player and team insights.**

---

</div>

## Why I Built This

In recreational soccer, teams change every week. Without a formal league structure, individual contributions often go unrecorded, and "who makes the team better" remains a matter of opinion. 

I built **FootieHub** to bridge the gap between casual play and professional-grade analytics. I wanted to move beyond simple win/loss records to uncover the **hidden dynamics** of the pitch:
* **Teammate Synergy:** Identifying which combinations of players yield the highest goal contributions.
* **Performance Trends:** Visualizing personal growth and "market value" over time.
* **Data Integrity:** Building a reliable system to track goals, assists, and clean sheets across ever-changing team rosters.

This project was a deep dive into **relational data modeling** and **interactive data visualization**, ensuring that every match outcome and scoring contribution is captured as actionable, structured data.

---

## Screenshots

| Homepage |
|-----------|
| ![Screenshot of the Homepage](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Home.PNG) |

| Players | Individual Player |
|-------|-----------|
| ![Screenshot of the sortable Players Table](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Players.PNG) | ![Screenshot of the sortable Players Table](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Individual%20Player.png) |

| Compare | Teammate Performance |
|----------|--------------|
| ![Screenshot of the Player Comparison Tool](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Compare.PNG) | ![Screenshot of the Teammate Performance Page](https://raw.githubusercontent.com/Chazz236/FootieHub/main/footiehub/_assets/Teammate%20Dynamics.PNG) |

---

## Skills Demonstrated

| Domain | Technologies & Concepts |
|--------|-------------------------|
| **Frontend** | React 19, Next.js 15, Client/Server Components, Tailwind CSS |
| **Data Visualization** | Chart.js, Interactive Event Handling, Time-Series Visualization |
| **Backend & Logic** | Node.js, Server-Side Rendering, Error Handling, Data Access Object Pattern |
| **Database** | MySQL, Relational Schema Design, Many-to-Many Relationships, Data Aggregation |

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Performance Analytics
- Real-time G/A & Win% aggregation
- "All-Time" vs. Seasonal filtering
- Automated clean sheet attribution
- Dynamic doughnut chart snapshots

### Player & Match Management
- Dynamic Next.js URL routing
- Global player & match directories
- Responsive CRUD entry
- Multi-year data archiving

</td>
<td width="50%" valign="top">

### Player Comparison Tool
- 3-player side-by-side benchmarking
- Dynamic best-stat highlighting
- Comparative market value trends

### Teammate Synergy Tracking
- Relational scorer-assister mapping
- Success-correlation scatter plots
- Assist distribution analytics
- Multi-factor teammate ranking

</td>
</tr>
</table>

---

## Installation & Setup

To get a local copy of this project up and running, follow these steps.

### Prerequisites

* **Node.js** and **npm** installed on your machine.
* A running **MySQL** instance. The database tables must be created manually before proceeding, as this project does not include a migration script.

### Database Setup

You must first create the following tables with the exact schemas in your MySQL database.

#### `players`
| Field             | Type                | Null | Key | Default           | Extra                     |
| :---------------- | :------------------ | :--- | :-- | :---------------- | :------------------------ |
| `id`              | `INT`               | NO   | PRI | NULL              | `auto_increment`          |
| `name`            | `VARCHAR(100)`      | NO   |     |                   |                           |
| `value`           | `BIGINT`            | NO   |     |                   |                           |
| `createdAt`       | `TIMESTAMP`         | NO   |     | `CURRENT_TIMESTAMP` |                           |
| `updatedAt`       | `TIMESTAMP`         | NO   |     | `CURRENT_TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` |

#### `matches`
| Field        | Type     | Null | Key | Default | Extra          |
| :----------- | :------- | :--- | :-- | :------ | :------------- |
| `id`         | `INT`    | NO   | PRI | NULL    | auto_increment |
| `date`       | `DATE`   | NO   |     |        |                |
| `home_score` | `INT`    | NO   |     |        |                |
| `away_score` | `INT`    | NO   |     |        |                |

#### `player_performance`
| Field        | Type                  | Null | Key | Default | Extra |
| :----------- | :-------------------- | :--- | :-- | :------ | :---- |
| `player_id`  | `INT`                 | NO   | PRI |        |       |
| `match_id`   | `INT`                 | NO   | PRI |        |       |
| `team`       | `ENUM('home','away')` | NO   |     |        |       |
| `goals`      | `INT`                 | NO   |     |        |       |
| `assists`    | `INT`                 | NO   |     |        |       |
| `value_change` | `BIGINT`            | NO   |     |        |       |

#### `goal_contributions`
| Field            | Type         | Null | Key | Default | Extra          |
| :--------------- | :----------- | :--- | :-- | :------ | :------------- |
| `id`             | `INT`        | NO   | PRI | NULL    | auto_increment |
| `match_id`       | `INT`        | NO   | MUL |        |                |
| `goal_scorer_id` | `INT`        | YES  | MUL | NULL    |                |
| `assist_player_id` | `INT`      | YES  | MUL | NULL    |                |

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

---

## Project Structure

```
FootieHub/
├── README.md
│
├── src/app/
│   ├── addMatch/            # Add match to db
│   ├── addPlayer/           # Add player to db
│   ├── compare/             # Compare player stats
│   ├── teammate/            # Synergy & contribution analysis
│   ├── matches/             # View all matches or by year
│   │   ├── [id]/            # View individual match details
│   ├── players/             # View all players and stats
│   │   ├── [id]/            # View individual player details
│   └── components/          # Reusable UI cards and charts
│
├── src/lib/              
│   ├── actions/             # Adding matches and players
│   └── data/                # Server-side data fetching & processing
│
├── src/db/
│   ├── matches.js           # Transactional match logging    
│   ├── mysql.js             # Core database connection pool with Promises
│   ├── players.js           # Transactional player logging
│   ├── stats.js             # Aggregations for Win% and G/A
│   └── teammates.js         # Relational mapping for assister-scorer pairs
│   └── transferValues.js    # Historical market value trend queries
│
├── public/                  # Asset directory (match event icons)
└── _assets/                 # Documentation assets (README, screenshots)
```

---

## What I Learned

### Modern Web Engineering
- Building a server-first application with **Next.js 15** and **React 19**
- Implementing **Server Actions** to handle complex data mutations and state transitions
- Orchestrating **atomic database updates** across multiple tables using **Node.js Promises**
- Securing sensitive database credentials through **Environment Variable** management
- Designing a **Data Access Object pattern** to decouple SQL from backend

### Data Architecture & Logic
- Architecting a **relational MySQL schema** for complex scorer-assister synergies
- Developing a **custom valuation algorithm** to calculate dynamic market fluctuations
- Implementing **advanced SQL JOINs** for multi-year stat aggregation and filtering
- Managing **connection pooling** with **mysql2** for high-performance data retrieval

### UI/UX & Data Visualization
- Visualizing high-density sports analytics with **Chart.js**
- Implementing **dynamic routes** for individual player and match profiles
- Optimizing **layout composition** for data-heavy tables and statistics grids
