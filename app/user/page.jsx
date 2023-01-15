'use client';
import { Button, Container, FormControl, Grid, Input, InputLabel, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Magic } from 'magic-sdk';
import { useRouter } from 'next/navigation';
import { userStore } from 'store/userStore';

const Login = () => {
    const router = useRouter()
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState("")

    const setUser = userStore(state => state.setUser)
    const setToken = userStore(state => state.setToken)
    const user = userStore(state => state.user)
    let magic

    useEffect(() => {
        //  user?.issuer && Router.push('/ideas');
        console.log("user email", user)
    }, [user]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleLogin = async () => {
        magic = new Magic(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);
        if (email) {
            try {
                let didToken = await magic.auth.loginWithEmailOTP({ email });
                const res = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + didToken,
                    },
                    body: JSON.stringify({ email })

                });
                if (res.status === 200) {
                    // Set the UserContext to the now logged in user
                    const data = await res.json()
                    setToken(data.token)
                    let userMetadata = await magic.user.getMetadata();
                    setUser(userMetadata.email);
                    router.push('/ideas');
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const handleLogout = async () => {
        await magic.user.logout();
        setUser("")
        setToken("")
    };

    return (
        <Container
            sx={{ padding: 5, boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);" }} maxWidth='sm'>
            <Stack>
                {
                    !user &&
                    <TextField id="email" label="Email" variant="standard" sx={{ mx: "6px" }} onChange={handleEmailChange} required type="email" />
                }
                {
                    user &&
                    <Typography>Logged in as {user}</Typography>
                }
                {
                    !user &&
                    <Button onClick={handleLogin} type='submit' sx={{ width: "50px", marginTop: 5 }}>Login</Button>
                }
                {
                    user &&
                    <Button onClick={handleLogout} type='submit' sx={{ width: "50px", marginTop: 5 }}>Logout</Button>
                }


            </Stack>
        </Container>
    )
}

export default Login