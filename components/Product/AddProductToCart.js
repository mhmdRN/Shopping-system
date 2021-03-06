import { Input} from 'semantic-ui-react'
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import cookie from 'js-cookie'
import catchErrors from '../../utils/catchErrors'
function AddProductToCart({user,productId}) {
  const [quantity,setQuantity]=React.useState(1)
  const router=useRouter()
  const [loading,setLoading]=React.useState(false)
  const [success,setSuccess]=React.useState(false)
  React.useEffect(()=>{
    let timeout;
    if(success){
      timeout=setTimeout(()=>setSuccess(false),2000)
    }
    return ()=>{
      clearTimeout(timeout)
    }
  },[success]);
async function handleAddProductToCart(){
  try {
    setLoading(true)
    const token=cookie.get('token')
    const url=`${baseUrl}/api/cart`
    const payload={quantity,productId}
    const header={headers:{authorization:token}}
    await axios.put(url,payload,header)
    setSuccess(true)

  } catch (error) {
    catchErrors(error,window.alert)
  }finally{
    setLoading(false)
  }
}

  return (
  <Input
    type="number"
    min="1"
    placeholder="Quantity"
    value={quantity}
    onChange={e=>setQuantity(Number(e.target.value))}
    action={user && success?{
      color:"blue",
      content:"Item Added!",
      icon:"plus cart",
      disabled:true
    }:user?{
      color:"orange",
      content:"Add to Cart",
      icon:"plus cart",
      loading,
      disabled:loading,
      onClick:handleAddProductToCart
    }:{
      color:"blue",
      content:"signup to add",
      icon:"signup",
      onClick: ()=> router.push('signup')
    }}
  />);
}

export default AddProductToCart;
