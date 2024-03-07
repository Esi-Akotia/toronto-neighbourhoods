# Toronto Neighbourhoods Project

## Project Proposal

### Summary: 

This project is examining data from the City of Toronto to identify key attributes of neighbourhoods / municipalities. The goal of the project is to assist families with young children to make a decision on what will be the most ideal location for them to live / raise children based on these variables:
School accessibility, type, and location
Types of parks & recreation facilities
Neighbourhood crime rates

Project outcomes: 

Conduct exploratory analysis of the attributes above to gain a clear understanding of the layout of each municipality
Create an overlay map / multiple maps of the Toronto neighbourhoods to show these 3 variables with dropdown menus that update the map based on the 3 factors

### Questions to answer:

Exploratory
- How are crime rates changing over the years in the neighbourhoods from 2014 to 2023?
- What can we learn about people’s hobbies by looking at the amenities?
- How many different types of schools are in the municipalities?

Mapping
- Which areas/neighborhoods are the best for families with young children to live based on these metrics?:
- Crime rate
- School type: Public vs Private, other variances?
- Parks & recreation - amenities

Data Sources:

- School locations - https://open.toronto.ca/dataset/school-locations-all-types/
- Parks & Recreation Facilities - https://open.toronto.ca/dataset/parks-and-recreation-facilities/
- Neighbourhood Crime Rates - https://open.toronto.ca/dataset/neighbourhood-crime-rates/


## User Guide

- Install necessary packages: pymongo, flask, json, bson
- Open closed loop folder in VS Code or other IDEs
- Run the app.py file - ensure the index.html, the logic.js, and the style.css files are all in the respective folders
- Create a config.py file and enter your URL to access the MongoDB database (request permission from owner)
- Navigate the web page on your local host