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

# Segun

In my changes, I implement the video call with HTML5, CSS, Javascript and Agora SDK
In the project folder, I have index.html file which is the based url. From index.html, when user click on Peer Chat, it take them to one on one with with participant and when user clicks on create room button, it takes them to where they can create or join room by entering their name and room ID.

In one one call, user can decide to switch camera to off/on and same for mic

In room section, user can join room, switch camera to off/on, mic off/on, share screen as well, chat while in the room at right hand side, see participants from left sidebar, click on a circle video of participant to expand the video width, height and remove radius.

Users can leave call or room and participants will know the person that left.

I wrote this in HTML5, CSS and Javascript because of my busy schedule. If given more time, I can switch it to react.js
