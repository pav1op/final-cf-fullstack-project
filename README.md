# final-cf-fullstack-project
This is a fullstack web-app for the final project of Coding Factory 5. It is an online catalog that displays companies.

Backend:
There are two models in the web-app user and company. User has two roles, admin that can do all the CRUD operations and the user that can do a part of them. Also company can do a part of CRUD operations. MongoDB has been used as database for the web-app, having two collections, one for the user model and one for the company. 
Backend has been tested with Postman and documented using Swagger.

Frontend:
In frontend someone can register (and later login) as user or company. After logging/registering you are directed to the page with the companies (that have been registered) where you can navigate through the pages in order to find information about the one you want or search it by name in the search bar. In navbar you can also visit your profile where you can see and change some of your registered information. When you press logout you return to the login page.

The data used for users and companies are fictional.
