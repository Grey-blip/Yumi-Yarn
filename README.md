# Yumi-Yarn
A full-stack event planning web application built for the Network-Based Application Development course in Spring 2025. The project supports event creation, RSVP tracking, user authentication, and profile-based event management. Users can browse upcoming events, create their own, RSVP, and manage content securely.

## Function

- User registration, login, and authentication with session handling
- Secure routing based on user permissions
- Event creation, editing, and deletion
- RSVP functionality and profile-linked event history
- Flash messaging and error handling
- File uploads for event images
- Modular codebase using Express Router and middleware
- Data modeling with Mongoose and MongoDB Atlas

## Technologies Used

- Frontend: HTML, CSS, EJS Templates
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Middleware: Multer (file upload), Express-session, Connect-flash
- Version Control: Git & GitHub

## Features

- Authentication & Authorization: Users can sign up, log in, and access pages based on their login status.
- Event Management: Users can create, edit, delete, and RSVP to events.
- Image Uploads: Events support image uploads and edits.
- Dynamic Templates: Pages are rendered using EJS, with routing based on MVC design principles.

## Additional Features

- **Editable Event Images**: Users can upload a new image when editing an event, or retain the existing one. The form displays the current image for reference.
- **Session-Based Flash Messaging**: Feedback on actions like login, form submission, and errors is clearly communicated using flash messages.

## Installation & Setup
```bash
git clone https://github.com/grey-blip/yumi-yarn.git
cd yumi-yarn
npm install
npm run dev
