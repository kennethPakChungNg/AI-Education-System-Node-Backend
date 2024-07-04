import {UserBackground} from './models/UserBackground'
import {logger} from '../common'


const saveUserBackground = async (data) => {
	try {
	  const searchByWallet = {
		"WalletAddress": data.WalletAddress
	  };
	  const accountExist = await queryUserBackground(searchByWallet);
  
	  let returnFromDb;
	  if (accountExist.length > 0) {
		// Update existing document
		returnFromDb = await UserBackground.findOneAndUpdate(
		  searchByWallet,
		  { $set: data },
		  { new: true, omitUndefined: true }
		);
	  } else {
		// Insert new document
		returnFromDb = await UserBackground.create(data);
	  }
  
	  return returnFromDb;
	} catch (error) {
	  console.error('Error in saveUserBackground:', error);
	  throw error;
	}
  };

const queryUserBackground = async (filter) => {
	try {
		const returnFromDb = await UserBackground.find(filter);
        return returnFromDb;
	}catch (error) {
		throw new error(`Error from saveUserBackground: ${error.stack}`)
	}
};

export {
    saveUserBackground,
    queryUserBackground
}