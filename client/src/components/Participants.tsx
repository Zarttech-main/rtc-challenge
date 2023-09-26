import { useContext } from 'react'

import { RoomContext } from '../context/RoomContext'

const Participants = () => {
  const { participants, userPeer } = useContext(RoomContext);
  return (
    <div className="participants-section">
      <div className='section-title'>Participants</div>
      <div className='participants-list'>
        {participants.map((pt) => <div key={pt.peerId} className='participant'>
          {`${pt.name} ${pt.peerId === userPeer?.id ? '(Me)' : ''} `}
        </div>)}
      </div>
    </div>
  )
}

export default Participants
