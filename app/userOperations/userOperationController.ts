import {UserBackground} from './models/UserBackground'
import {logger} from '../common'
import { isNull } from 'util';

const saveUserBackground = async (data) => {
	try {
		//insert or update
		const searchByWallet = {
			"WalletAddress": data.WalletAddress
		};
		const accountExist = await queryUserBackground( searchByWallet );

		let returnFromDb = {};
		if ( accountExist.length > 0){
			//update
			returnFromDb = await UserBackground.findOneAndUpdate(searchByWallet, data);
		}else{
			returnFromDb = await UserBackground.collection.insertOne(data);
		}
		

		 
        return data;
	}catch (error) {
		throw new error(`Error from saveUserBackground: ${error.stack}`)
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