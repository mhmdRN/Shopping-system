import React from "react";
import {Divider,Segment,Button} from "semantic-ui-react"
import calculateCartTotal from "../../utils/calculateCartTotal";
import StripeCheckout from 'react-stripe-checkout'

function CartSummary({products,handleCheckout,success}) {
  const [cartIsEmpty,setCartIsEmpty]=React.useState(false)
  const [cartTotal,setCartTotal]=React.useState(0)
  const [stripeTotal,setStripeTotal]=React.useState(0)
  React.useEffect(()=>{
    const {cartTotal,stripeTotal}=calculateCartTotal(products)
    setCartTotal(cartTotal)
    setStripeTotal(stripeTotal)
    setCartIsEmpty(products.length === 0)
  },[products])
  return (<>
    <Divider/>
    <Segment clearing>
      <strong>Sub Total:</strong> {cartTotal}$
      <StripeCheckout
        name="React Reserve"
        amount={stripeTotal}
        image={products.length >0?products[0].product.mediaUrl:""}
        currency="USD"
        shippingAddress={true}
        billingAddress={true}
        zipCode={false}
        token={handleCheckout}
        triggerEvent="onClick"
        stripeKey="pk_test_51Jst8NHTdgxlPxS3FxW4r5CmelTyL1ibRsTyUmvSd4Lz05QpTxfmfOJFEMIFvZaMl4oBaSLDgjlF5tpkP9k3dQNe0004nJGrXy"
      >
      <Button
        icon="cart"
        color="teal"
        floated="right"
        content="Checkout"
        disabled={cartIsEmpty || success}
      />
      </StripeCheckout>
    </Segment>
  </>);
}

export default CartSummary;
