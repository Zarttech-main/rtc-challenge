import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'
import { Room as RoomValue } from '../utils/types';
import { getRoomById, getUserByRoomId, getUserRooms, } from '../utils/helpers';
import Navbar from '../components/Navbar';
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE } from '../utils/constants';


const Room = () => {
  const { user } = useContext(AuthContext);
  const { ws } = useContext(RoomContext);
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomValue>()
  const [userRooms, setUserRooms] = useState<RoomValue[]>([])
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRoomInSession, setIsRoomInSession] = useState(false);
  const baseUrl = window.location.origin;
  const invitLink = `${baseUrl}/${room?.id}`;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const [inviteeName, setInviteeName] = useState(user?.data.name || localStorage.getItem("participantName") || "")
  const [roomUserName, setRoomUserName] = useState("");
  const [joinInputError, setJoinInputError] = useState(false);


  const handleRoomSessionState = ({ roomState }: { roomState: boolean }) => {
    setIsRoomInSession(roomState);
  }

  useEffect(() => {
    const getRooms = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);

        if (user) {
          const userRooms = await getUserRooms(user.data.id);
          setUserRooms(userRooms);
        } else {
          const roomUser = await getUserByRoomId(roomId as string);
          setRoomUserName(roomUser.name);
        }
      } catch (error) {
        console.log("Something went wrong");
      } finally {
        setLoading(false);
      }

    }
    getRooms();

    ws.emit(SE.isRoomInSession, { roomId })
    ws.on(SE.roomSessionState, handleRoomSessionState)

  }, [roomId, user])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitLink);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000)
    } catch (error) {
      console.log("Unable to copy", error)
    }
  }

  const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setJoinInputError(false)
    setInviteeName(e.target.value)
  }


  const startMeeting = () => {
    if (!user) return;
    localStorage.setItem("participantName", user.data.name)
    const data = {
      roomId,
      userId: user.data.id,
    }
    ws.emit(SE.startRoomSession, data);

  }
  const joinMeeting = () => {
    if (inviteeName.trim() === "") {
      setJoinInputError(true)
      return;
    }
    localStorage.setItem("participantName", inviteeName)
    navigate(`/${roomId}/join`)
  }



  if (loading) {
    return <h6>Loading</h6>
  }
  if (!loading && !room) {
    return <>Invalid room</>
  }

  if (!user || user.data.id !== room?.userId) {
    return (
      <div>
        <Navbar />
        <div className='container'>
          <span>You have been invited to join </span>
          <h1 className=' '>{room?.name}</h1>
          <span>(Owner: {roomUserName})</span>
          <br />
          <br />
          <input placeholder='Enter your name ' onChange={handleNameChange} value={inviteeName}
            className={`${joinInputError ? 'input-error' : ''}`} />
          <button onClick={joinMeeting}>Join</button>
          <br />
          {searchParams.get('session') === 'false' && <span className='error'>Meeting has not started</span>}
          <br />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className='container'>
        <h1>{room?.name}</h1>
        <span>Invite participant</span>
        <div >
          <input readOnly value={invitLink} /> <button onClick={handleCopy}>{isCopied ? 'Copied' : 'Copy'}</button>

          <button onClick={isRoomInSession ? joinMeeting : startMeeting}> {isRoomInSession ? 'Join Meeting' : 'Start Meeting'}</button>

        </div>
        <h5>Rooms</h5>
        <hr />
        <div className='room-grid'>
          {userRooms.map((room) => <Link className='room-item' key={room.id} to={`/${room.id}`}><div>{room.name}</div></Link>)}
        </div>
        <Link to={"/newroom"}><button>Create a Room</button></Link>
      </div>
    </div>
  )
}

export default Room
