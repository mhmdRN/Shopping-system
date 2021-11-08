import mongoose from "mongoose";
const connection={
    isConnected:''
};
async function connectDb(){
    
    if(connection.isConnected){
        console.log("Using existing connection")
        return;
    }
    const db=await mongoose.connect(process.env.MONGO_SRV,{
        useUnifiedTopology: true
    })
    console.log("DB connected")
    connection.isConnected=db.connections[0].readyState;
}
export default connectDb;