import { ChangeEvent, useContext, useState } from 'react'

import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getUserHomeRoom } from '../utils/helpers';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState(false);

  const handleChangeInviteLink = (e: ChangeEvent<HTMLInputElement>) => {
      setError(false)
      setInviteLink(e.target.value);
  }

  const openRoom  = () => {
    if (inviteLink.trim() === "") {
      setError(true)
      return;
    }
    window.location.assign(inviteLink)
  }

  const createMeeting = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    try {
      const room = await getUserHomeRoom(user.data.id);
      navigate(`/${room.id}`)
    } catch (error) {
      console.log('Error occured')
    }
  }
  return (
    <div>
      <Navbar />
      <div className='container hero'>
        <h1>Welcome to Zarttech Video Conferencing</h1>
        <p>The conferencing solution you've been waiting for!</p>

        <div className=''><button onClick={createMeeting}>Start a meeting</button> 
        <input placeholder='Enter meeting link' value={inviteLink} className={error ? 'input-error' : ''}  onChange={handleChangeInviteLink}  />
         <button onClick={openRoom}>Join Meeting </button></div>
      </div>
    </div>
  )
}

export default Home
