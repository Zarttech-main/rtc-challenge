const { v4: uuidv4 } = require("uuid");

module.exports = class {
  // All room members
  allMembers = [];

  constructor({ creatorID, title }) {
    // Create random id for room
    this.meetingID = uuidv4();

    // Creator id
    this.creatorID = creatorID;

    // Title of room
    this.title = title;
  }

  // Adding new member to meeting room
  addToRoom(newMember) {
    this.allMembers.push(newMember);
  }

  // Remove member from room
  removeFromRoom(memberID) {
    this.allMembers = this.allMembers.filter((member) => member !== memberID);
  }
};
