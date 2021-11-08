import React from 'react';
import {Message,Button,Form,Segment,Icon} from 'semantic-ui-react'
import Link from 'next/link'
import catchErrors from '../utils/catchErrors';
import axios from 'axios'
import baseUrl from '../utils/baseUrl';
import { handleLogin } from '../utils/auth';
const INITIAL_USER={
  name:"",
  email:"",
  password:""
}
function Signup() {
  const [user,setUser]=React.useState(INITIAL_USER);
  const [disabled,setDisabled]=React.useState(true);
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState("");
  React.useEffect(()=>{
    const isUser=Object.values(user).every(el=>Boolean(el))
    isUser?setDisabled(false):setDisabled(true)
  },[user])
  function handleInput(e){
    const {name,value}=e.target;
    setUser(prev=>({...prev,[name]:value}))
    
  }
  async function handleSubmit(event){
    event.preventDefault();
    setLoading(true)
    try{
      setError('')
      const url=`${baseUrl}/api/signup`
      const payload={...user}
      const response=await axios.post(url,payload);
      handleLogin(response.data)
    }catch(error){
      catchErrors(error,setError)
    }finally{
      setLoading(false)
    }
  }
  return <>
  <Message
    content="Create a new account"
    header="Get Started!"
    icon="settings"
    color="teal"
  />
  <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
    <Message error header="Oops!" content={error} />
    <Segment>
      <Form.Input 
        label="Name" 
        placeholder="Name"  
        name="name"
        icon="user"
        iconPosition="left"
        fluid
        onChange={handleInput}
        value={user.name}
      />
      <Form.Input 
        label="Email" 
        placeholder="Email"  
        name="email"
        icon="envelope"
        iconPosition="left"
        fluid
        type="email"
        onChange={handleInput}
        value={user.email}
      />
      <Form.Input 
        label="Password" 
        placeholder="Password"  
        name="password"
        icon="lock"
        iconPosition="left"
        fluid
        type="password"
        onChange={handleInput}
        value={user.password}
      />
      <Button 
        icon="signup"
        content="Signup"
        type="submit"
        color="orange"
        disabled={disabled || loading}
      />
    </Segment>
  </Form>
  <Message attached="bottom" warning>
    <Icon name="help"/>
    Existing user?{" "}
    <Link href="/login">
    <a>Log in here</a>
    </Link>{" "}instead.
  </Message>
  </>;
}

export default Signup;
