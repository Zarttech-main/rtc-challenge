# Zarttech

**Challenge: Build a real-time communication system using WebRTC technology.**

- The platform should support video and audio calls
- The platform should be able to handle multiple concurrent users and sessions.
- The platform should be able to handle potential network interruptions and reconnections.
- The platform should be built using Angular (with TypeScript), HTML, and Angular Material UI or Pure CSS
- Use backend technology to build your signaling server (preferably node, deno, or any python web framework)

**Evaluation Criteria:**

- Functionality: Can the platform handle video and audio calls with multiple users?
- Scalability: Can the platform handle multiple concurrent users and sessions?
- Resilience: Can the platform handle potential network interruptions and reconnections?
- Code Quality: Is the code readable, maintainable, and well-organized?

Submit a pull request to the following repository using your github account.

[https://github.com/Zarttech-main/webrtc-challenge](https://github.com/Zarttech-main/webrtc-challenge)

Feel Free to restructure the project as you like

Don't bother about responsiveness or nice look !

**NOTE: You are to update the README.md with a proper step by step process on how to run your application.**

Thanks and Good Luck.


# HOW TO RUN APPLICATION

To start both React client and Node.js server apps, and  test them in a development environment, do the following:

### 1  Clone the GitHub Repository:
Clone this GitHub repository 
```bash
git clone https://github.com/wilfredcloud/rtc-challenge.git
```

### 2 Navigate to the Project Directory:
Change your current directory to the project directory:
```bash
cd rtc-challenge
```

### 3 Set Environment Variables:
Both the react client and node server requires environment variables. 
Locate the sample.env file in the client as well as server directory and rename each to `.env`.

### 4 Update the DATABASE_URL:
Open the `.env` in the server directory and update `DATABASE_URL` to the absolute path of `database.db` file in the server directory.
The path should be in this format `file://<absolute_path_to_database.db_in_your_local_machine>`

### 5 Install Dependencies:
Navigate to both the client and server directories separately and install the project dependencies using `npm`

```bash
 # Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

```

### 6 Start the Server
Navigate to the server director and start it 
```bash
cd ../server
npm run dev
```
This will start your server, and it will listen to port 5000.

### 7 Start the client
Navigate to the client director and start it 
```bash
cd ../client
npm run start
```
This will start the React development server on port 3000

### Access the App in Your Browser:
Starting the client app should automatically open the app on your browser, your can as well manually
open `http://localhost:3000` on your browser to see the app running 


### Video on how to use the App

https://github.com/wilfredcloud/rtc-challenge/assets/111436934/6f8d65fd-c8af-4896-bbc0-c3ea08888a22

