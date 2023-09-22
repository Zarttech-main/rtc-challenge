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

## To run application

- Clone Repo
- Create 2 terminals, one to host the Client server and the other to host the Backend socket server
- Install npm modules in both terminal using npm install
- Run npm start in both terminals, the client is hosted on localhost:3000 while the backend socket is hosted on localhost:4000

## To interact with application

- Create a meeting as a user
- Join the meeting
- Open another browser, all available live meetings will be shown as a list
- Request to join one of the meetings
- Go to the initial browser that created the meeting to accept the meeting join request
- The meeting is started
- You can toggle Microphone and Camera at the bottom nav bar.
- To allow multiple sessions, simple open another browser and send a meeting join request to the same meeting.
- Ensure to have headphones plugged into your computer to avoid weird sounds since you're sending and receiving media streams through the same hardware component
