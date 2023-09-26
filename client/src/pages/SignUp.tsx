import { ChangeEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar'
import Axios from '../utils/Axios';
import { User } from '../utils/types';
import { AuthContext } from '../context/AuthContext';
import { getUserHomeRoom } from '../utils/helpers';


interface FormValues {
    name: string;
    email: string;
    password: string;
}

const SignUp = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate()
    const [error, setError] = useState("");

    const [inputValues, setInputValues] = useState<FormValues>({
        name: '',
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

    const handleSignUp = async () => {
        setError("");
        const { name, email, password } = inputValues;
        if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
            setError("Complete form")
            return;
        }
        try {
            const response = await Axios.post(`/auth/signup`, inputValues);
            const user: User = response.data;

            if (user && user.token) {
                setUser(user);
                const room = await getUserHomeRoom(user.data.id)
                navigate(`/${room.id}`)
            } else {
                setError("Email has been taken");
            }
        } catch (error) {
            setError("Something went wrong");
        }
    }
    return (
        <div>

            <Navbar />
            <div className='container auth-form'>
                {error.trim() !== "" && <span className='error'>{error} </span>}

                <label htmlFor="">Name</label>
                <input type='text' name='name' placeholder='Name' required
                    value={inputValues.name} onChange={handleInputChange} />
                <label htmlFor="">Email</label>
                <input type='email' name='email' placeholder='email' required
                    value={inputValues.email} onChange={handleInputChange} />
                <label htmlFor="">Password</label>
                <input type='password' name='password' placeholder='password' required
                    value={inputValues.password} onChange={handleInputChange} />
                <button onClick={handleSignUp}>Sign Up</button>
            </div>
        </div>



    )
}

export default SignUp
