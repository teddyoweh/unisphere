
import React, { useState } from 'react';
import authApi from '../api/auth.api';
import { useRouter } from 'next/navigation'
export default function Login() {
    const [email, setEmail] = useState('');
    const [error,setError] = useState(null);
    const [password, setPassword] = useState('');
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const router = useRouter()
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        setError(null);

       authApi.login({
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
                        <input type="text" placeholder="Email"
                           value={email}
                           onChange={handleEmailChange}
                        />
                    </div>
                </div>
                <div className="auth-sec">
                    <div className="auth-input">
                        <input type="text" placeholder="Password" 
                             value={password}
                             onChange={handlePasswordChange}
                        />
                    </div>          
                </div>
              
             
             
                <div className="auth-btn">
                    <button className=""  onClick={handleSubmit}>Login</button>
                    
                </div>
            </div>
        </div>
    )
}