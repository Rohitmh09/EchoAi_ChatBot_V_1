import dotenv from "dotenv";

  dotenv.config();

 const conf =
 {
     api_Key: String(process.env.AI_API_KEY),
     api_Url: String(process.env.AI_API_URL),
     port:String(process.env.PORT),

     echoAI_Host: String(process.env.AI_DB_HOST),
     echoAI_Username: String(process.env.AI_DB_USER),
     echoAI_Password: String(process.env.AI_DB_PASSWORD),
     echoAI_Database: String(process.env.AI_DB_NAME),
     echoAI_Secret_Key: String(process.env.AI_DB_JWT_SECRET_KEY),
 } 

 export default conf;