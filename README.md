# Chatbox Application

A full-stack chat application with a backend implemented using FastAPI and an in-memory database. This application includes features for creating, deleting, and retrieving messages. The frontend is built using React and TypeScript.

## Features

- **Create Messages**: Add new messages to the system.
- **Delete Messages**: Remove messages from the system.
- **Retrieve Messages**: Fetch messages based on user ID and context.

## Setup

### Backend

1. **Clone the Repository**

    ```bash
    git clone https://github.com/wasimrehman05/chatbox.git
    cd chatbox/backend
    ```

2. **Create and Activate a Virtual Environment**

    ```bash
    python3 -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```

3. **Install Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Server**

    ```bash
    uvicorn app:main:app --reload
    ```

   The server will be available at `http://127.0.0.1:8000`.

### Frontend

1. **Navigate to the Frontend Directory**

    ```bash
    cd ../frontend
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Run the Application**

    ```bash
    npm start
    ```

   The frontend will be available at `http://localhost:3000`.

## API Endpoints

### Create Message

- **Endpoint**: `/api/messages`
- **Method**: `POST`
- **Request Body**:

    ```json
    {
      "message": "string",
      "user_id": "integer",
      "context": "string"
    }
    ```

- **Response**:

    ```json
    {
      "id": "string",
      "message": "string",
      "reply": "string",
      "user_id": "integer",
      "context": "string",
      "created_at": "string",
      "updated_at": "string",
      "deleted_at": "string"
    }
    ```

### Delete Message

- **Endpoint**: `/api/messages/{id}`
- **Method**: `DELETE`
- **Response**:

    ```json
    true
    ```

### Retrieve Messages

- **Endpoint**: `/api/messages`
- **Method**: `GET`
- **Query Parameters**:

    ```plaintext
    user_id=integer
    context=string
    skip_count=integer
    ```

- **Response**:

    ```json
    {
      "messages": [
        {
          "id": "string",
          "message": "string",
          "reply": "string",
          "user_id": "integer",
          "context": "string",
          "created_at": "string",
          "updated_at": "string",
          "deleted_at": "string"
        }
      ]
    }
    ```

## Testing

### Backend Tests

1. **Install Testing Dependencies**

    ```bash
    pip install pytest pytest-asyncio httpx
    ```

2. **Run the Tests**

    ```bash
    pytest
    ```

   This will run all the tests defined in the `tests/` directory.

## Contributing

1. **Fork the Repository**
2. **Create a New Branch**
3. **Commit Your Changes**
4. **Push to the Branch**
5. **Create a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **FastAPI** for providing a modern, fast web framework for building APIs with Python 3.7+.
- **React** and **TypeScript** for building the frontend.
- **httpx** and **pytest** for testing the asynchronous code.

Feel free to open an issue or submit a pull request if you have any questions or improvements!
