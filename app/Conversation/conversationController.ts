
import { EducateConversation } from "./model/conversation"

const saveEducateConversation = async(data)=>{
  try{
    const returnFromDb = await EducateConversation.create(data);
    return returnFromDb;
  }catch(error){
    if (error.code === 11000){
      throw new Error(`Duplicate education conversation data detected. Emitted by user ${data['WalletAddress']} `)
    }else{
      throw error;
    }
  }
}

const queryEducateConversation = async (filter={}) => {
	try {
		const returnFromDb = await EducateConversation
      .find(filter)
      .sort({ ConversationTimestamp: 1 });
    return returnFromDb;
	}catch (error) {
		throw new error(`Error from queryEducateConversation: ${error.stack}`)
	}
};

export {
  saveEducateConversation,
  queryEducateConversation
}