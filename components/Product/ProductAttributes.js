import axios from 'axios';
import React from 'react';
import {useRouter} from 'next/router'
import {Button,Header,Modal} from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl';
function ProductAttributes({description,_id,user}) {
  const isAdmin=user && user.role==='admin'
  const isRoot=user && user.role==='root'
  const isRootORisAdmin=isAdmin || isRoot
  const [modal,setModal]=React.useState(false)
  const router=useRouter();
  async function handleDelete(){
    const url=`${baseUrl}/api/product`;
    const payload={ params: { _id }};
    await axios.delete(url,payload);
    router.push("/");
  }
  return (
    <>
      <Header as="h3">About this Product</Header>
      <p>{description}</p>
      {isRootORisAdmin &&<><Button 
        icon="trash alternate outline"
        content="Delete Product"
        color="red"
        onClick={()=>setModal(true)}
        />
      <Modal open={modal} dimmer="blurring">
        <Modal.Header>Confirm delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="grey"
            content="Cancel"
            onClick={()=>setModal(false)}
          />
          <Button
            color="red"
            icon="trash"
            labelPosition="right"
            content="Delete"
            onClick={handleDelete}
          />
        </Modal.Actions>
      </Modal></>}
    </>
  );
}

export default ProductAttributes;
