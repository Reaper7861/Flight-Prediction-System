# Files Included in the Repository: 
- Flight Prediction.ipynb
- Flight Prediction System Final Report.pdf
- Final Poster.pptx
- flight_data_preprocessed.csv.zip
- flight_data.zip
- sky-price-prediction-main
- README.md

## Flight Prediction.ipynb: 

This includes all the python code related to the data science project we have done over the basic flight prediction system. Each section of the notebook has a heading on what the code below it pertains to. 

Each cell has been commented to inform about its function. 

The first cell contains all the libraries that are used within the notebook. 
For ease of use, it is better to start the program from the **Start** heading as it will take in the preprocessed data which is already included in this repository and the code following it will be the bulk of the project. Everything before the **Start** heading deals with preprocessing the dataset. 

*Note:* The last cell downloads the best model via the pickle library and has not been included in this repository as it is too big. The pickle file including the model must be downloaded manually to your computer by running the cell. 

## Data Science 2 Final Report.pdf

This is the pdf file containing the final comprehensive report of our project.

## Final Poster.pptx

This is the PowerPoint containing the poster of our project. 

## flight_data_preprocessed.csv

This is the zip file containing the cleaned data after preprocessing and data cleaning. Zipped as a file. 

## flight_data.zip

This is the full dataset from which we based our project on. It has been included as a reference to the repository. Zipped as a file. 

## sky-price-prediction-main

This includes all the relevant files and code for the web application we have created for our project. 

To run the project: 

1. 

Run and download the pickle model (last cell). Move this .pkl file into the server directory contained within sky-price-prediction-main.

2. 
You need 2 terminals open. One will run the frontend and the other will run the server. Run the commands below in the terminal. 

3. 
**First Terminal:**

`cd sky-price-prediction-main` - copy this command to go to the frontend directory

`npm i` - copy and paste this to install dependencies

`npm run dev` - copy this command to run the frontend

4. 
**Second Terminal:**

`cd sky-price-prediction-main` - copy this command to go to the frontend directory

`cd server` - copy this command to go to the server directory

`npm i `- copy and paste this to install dependencies

`npm run dev` - copy this command to run the server

5. 

Click on Local:   http://localhost:8080/ in the terminal

(Running in the frontend terminal)

6. 

A web page will open up in your browser where you can input details of your flight and get a predicted price.

## README.md

Current file containing information about the contents and functions of this repository. 



