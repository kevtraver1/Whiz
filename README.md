This project was a fun way for me to learn more about cloud development.
This project makes uses AWS S3, Cognito, Lambda, DynamoDB, React Libary and python3.
Whiz
 Whiz is a clone of Waze. The app allows users to locate bathrooms near the current location,after creating authenticated accounts. User will get email to verify that email is real, and userdata is stored using AWS cognito. It allows users to add new bathrooms with comments and rating 1-10. Users can click and view all user reviews and ratings for the bathroom and can add review aswell. Whiz is built react web-app, with python backend hosted in AWS cloud.

Sign UP View
![Alt text](/assets/Signup.png?raw=true "SignUp View")
Login View
![Alt text](/assets/Login.png?raw=true "Login View")
Create New Bathroom View
![Alt text](/assets/Create_Bathroom.png?raw=true "Create New Bathroom View")
Home Map View
![Alt text](/assets/Map.png?raw=true "Home Map View")
Bathroom Review and Ratings View
![Alt text](/assets/Bathroom_Review.png?raw=true "Bathroom review View")

Reflection

This was a side project, to teach my self AWS S3, Cognito, Lambda, DynamoDB, React Libary and flask. Also i wanted to familiarizing myself with documentation of AWS. I started this by using create-react-app boilder plate and  some of the key aws services to teach my self how to architect and develop in the cloud. This was something that always seemed interesting to me. I learned how usefull lambda is, how to use a nosql database, and basic of react, this is why i chose a simple conecpt for this project. I did encounter some unforseen obstlces along the way. One of the main challenges I ran into was Authentication. This lead me to spend a few days on a research spike into OAuth, Auth0, and finaly i found that AWS has cognito which helped me handle this challege. Near the end i realized that the navigator.geolocation does not always work and if i ever come back to this project to add more features i will need find a better way to find users location. Another issue was that my expericne with javascript was limited and had some issue with the frontend becasue of this. But once i realized all my issues were because javascript is asynchronous when calling my lambda API, i was able to reslove my problem of javascript running without waiting for response.
I chose to use the create-react-app boilerplate to minimize initial setup and used python since im experinced with the language to invest more time in diving into AWS technological.

