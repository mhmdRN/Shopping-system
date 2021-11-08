import {Segment} from 'semantic-ui-react'
import CartItemList from "../components/Cart/CartItemList"
import CartSummary from "../components/Cart/CartSummary"
import { parseCookies } from 'nookies';
import cookie from 'js-cookie'
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import React from 'react';
import catchErrors from '../utils/catchErrors'
function Cart({products,user}) {
  const [cartProducts,setCartProducts]=React.useState(products)
  const [loading,setLoading]=React.useState(false)
  const [success,setSuccess]=React.useState(false)
  async function handleRemoveFromCart(productId){
    const url=`${baseUrl}/api/cart`
    const token=cookie.get("token")
    const payload={ params:{productId},
                    headers: {Authorization: token}}
    const response=await axios.delete(url,payload) 
    setCartProducts(response.data)

  }
  async function handleCheckout(paymentData){
    try {
      setLoading(true)
      const token=cookie.get("token")
      const url=`${baseUrl}/api/checkout`
      const payload={ paymentData}
      const headers={headers: {Authorization: token}}
      const response=await axios.post(url,payload,headers)
      setSuccess(true)
    } catch (error) {
      catchErrors(error,window.alert)
    }finally{
      setLoading(false)
    }
  }
  return (
    <Segment loading={loading}>
      <CartItemList 
        handleRemoveFromCart={handleRemoveFromCart} 
        success={success} user={user} products={cartProducts}/>
      <CartSummary products={cartProducts}
        success={success} handleCheckout={handleCheckout}/>
    </Segment>
  );
}
Cart.getInitialProps=async(ctx)=>{
    const {token}= parseCookies(ctx)
    if(!token) return {products: []}
    const url=`${baseUrl}/api/cart`
    const payload={headers: {Authorization: token}}
    const response=await axios.get(url,payload)
    return {products: response.data}
}
export default Cart;
