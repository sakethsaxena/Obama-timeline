# A web application for visualizing Obama administration's social media archives
![San Jose State University](https://i.imgur.com/cShW5MA.gif?1)
![..](https://i.imgur.com/QIGOoLy.png?1)

Collaborative project for CS235 - Visualization of obama administration's social media archives
________________________________________________________________________________________________

To propogate the ideals of transparent governanace president Obama signed a memorandum to release all the social media data of the white house administration to the general public. 

The data was obtained from https://www.archives.gov/presidential-libraries/archived-websites

The data was preprocessed using Python and imported into mongodb
The web application was built using the MEANStack framework


Reducing the cognitive load of the user interface while using high quality design patterns 
was the focus of the project. 

The UI consists of three panels, the left panel consists of filters 
the right panel consists of charts to visualize contextual data and the centre panel consists of actual posts, pictures and videos displayed chronologically. The centre panel was built with the aim to be infinitely scrollable.

The project was concluded by conducting a survey where users rated the usability, aesthetics, familiarity, speed and user experience of the application and the usability, familiarity and user experience were rated highly by 80% of the users.




A screenshot of the application is shown below:

![Obama's Timeline](https://i.imgur.com/7vgHbbc.png)
________________________________________________________________________________________________
Steps to execute the code:
1. Install mongoDB and import the db.json file using the below command:
  mongoimport --db social-media --collection posts --drop --file ~/path-to-file/db.json
2. In the project directory open terminal and run -> npm install
3. Run -> npm start

Go to the browser and open url - http://localhost:3000

________________________________________________________________________________________________
