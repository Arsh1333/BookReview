# 📚 Book Review API  

A RESTful API for managing books and reviews, built with **Node.js, Express, MongoDB, and JWT authentication**.  

This project allows users to:  
- Sign up / log in  
- Add books  
- Submit reviews (1 per user per book)  
- View books with reviews & average rating  
- Update / delete their own reviews  
- Search books by title or author  

---

## 🚀 Tech Stack
- **Backend:** Node.js, Express  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT (JSON Web Tokens)  
- **Security:** bcryptjs for password hashing  

---

## 🛠️ Project Setup Instructions  

### 1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/book-review-api.git
   cd book-review-api
   ```
### 2. Install dependencies:
    ```bash
    npm install
    ```
### 3. Create a .env file in the root directory:
    ```.env
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-secret-key
    PORT=5000
    ```
### 4. Start the server:
     ```bash
      npm sart
      ```
 The API will be running at: http://localhost:5000


## ▶️ How to run locally :

-Ensure MongoDB is running (local or Atlas).
-Use Postman / ThunderClient / curl to test the endpoints.

## 📌 Example API Requests

   🔑 Auth:
   1. Register

     ```bash
    curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"username":"arsh","email":"arsh@example.com","password":"mypassword"}'
   ```

   2. Login
   ```bash
  curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"arsh@example.com","password":"mypassword"}'
 
   ```
 
 Response includes a JWT token.

   
  📚 Books
  1. Add Book (requires token)
  ```bash
   curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"The Pragmatic Programmer","author":"Andrew Hunt","genre":"Programming","description":"A book about pragmatic software development."}'
```
2. Get All Books
```bash
curl -X GET "http://localhost:5000/api/books?page=1&limit=5"
```   
3. Get Book by ID (with reviews & average rating)
  ```bash
 curl -X GET http://localhost:5000/api/books/<bookId>
 ```
4. Search Books
 ```bash
curl -X GET "http://localhost:5000/api/books/search/query?q=pragmatic"
```
✍️ Reviews

1. Add Reviews
   ```bash
   curl -X POST http://localhost:5000/api/books/<bookId>/reviews \
   -H "Authorization: Bearer <token>" \
   -H "Content-Type: application/json" \
   -d '{"rating":5,"comment":"Amazing read!"}'
   ```
2. Update Review
   ```bash
   curl -X PUT http://localhost:5000/api/reviews/<reviewId> \
   -H "Authorization: Bearer <token>" \
   -H "Content-Type: application/json" \
   -d '{"rating":4,"comment":"Updated after re-reading"}'

   ```
3. Delete Review
   ```bash
   curl -X DELETE http://localhost:5000/api/reviews/<reviewId> \
   -H "Authorization: Bearer <token>"
   ```

## 📐 Database Schema

Users
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password": "String (hashed)",
  "createdAt": "Date"
}

```

Books
```json
{
  "_id": "ObjectId",
  "title": "String",
  "author": "String",
  "genre": "String",
  "description": "String",
  "createdAt": "Date"
}

```

Reviews
```json
{
  "_id": "ObjectId",
  "book": "ObjectId → Books",
  "user": "ObjectId → Users",
  "rating": "Number (1-5)",
  "comment": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}

```
<img width="803" height="376" alt="Untitled" src="https://github.com/user-attachments/assets/b8819813-a3c5-44b4-8f4b-34150a97101f" />

