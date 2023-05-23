import { Link, useNavigate  } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { SERVER_URL } from '@/config';
import toast, { Toaster } from 'react-hot-toast';

import axios from "axios";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

export function SignIn() {
let navigate  = useNavigate ();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!email){
      toast.error("email required")
      return;
    }
    if(!password){
      toast.error("password required")
      return;
    }
    axios.post(`${SERVER_URL}/auth/manage`, {email,password})
    .then(res=>{
      if(res.data.message){
        toast.error(res.data.message);
      }
      if(res.data.token){
        localStorage.setItem("authToken", res.data.token)
        console.log(localStorage.getItem('authToken'))
        navigate('/manage/user')
      }
      
    })
  }
  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="email" label="Email" size="lg" 
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.keyCode==13?handleSubmit(e):""}
              />
            <Input type="password" label="Password" size="lg" 
              value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.keyCode==13?handleSubmit(e):""}
              />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={handleSubmit}>
              Sign In
            </Button>
            
          </CardFooter>
        </Card>
      <Toaster />

      </div>
    </>
  );
}

export default SignIn;
