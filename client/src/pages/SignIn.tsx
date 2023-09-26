import { ChangeEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar'
import Axios from '../utils/Axios';
import { User } from '../utils/types';
import { AuthContext } from '../context/AuthContext';
import { getUserHomeRoom } from '../utils/helpers';


interface FormValues {
    email: string;
    password: string;
}

const SignIn = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [inputValues, setInputValues] = useState<FormValues>({
        email: '',
        password: ''
    })

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const handleSignIn = async () => {
        setError("");
        const { email, password } = inputValues

        if (email.trim() === "" || password.trim() === "") {
            setError("Complete form")
            return;
        }
        try {
            const response = await Axios.post(`/auth/signin`, inputValues);
            const user: User = response.data;

            if (user && user.token) {
                setUser(user);
                const room = await getUserHomeRoom(user.data.id)
                navigate(`/${room.id}`)
            } else {
                console.log("Something went wrong");
                setError("Something went wrong")
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Navbar />
            <div className='container auth-form'>
                {error.trim() !== "" && <span className='error'>{error} </span>}
                <label htmlFor="">Email</label>
                <input type='email' name='email' placeholder='email' required
                    value={inputValues.email} onChange={handleInputChange} />
                <label htmlFor="">Password</label>
                <input type='password' name='password' placeholder='password' required
                    value={inputValues.password} onChange={handleInputChange} />
                <button onClick={handleSignIn}>Sign In</button>
            </div>
        </div>
    )
}

export default SignIn
