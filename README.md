# BeSocial - CS-157A Final Project

## Team Members:
Ryan Ogrey, 
Tri Nguyen, 
Trung Tran, 
Sai Manaswini Avadhanam, 
Ashton Headley,

# Setup Instructions
1. Install Node.js
   - Download at: https://nodejs.org/en/download/
   - For linux users (Ubuntu): sudo apt install nodejs
2. Install git
3. Download MySQL
3. Setup Database with MySQL by creating a new connection in MySQL Workbench with the following details
   - Hostname: <Your_Hostname>
   - Port: <Your_Port>
   - Username: <Your_Username>
   - Pass: <Your_password>
4. Clone this repository in a new directory (git clone)
5. Create .env folder inside BeSocial directory. Include the following text inside that folder. <br>
   DB_HOST=<Your_Hostname> <br>
   DB_USER=<Your_username> <br>
   DB_PASSWORD=<Your_password> <br>
   DB_NAME=<Your_Schema> <br>
   SECRET_KEY=<Your_secret> <br>
6. Go to BeSocial/backend and type "npm i"
7. Go to BeSocial/frontend and type "npm i"
8. Create two seperate terminal windows within BeSocial and type these commands in the following directories.
   - BeSocial/backend : npm run dev
   - BeSocial/frontend : npm start
9. View the application from an internet browser using the URL: http://localhost:3000/

Copies of the SQL Tables and Meeting Minutes are located in a folder in the BeSocial directory. 

# Division of Work
## Ryan Ogrey:
* Implemented the frontend HTML/CSS styling for all aspects of the application.
* Made all text input boxes and page elements dynamic to large inputs and many database entries.
* Created the signup and login pages.
* Sorted the events on all pages by date, moving those with potential errors (designated by NULL) to the back.
* Wrote the README.
* Helped brainstorm details for presentation slides.
## Tri Nguyen:
* Helped brainstorm details for presentation slides.
* Draw the ER diagram
* Record the demo
* Implemented the user log out
* Implemented the hash indexing method for events and users table
* Created and implemented the endpoint for events to fetch guest list (list of attending users)
* Created the UserWall.js (Event Hosted page) 
* Created the EventFollowing.js (Event Attended page)
* Created and implemented the endpoint for the Event Hosted Page to fetch user's hosting events
* Created and implemented the endpoint to enable users to delete hosted events in the Event Hosted page
* Created and implemented the endpoints to enable users to attend events and unattend events
* Created and implemented the endpoint to enable the Event Attending page to fetch events users are attending
* Add to the eventItem component with attend, delelete, and guestList feature
## Trung Tran:
* Intialized the environment
* Created and implement the endpoint for user registering and user login
* Implment the authentication system for user login
* Created event creation form, event object, and event SQL table
* Created event wall for following users' events
* Created user profile with following feature along with following and follower list
* Created Book mark page as well as endpoints for user to book mark events
* Created event details page
* Created event comment section and like feature
* Helped brainstorm details for presentation slides.
## Sai Manaswini Avadhanam:
* Designed the Logo for the application
* Sourced images to be used for various buttons and backgrounds on the frontend
* Designed and wrote all presentation slides.
* Presented the slide portion of the presentation.
## Ashton Headley:
* Worked on event_category: created the table on MySQL and helped write backend code to link it to the event_form.
* Set up presentation slides.
* Helped brainstorm details for presentation slides.

## Details on division of final report work are present within the report document itself.
