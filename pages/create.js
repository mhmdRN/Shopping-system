import axios from 'axios';
import React from 'react';
import {Form, Header, Icon, Input, Image,TextArea,Button, Message} from 'semantic-ui-react'
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
const INITIAL_PRODUCT={
  name: "",
  price: "",
  description: "",
  media: ""
}

function CreateProduct() {
  const [product,setProduct]=React.useState(INITIAL_PRODUCT)
  const [success,setSuccess]=React.useState(false)
  const [mediaPreview,setMediaPreview]=React.useState("")
  const [loading,setLoading]=React.useState(false)
  const [disabled,setDisabled]=React.useState(true)
  const [error,setError]=React.useState('')
  React.useEffect(()=>{
    const isProduct=Object.values(product).every(el=>Boolean(el))
    isProduct?setDisabled(false):setDisabled(true)
  },[product]);

  function handleInput(event){
    const {name,value,files}=event.target;
    if(name === "media"){
      setProduct(prev=>({...prev,[name]:files[0]}))
      setMediaPreview(window.URL.createObjectURL(files[0]))
    }
    else
      setProduct(prev=>({...prev,[name]:value}))
  }

  async function handleSubmit(e){
    try{
      e.preventDefault();
      setLoading(true)
      setError('')
      const mediaUrl=await handleImageUpload()
      const url=`${baseUrl}/api/product`
      const payload={...product,mediaUrl}
      await axios.post(url,payload)
      setSuccess(true)
      setProduct(INITIAL_PRODUCT)
    }catch(error){
      catchErrors(error,setError)
      console.error(error);
    }finally{
      setLoading(false)
    }
  }
  async function handleImageUpload(){
    const data=new FormData()
    data.append('file',product.media)
    data.append('upload_preset','reactreserve')
    data.append('cloud_name','mhmdrn')
    const response = await axios.post(process.env.CLOUDINARY_URL,data)
    const mediaUrl=response.data.url;
    return mediaUrl;
  }
  return (
  <>
    <Header as="h2" block>
      <Icon name="plus" color="orange"/>
      Create New Product
    </Header>
    <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
    <Message
        error
        content={error}
        header="Oops!"
      />
      <Message
        success
        content="Your product is now posted!!"
        header="Success"
        icon="check"
      />
      <Form.Group widths="equal">
        <Form.Field
          control={Input}
          name="name"
          label="Name"
          placeholder="Name"
          onChange={handleInput}
          value={product.name}
          required
        />
        <Form.Field
          control={Input}
          name="price"
          label="Price"
          placeholder="Price"
          type="number"
          min="0.00"
          step="0.01"
          onChange={handleInput}
          value={product.price}
          required
        />
        <Form.Field
          control={Input}
          name="media"
          label="Media"
          content="Select Image"
          accept="image/*"
          type="file"
          onChange={handleInput}
          required
        />
      </Form.Group>
      <Image src={mediaPreview} rounded centered size="small"/>
      <Form.Field
        control={TextArea}
        name="description"
        label="Description"
        placeholder="Description"
        onChange={handleInput}
        value={product.description}
        required
      />
      <Form.Field
        control={Button}
        type="Submit"
        name="submit"
        content="Submit"
        color="blue"
        icon="pencil alternate"
        disabled={disabled || loading}
      />
    </Form>
  </>);
}

export default CreateProduct;
