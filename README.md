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
## The API will be running at: http://localhost:5000



    
    
    
