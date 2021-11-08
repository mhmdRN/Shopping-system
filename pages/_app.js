import App from "next/app";
import Layout from "../components/_App/Layout";
import {parseCookies,destroyCookie} from 'nookies'
import {redirectUser} from '../utils/auth'
import baseUrl from '../utils/baseUrl'
import axios from "axios";
import { Router } from "next/router";

class MyApp extends App {
  static async getInitialProps({Component,ctx}){
    const {token}=parseCookies(ctx)
    let PageProps={};
    if(Component.getInitialProps){
      PageProps=await Component.getInitialProps(ctx);
    }
    if(!token){
      const isProtectedRoute=ctx.pathname === '/account' || ctx.pathname === '/create';
      if(isProtectedRoute){
          redirectUser(ctx,'/login')
      }
    }else{
        try{
          const payload={headers: {Authorization: token}}
          const url=`${baseUrl}/api/account`
          const response=await axios.get(url,payload)
          const user=response.data
          const isAdmin=user.role ==='admin'
          const isRoot=user.role ==='root'
          const isNotPermitted=!(isRoot || isAdmin) && ctx.pathname === '/create'
          if(isNotPermitted) redirectUser(ctx,'/')
          PageProps.user=user;
        }catch(error){
          console.error("Error getting current user",error)
          destroyCookie(ctx,"token")
          redirectUser(ctx,"/login")
        }
      }
    
    return {PageProps};
  }
  componentDidMount(){
    window.addEventListener('storage',this.syncLogout)
  }
  syncLogout=event=>{
    if(event.key==='logout'){
      console.log("Looged out from storage")
      Router.push('/login')
    }
  }
  
  render() {
    const { Component,PageProps } = this.props;
    return (
    <Layout {...PageProps}>
      <Component {...PageProps}/>
    </Layout>
    );
  }
}

export default MyApp;
