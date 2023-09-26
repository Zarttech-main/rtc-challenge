import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar'
import Axios from '../utils/Axios';
import { AuthContext } from '../context/AuthContext';
import { Room } from '../utils/types';


const NewRoom = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/");
        }

    }, [])

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    const createRoom = async () => {
        setError("");
        if (name.trim() === "") {
            setError("Complete form")
            return;
        }
        try {
            const response = await Axios.post(`/rooms/`, { name, userId: user?.data.id });
            const room: Room = response.data;
            navigate(`/${room.id}`)
        } catch (error) {
            setError("Somethin went wrong");
        }
    }

    return (
        <div>
            <Navbar />
            <div className='container auth-form'>
                {error.trim() !== "" && <span className='error'>{error} </span>}
                <label htmlFor="">Room Name</label>
                <input type='text' name='name' placeholder='Enter room name' onChange={handleNameChange} value={name} />

                <button onClick={createRoom}>Create Room</button>
            </div>
        </div>
    )
}

export default NewRoom
