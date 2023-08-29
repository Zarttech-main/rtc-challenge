# Zarttech

**A real-time communication system using WebRTC technology.**

- The platform supports video calls
- The platform supports multiple concurrent users and sessions.
- The platform can handle potential network interruptions and reconnections.
- The platform is built using Angular (with TypeScript), HTML, and Pure CSS
- The platform uses Socketio as the signaling server (over nodejs)

**Installation:**

- Clone my branch (git clone https://github.com/chaliman-co/rtc-challenge.git)
- cd into the folder and run 'npm install --legacy-peer-deps' (That command line option is important!)
- After installation, run 'npm run start' on one terminal. This will start the webpack dev server for angular.
- Wait for the webpack cli to finish building.
- Open another terminal inside the same folder and run 'npm run server'. This will start the socketio server. 
- Navigate to localhost:4200 on any browser on the system to see the angular ui.
- You can exercise the UI from there on.
- You need to connect to the server from two or more tabs or browsers or even devices to see the multiconnections in action
- If you can, connect your pc to the same wifi network as another pc or phone. Then try opening your pc's ip, port 4200. (e.g. http://192.168.8.1:4200)
- For the previous line to work though, you need to change the SERVER_URL variable in src\app\services\socket-service.service.ts, replacing localhost with our ip on the wifi network, and restart the angular dev server.
- In case you decide to test with just one pc, please note that you cannot use multiple browsers unless you have multiple camera devices as only one program is allowed to use the camera at a time. You may just use multiple tabs on the same browser.
- You can look at the output from the socketio server for some insight into what the system is doing.

Feel free to contact me for any clarifications.