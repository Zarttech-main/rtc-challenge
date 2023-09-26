import { ChangeEvent, useContext, useEffect, useState } from 'react'

import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE } from '../utils/constants';
import { Comment } from '../utils/types';
import { useParams } from 'react-router-dom';


const CommentItem: React.FC<Comment> = ({ name, message }) => {
  return (
    <div className='comment-item'>
      <div>{name}</div>
      <div>{message}</div>
    </div>
  )
}

const Comments = () => {
  const { ws } = useContext(RoomContext)
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([])
  const name = localStorage.getItem("participantName") as string;
  const { roomId } = useParams();

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const updateComments = ({ name, message }: Comment) => {
    setComments(prev => [...prev, { name, message }])
  }

  const sendMessage = () => {
    if (message.trim() === "") return;

    ws.emit(SE.sendMessage, { roomId, name, message })

    setComments(prev => [...prev, { name, message }])

    setMessage("");
  }

  useEffect(() => {
    ws.on(SE.messageSent, updateComments)
  }, [])

  return (
    <div className='comments-section'>
      <div className='section-title'>Comments</div>
      <div className='comments-list'>
        {comments.map((comment, i) => <CommentItem key={i} {...comment} />)}
      </div>

      <div className='comment-form'>
        <input className='comment-input' onChange={handleMessageChange} placeholder='Chat here' value={message} /> <button onClick={sendMessage} className='comment-send'>Send</button>
      </div>

    </div>
  )
}

export default Comments
