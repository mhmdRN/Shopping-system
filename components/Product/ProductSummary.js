import {Item,Label} from 'semantic-ui-react'
import AddProductToCart from './AddProductToCart'

function ProductSummary({name,price,_id,sku,mediaUrl,user}) {
  return (
    <Item.Group>
      <Item>
      <Item.Image size='medium' src={mediaUrl} />
      <Item.Content>
        <Item.Header>{name}</Item.Header>
        <Item.Description>
          <p>{price}$</p>
          <Label>Barcode: {sku}</Label>
        </Item.Description>
      <Item.Extra>
      <AddProductToCart user={user} productId={_id}/>
      </Item.Extra>
      </Item.Content>
      </Item>
    </Item.Group>
  );
}

export default ProductSummary;
