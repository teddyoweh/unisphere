import React, { useState } from 'react';
import authApi from '../api/auth.api';
import { useRouter } from 'next/navigation'
 

export default function Register() {
    const router = useRouter()
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState(null);

    const handleFirstnameChange = (e) => {
        setFirstname(e.target.value);
    };

    const handleLastnameChange = (e) => {
        setLastname(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        setError(null);

       authApi.register({
            firstname,
            lastname,
            username,
            email,
            password
        })
        .then((response) => {
            console.log(response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            router.push('/');
        })
        .catch((err) => {
            console.log(err);
            setError(err.message);
        
       })
    };

    return (
        <div className="auth">
            <div className="auth-form">
                {
                    error && (
                        <div className="error">
                            {error}
                        </div>
                    )
                }
                
                <div className="auth-sec">
                    <div className="auth-input">
                        <input
                            type="text"
                            placeholder="Firstname"
                            value={firstname}
                            onChange={handleFirstnameChange}
                        />
                    </div>
                </div>
                <div className="auth-sec">
                    <div className="auth-input">
                        <input
                            type="text"
                            placeholder="Lastname"
                            value={lastname}
                            onChange={handleLastnameChange}
                        />
                    </div>
                </div>
                <div className="auth-sec">
                    <div className="auth-input">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                </div>
                <div className="auth-sec">
                    <div className="auth-input">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                </div>
                <div className="auth-sec">
                    <div className="auth-input">
                        <input
                            type="text"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>
                <div className="auth-btn">
                    <button onClick={handleSubmit}>Register</button>
                </div>
            </div>
        </div>
    );
}
