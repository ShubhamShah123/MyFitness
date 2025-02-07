# MyFitness

## Overview
**MyFitness** is a React Native application designed to help users efficiently manage their fitness journey. The app offers a structured approach to tracking workouts, nutrition, weight, and progress over time. Users can also start workout sessions and log their daily activities.

## Features
The application consists of five main pages:

### 1. Workout Schedule
- Displays the workout schedule on a day-wise basis.
- Helps users stay consistent with their fitness plan.

### 2. Nutrition
- Provides meal plans for different times of the day:
  - **Pre-workout**
  - **Breakfast**
  - **Lunch**
  - **Snack**
  - **Dinner**
- Incorporates **high-carb** and **low-carb** days:
  - **Low-carb days:** Monday, Tuesday, Wednesday.
  - **High-carb days:** Thursday, Friday, Saturday.
  - **Rest day:** Sunday (off day).

### 3. WeightMeasure
- Allows users to track their weight and measurements.
- Keeps a record of meals consumed.

### 4. StartSession
- Starts a session timer for the day.
- Users can tick checkboxes for completed workouts.
- Provides an option to upload workout progress to a database.

### 5. History
- Displays all recorded details for each day.
- Users can review their past workout and nutrition logs.

## Technologies Used
- **React Native** for cross-platform mobile development.
- **Redux (Optional)** for state management.
- **Firebase/MongoDB** for data storage and retrieval.
- **Async Storage** for local data caching.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MyFitness.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MyFitness
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Run the application:
   ```bash
   npx react-native run-android  # For Android
   npx react-native run-ios      # For iOS (requires macOS)
   ```

## Future Enhancements
- Creating a user profile.
- Making a more indepth dashboard for the user which can allow them to modify or create thier workout schedule and dietry preferences.

## License
This project is licensed under the MIT License.


