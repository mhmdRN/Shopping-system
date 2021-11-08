import React from 'react';
import {Message,Button,Form,Segment,Icon} from 'semantic-ui-react'
import Link from 'next/link'
import catchErrors from '../utils/catchErrors';
import baseUrl from '../utils/baseUrl';
import axios from 'axios';
import { handleLogin } from '../utils/auth';
  const INITIAL_USER={
    email:"",
    password:""
  }
  function Login() {
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
        const url=`${baseUrl}/api/login`
        const payload={...user}
        const response=await axios.post(url,payload)
        handleLogin(response.data)
      }catch(error){
        catchErrors(error,setError)
      }finally{
        setLoading(false)
      }
    }
    return <>
    <Message
      content="Log in with email and password"
      header="Welcome Back!"
      icon="privacy"
      color="blue"
    />
    <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
      <Message error header="Oops!" content={error} />
      <Segment>
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
          icon="sign in"
          content="Login"
          type="submit"
          color="orange"
          disabled={disabled || loading}
        />
      </Segment>
    </Form>
    <Message attached="bottom" warning>
      <Icon name="help"/>
     New user?{" "}
      <Link href="/signup">
      <a>Sign up in here</a>
      </Link>{" "}instead.
    </Message>
    </>;
  
}

export default Login;
