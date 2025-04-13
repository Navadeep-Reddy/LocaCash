# LocaCash - ATM Placement Optimization Platform

LocaCash is an intelligent decision support system that helps financial institutions optimize the placement of ATMs using data-driven analytics. By analyzing multiple critical factors including population density, competing ATMs, commercial activity, and land rates, LocaCash identifies strategic locations with the highest potential for ATM success.

![LocaCash Homepage](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/LocaCashScreenShots/Home.png)  
<p align="center">
  Modern interface 
</p>

![Analysis Tool](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/LocaCashScreenShots/Location_Analysis.png)  
<p align="center">
  Interactive location analysis with customizable weights
</p>

![Portfolio Optimization](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/LocaCashScreenShots/Knapsack_Optimization.png)  
<p align="center">
  Knapsack ATM portfolio optimization within budget constraints
</p>

![Visualisation](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/LocaCashScreenShots/Visualisation.png)  
<p align="center">
  Interactive charts of your portfolio
</p>

![Report Generation](https://github.com/Navadeep-Reddy/ProjectScreenshots-/blob/main/LocaCashScreenShots/Report_Generation.png)  
<p align="center">
  Automatic report generation
</p>



## Key Features

- **Location Analysis**: Interactive map interface to analyze any location's ATM viability
- **Multi-Factor Scoring**: Comprehensive evaluation using 6 critical location factors:
  - Population Density
  - Competing ATMs
  - Commercial Activity
  - Traffic Flow
  - Public Transport Accessibility
  - Land Rate
- **Customizable Weights**: Adjust the importance of each factor based on business priorities
- **Portfolio Optimization**: Maximize ATM network effectiveness within budget constraints using knapsack algorithm
- **Investment Reports**: Generate detailed PDF reports for stakeholders with visualizations
- **Account System**: Secure user authentication with Supabase (email and Google OAuth)
- **Data Visualization**: Interactive charts showing cost-benefit analysis of ATM investments
- **Spatial Data Caching**: B+ tree implementation for efficient geospatial data storage and rapid retrieval

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Maps & Geospatial**: Leaflet Maps for interactive location selection
- **Visualization**: Recharts for data visualization and analytics
- **Backend**: Python Flask API for location analysis and scoring calculations
- **Authentication & Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF for investment report generation
- **Data Structures**: B+ trees for optimized location data caching and retrieval and 0/1 Knapsack to optimize portfolios according to budget
- **Geospatial Algorithms**: Custom implementation of spatial indexing for rapid location lookups

## Architecture

The project follows a client-server architecture:
- **Client**: React-based SPA with responsive UI and interactive components
- **Server**: Flask API with RESTful endpoints for data processing and analysis
- **Database**: Supabase PostgreSQL with Row Level Security for storing user data and analyses
- **Caching Layer**: In-memory B+ tree for efficient spatial data storage and retrieval
- **Performance Optimization**: Two-tier caching system with memory and disk-based persistence

## Performance Optimizations

### B+ Tree Spatial Caching
LocaCash implements a specialized B+ tree structure for efficient spatial data storage and retrieval:

- **Geohash-Based Indexing**: Locations are indexed using geohash prefixes for efficient spatial lookups
- **Optimized I/O Operations**: Minimizes API calls by storing frequently accessed location data
- **LRU Cache Eviction Policy**: Intelligently manages memory usage based on access patterns
- **Disk Persistence**: Cached data is periodically saved to disk to maintain performance across restarts
- **Cache Invalidation**: Time-based invalidation ensures data freshness while maximizing performance

This implementation provides:
- 95% reduction in API calls for previously analyzed locations
- Sub-millisecond retrieval times for cached locations
- Efficient spatial range queries for nearby location analysis

## Steps to Run

### Server Setup

1. Navigate to the server directory:
```bash
cd LocaCash/server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (create a .env file in the server directory):
```
FLASK_SECRET_KEY=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

4. Start the Flask server:
```bash
python run.py
```
The server will run on http://localhost:8080

### Client Setup

1. Navigate to the client directory:
```bash
cd LocaCash/client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create a .env file in the client directory):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```
The client will be available at http://localhost:5173

## How It Works

1. **Location Selection**: Choose any location on the interactive map
2. **Analysis**: The system evaluates the location based on multiple factors
3. **Customization**: Adjust factor weights to match your business priorities
4. **Results**: Review the comprehensive score and factor breakdown
5. **Portfolio Optimization**: Input your budget constraints and let the system optimize your ATM network
6. **Report Generation**: Generate professional reports for stakeholders

## API Endpoints

### ATM Analysis
- `POST /analysis/v1/analyze`: Analyzes a location for ATM placement viability
- `POST /analysis/v1/save`: Saves analysis results to the user's account
- `GET /analysis/v1/user-analyses/{user_id}`: Retrieves a user's saved analyses
- `GET /analysis/v1/cache-status`: Returns statistics about the B+ tree cache performance

## Data Science Methodology

LocaCash uses a weighted scoring system combined with the knapsack algorithm for portfolio optimization:

1. **Factor Scoring**: Each location factor is evaluated and scored on a scale of 0-100
2. **Weighted Average**: Factors are combined using customizable weights to create an overall viability score
3. **Efficiency Calculation**: Locations are ranked by their score-to-cost ratio
4. **Knapsack Optimization**: The optimal mix of ATM locations is determined based on budget constraints
5. **Spatial Pattern Analysis**: Identifies clusters and patterns in successful ATM placements

## Future Enhancements
- Time-series analysis of ATM performance over time
- Competitor movement prediction
- Mobile application for field surveys
- Machine learning models for automated weight optimization
- Integration with banking transaction data for better demand prediction
- Distributed cache synchronization for multi-server deployments
- Real-time collaborative analysis sessions

## License
This project is licensed under the MIT License - see the LICENSE file for details.