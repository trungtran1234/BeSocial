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
   - Hostname: socialdb.ct26ske6krnv.us-west-1.rds.amazonaws.com
   - Port: 3306
   - Username: admin
   - Pass: adminpass
4. Clone this repository in a new directory (git clone)
5. Create .env folder inside BeSocial directory. Include the following text inside that folder. <br>
   DB_HOST=socialdb.ct26ske6krnv.us-west-1.rds.amazonaws.com <br>
   DB_USER=admin <br>
   DB_PASSWORD=adminpass <br>
   DB_NAME=db <br>
   SECRET_KEY=x3TJwulwI9 <br>
6. Go to BeSocial/backend and type "npm i"
7. Go to BeSocial/frontend and type "npm i"
8. Create two seperate terminal windows within BeSocial and type these commands in the following directories.
   - BeSocial/backend : npm run dev
   - BeSocial/frontend : npm start
9. View the application from an internet browser using the URL: http://localhost:3000/

# Division of Work
## Ryan Ogrey:
* Implemented the frontend HTML/CSS styling for all aspects of the application.
* Made all text input boxes and page elements dynamic to large inputs and many database entries.
* Created the signup and login pages.
* Sorted the events on all pages by date, moving those with potential errors (designated by NULL) to the back.
* Wrote the README.
* Helped brainstorm details for presentation slides.
* Formatted Final Report document and created table of contents.
* 
## Tri Nguyen:
* Helped brainstorm details for presentation slides.
* Wrote ER diagram
## Trung Tran:
* Created event creation form, event object, and event SQL table
* Created event wall for following users' events
* Created user profile with following feature along with following and follower list
* Created bookmark feature for events
* Created event details page
* Created event comment section and like feature
* Helped brainstorm details for presentation slides.
## Sai Manaswini Avadhanam:
* Designed the Logo for the application
* Sourced images to be used for various buttons and backgrounds on the frontend
* Designed and wrote all presentation slides.
* Presented the slide portion of the presentation.
* 
## Ashton Headley:
* Worked on event_category: created the table on MySQL and helped write backend code to link it to the event_form.
* Set up presentation slides.
* Helped brainstorm details for presentation slides.
* 
