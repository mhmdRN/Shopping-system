import React from 'react'
import axios from 'axios'
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';
import ProductPagination from '../components/Index/ProductPagination';
function Home({products,totalPages }) {
  
  return (<>
    <ProductList products={products}/>
    <ProductPagination totalPages={totalPages}/></>);
  
}
Home.getInitialProps= async (ctx) =>{
  const page=ctx.query.page?ctx.query.page:"1";
  const size=9;  
  const url=`${baseUrl}/api/products`;
  const payload={params:{page,size}}
  const data =await axios.get(url,payload);
  
  return data.data;
  
}
export default Home;
