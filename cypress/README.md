# Automation Exercises for Airalo Website and API  

This repository contains solutions for automating website interactions and API testing for Airalo. These tasks demonstrate skills in UI and API test automation, including scripting, verifying data accuracy, and ensuring system reliability.  
---

## Overview  

This project includes two exercises:  
1. **UI Automation Test**: Automates the flow of searching for a destination on Airalo's website, selecting an eSIM package, and verifying package details in a popup.  
2. **API Automation Test**: Automates interactions with Airalo’s Partner API, including ordering eSIMs and verifying the list of eSIMs retrieved.  

### Tools and Frameworks Used 
- **Cypress**: For end-to-end UI & API test automation. 
- **Postman**: For initial API exploration.  
- **JavaScript**: For Test scripting.  
- **mochawesome**: For Test reports.  

---

## Setup Instructions  

1. Clone the repository:  
   ```bash  
   git clone <repository-url>  
   cd <repository-folder>  
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Add credentials to .env file:  
---

## Running Tests  

### UI Tests  
1. Open Cypress Test Runner:  
   ```bash  
   npx cypress open  
   ```  
2. Run the test file for UI automation.  

### API Tests  
1. Execute the API test script:  
   ```bash  
  npx cypress open 
   ```  

---

## Expected Results  

### UI Test  
- Verify that the popup contains the correct eSIM package details, including title, coverage, data, validity, and price.  

### API Test  
1. **POST Order**: The response should confirm the successful creation of six eSIMs with the specified package slug.  
2. **GET List**: The response should contain six eSIMs, each matching the "merhaba-7days-1gb" package slug.  

---