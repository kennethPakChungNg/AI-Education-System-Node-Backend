import dotenv from 'dotenv';
import * as thetajs from "@thetalabs/theta-js";
import {
    createPreSignedURl,
    uploadVideo,
    checkUploadStatus,
    getVideoPlayUrl
} from "../../../app/utils/thetaUtils"
const fs = require('fs');

before(function() {
    // Load environment variables from .env file
    dotenv.config();
});

describe("Theta functions", function() {
    this.timeout(10000)
    //RPC
    const provider = new thetajs.providers.HttpProvider(thetajs.networks.ChainIds.Testnet);
    it(' Get wallet details ', async()=>{
        const blockNumber = await provider.getBlockNumber()
        console.log(blockNumber)

        /*
        const account = await provider.getAccount("0x6C663A86191A8b8aC1654d0C29B162A0Df0A7C23")
        console.log(JSON.stringify(account))
        */
    })

    it.skip( 'Create video presigned URL' , async()=>{
        const result = await createPreSignedURl();
        console.log( JSON.stringify(result) )
    })

    it.skip("Upload a Video using the pre-signed URL", async()=>{
        const file= 'C:/Users/user/Videos/Captures/ELDEN RING.mp4';
        const fileStream = fs.createReadStream(file);

        const uploadResult = await uploadVideo(fileStream, "test0002");

        console.log(uploadResult)
    })
    
    it.skip("Get upload status",async () => {
        const videoId = 'video_xwfmnw1cqf23c6u5v01183mzhn'

        const uploadStatus = await checkUploadStatus(videoId)

        console.log(JSON.stringify(uploadStatus))
    })

    it("Get url of video player", async()=>{
        const videoId = 'video_xwfmnw1cqf23c6u5v01183mzhn'

        const uploadStatus = await getVideoPlayUrl(videoId)

        console.log(JSON.stringify(uploadStatus))
    })
})

/*
describe('Avalanche trans', function() {
    this.timeout(10000)
    it.skip( 'Connect RPC provider', async ()=>{
        const rpcProvider = await getRpcProvider(AVAX_RPC_URL);

        const wallet = await getWallet(ContractOwner_privateKey)

        const signer = getSigner(wallet, rpcProvider);
    })

    it.skip(' Get wallet details ', async()=>{
        try{
            const address = "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae"
            const receiverInfo = await getWalletDtls( address, false, "to")    

            //console.log( JSON.stringify(receiverInfo) )

            notStrictEqual(receiverInfo['balance'], null, 'Value should not be null');
            notStrictEqual(receiverInfo['lastPageTrans'], null, 'Value should not be null');
            notStrictEqual(receiverInfo['min_value_received'], null, 'Value should not be null');
            notStrictEqual(receiverInfo['walletAnaData'].time_diff_mins, null, 'Value should not be null');
    
        }catch (error){
            console.log(error.message)
            throw error
        }
    })

    it.skip('Get wallet txs list from avacloud ', async ()=>{
        try{
            const address = "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae"
        
            const response = await requestTxnListAvaCloud(address)
    
            //console.log( `${JSON.stringify(Object.keys(response))}` )
            console.log( `${JSON.stringify(response.length)}` )
        }catch (error){
            console.log(error.message)
            throw error
        }

    })
})
*/