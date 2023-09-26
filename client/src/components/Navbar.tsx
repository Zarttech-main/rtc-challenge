import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'
import { getUserHomeRoom } from '../utils/helpers';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  }
  const openMyRooms = async () => {
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
    <nav className='navbar'>
      <div className='container navbar-content'>
        <Link to={"/"}>Zarttech RTC</Link>

        {user && <span onClick={openMyRooms} className='link'>My Rooms</span>}

        <div className='navbar-buttons'>

          {!user && <> <Link to="/signin"><button>SignIn</button></Link>
            <Link to="/signup"><button>Signup</button></Link>
          </>}

          {user && <span>{user.data.name}</span>}
          {user && <button onClick={handleLogout}>Logout</button>}


        </div>
      </div>
    </nav>
  )
}

export default Navbar
