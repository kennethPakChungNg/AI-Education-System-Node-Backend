
import { Quiz } from "./model/Quiz";

//retake quiz base on 

//gen quiz at the first time, with what user learned
const saveQuizToDb = async(data)=>{
    try{
        const returnFromDb = await Quiz.create(data);
        return returnFromDb;
      }catch(error){
        if (error.code === 11000){
          throw new Error(`Duplicate education conversation data detected. Emitted by user ${data['WalletAddress']} `)
        }else{
          throw error;
        }
      }
}

export {
    saveQuizToDb
}