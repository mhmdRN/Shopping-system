
import { useRouter } from "next/router";
import {Header,Segment,Button, Icon, Item, Message} from "semantic-ui-react"
function CartItemList({products,user,handleRemoveFromCart,success}) {
  const router=useRouter();
  function mapCartProductsToItems(products){
    return products.map(prod=>({
      childkey:prod.product._id,
      header:(
        <Item.Header as="a" onClick={()=>router.push(`/product?_id=${prod.product._id}`)}>
          {prod.product.name}
        </Item.Header>
      ),
      image:prod.product.mediaUrl,
      meta:`${prod.quantity} x ${prod.product.price}`,
      fluid:"true",
      extra:(
        <Button
          basic
          floated="right"
          icon="remove"
          onClick={()=>handleRemoveFromCart(prod.product._id)}
        />
      )
    }))
  }
  if(success){
    return(
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    )
  }
  if(products.length === 0){
  return (
      <Segment secondary color="teal" textAlign="center" inverted placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No products in your cart. Add some!
        </Header>
        <div>
          {user ? (
            <Button color="orange" onClick={()=>router.push('/')}>View Products</Button>
          ):(
            <Button color="blue" onClick={()=>router.push('/login')}>Log in to Add Products</Button>
          )}
        </div>
      </Segment>
    );
  }
  return <Item.Group divided items={mapCartProductsToItems(products)}/>
}

export default CartItemList;
