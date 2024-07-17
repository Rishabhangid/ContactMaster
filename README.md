# ContactMaster

ContactMaster is a MERN stack web application that allows users to store, edit, and delete contact information, including name, email, and phone number. The application includes complete user authentication and protected web pages, styled with Tailwind CSS.

## Features

- **User Authentication:** Secure user registration and login functionality.
- **Protected Pages:** Only authenticated users can access certain pages.
- **CRUD Operations:** Users can create, read, update, and delete contact information.
- **Tailwind CSS:** Responsive and modern UI styling with Tailwind CSS.

## Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)



## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rishabhangid/contactmaster.git
   ```
2. Navigate into the project directory:
   ```bash
   cd contactmaster
   ```
3. Install dependencies for both the client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the `server` directory with the following content:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the development servers:
   - In the `server` directory:
     ```bash
     npm run dev
     ```
   - In a new terminal window, navigate to the `client` directory and start the React development server:
     ```bash
     npm start
     ```
6. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

## Folder Structure

```
contactmaster/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactForm.js
│   │   │   ├── ContactList.js
│   │   │   ├── Navbar.js
│   │   │   └── ...
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── ...
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Contact.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   └── ...
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   └── ...
├── README.md
└── ...
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.



## Acknowledgements

- **MERN Stack** - MongoDB, Express.js, React.js, Node.js
- **Tailwind CSS** - A utility-first CSS framework

