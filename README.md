# WebRTC Video and Voice Call Application with Angular and Nodejs

This is a simple Real-Time Communication (RTC) application that enables users to make video and voice calls using WebRTC technology. The application utilizes Angular for the frontend and Node.js for signaling.

## Features

- Video and voice call capabilities using WebRTC.
- Real-time signaling using Node.js.
- User authentication and identification.
- Easy-to-use interface for initiating and receiving calls.
- Ability handle potential network interruptions and reconnections.
- Can handle multiple concurrent users and sessions

## Prerequisites

- Node.js and npm installed on your machine.
- Angular CLI installed (`npm install -g @angular/cli`).
- Basic knowledge of WebRTC, Angular, and Node.js.

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/emmaprov1/webrtc-video-voice-call.git
   cd webrtc-video-call
   ```

2. **Install Dependencies:**

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. **Run the Frontend:**

   ```bash
   cd frontend
   ng serve
   ```

   Open your browser and navigate to `http://localhost:4200` to access the frontend.

4. **Run the Server:**

   ```bash
   cd server
   npm run dev
   ```

   The signaling server will be running at `http://localhost:8000`.

5. **Start Making Calls:**

   Access the application through your browser. You can initiate calls to other users by sending the call url to them. You'll be prompted to grant access to your camera and microphone.

## Folder Structure

- `client`: Contains the Angular frontend application.
- `server`: Contains the Node.js server for signaling.

## Configuration

- Modify the signaling server URL in the frontend code to match your server's URL.

## Contribution

Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README to fit your specific project details, technologies used, and any additional instructions you'd like to provide to users.
