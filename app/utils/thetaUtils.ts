
import axios,{
    AxiosResponse
} from "axios"
import logger from "../common/logger"


const createPreSignedURl = async()=>{

    const {THETA_VIDEO_APIKEY, THETA_VIDEO_SECRET} = process.env

    logger.info("Create Theta video presigned URL. ")
    const url = "https://api.thetavideoapi.com/upload";
    const headers =  {
        'x-tva-sa-id': THETA_VIDEO_APIKEY,
        'x-tva-sa-secret': THETA_VIDEO_SECRET
    }
    const requestBody = {
    }

    let response :AxiosResponse = null;


    response = await axios.post(url,requestBody, {headers} );

    if ( response.status == 200 ){
        logger.info( "Successfully created presigned url." )
        return response.data.body.uploads[0]
    }else{
        logger.error("Thtea API: Got problems on creating presigned video URL, please contact administrator.")
        return {}
    }
}

const uploadVideo = async( videoContent, fileName )=>{

    const {THETA_VIDEO_APIKEY, THETA_VIDEO_SECRET} = process.env
    const preSignedUrlReturn = await createPreSignedURl();

    //data required from presigned url 
    
    const service_account_id = THETA_VIDEO_APIKEY;
    const uploadId = preSignedUrlReturn.id
    
        
    const url = preSignedUrlReturn.presigned_url

    const headers =  {
        'Content-Type': 'application/octet-stream'
    }



    let response :AxiosResponse = null;

    response = await axios.put(url,videoContent, {headers} );

    if( response.status == 200 ){
        logger.info( "Successfully created presigned url." )


        const transCodeResult =await transcodeVideo(uploadId, fileName)
        return transCodeResult
    }else{
        logger.error("Thtea API: Got problems on creating presigned video URL, please contact administrator.")
        return {}
    }
}

const transcodeVideo = async( uploadId, fileName )=>{
    const {THETA_VIDEO_APIKEY, THETA_VIDEO_SECRET} = process.env
    const url = "https://api.thetavideoapi.com/video"
    const headers = {
        'x-tva-sa-id': THETA_VIDEO_APIKEY,
        'x-tva-sa-secret': THETA_VIDEO_SECRET,
        'Content-Type': 'application/json'
    }

    const requestBody = {
        "source_upload_id": uploadId ,
        "playback_policy":"public",
        "nft_collection":"0x5d0004fe2e0ec6d002678c7fa01026cabde9e793",
        "file_name": fileName,
        "metadata":{
            "key": "name"
        }
    }
    let response :AxiosResponse = null;

    response = await axios.post(url,requestBody, {headers} );

    if( response.status == 200 ){
        logger.info( "Successfully created presigned url." )
        return response.data.body.videos[0]
    }else{
        logger.error("Thtea API: Got problems on creating presigned video URL, please contact administrator.")
        return {}
    }
}

const checkUploadStatus = async ( videoId ) =>{
    const {THETA_VIDEO_APIKEY, THETA_VIDEO_SECRET} = process.env
    const url = `https://api.thetavideoapi.com/video/${videoId}`
    const headers = {
        'x-tva-sa-id': THETA_VIDEO_APIKEY,
        'x-tva-sa-secret': THETA_VIDEO_SECRET
    }

    let response :AxiosResponse = null;

    response = await axios.get(url, {headers} );

    if( response.status == 200 ){
        logger.info( `Successfully get upload status of video ${videoId}` )

        const videoDetail = response.data.body.videos[0]
        if (videoDetail.status = 'success'){
            logger.info(`Video ${videoId} successfully uploaded.`)
        }
        return response.data.body.videos[0]
    }else{
        logger.error("Thtea API: Got problems on creating presigned video URL, please contact administrator.")
        return {}
    }
}

const getVideoPlayUrl = async( videoId )=>{
    const videoInfo = await checkUploadStatus(videoId);

    return videoInfo.player_uri
}

/**
 * API DOC: 
https://stablediff4iyhcwpqix-6670bfbd7069b5ac.tec-s1.onthetaedgecloud.com?view=api
 * @param prompt 
 */
const genImageFromText = async( prompt )=>{
    
}

export {
    createPreSignedURl,
    uploadVideo,
    checkUploadStatus,
    getVideoPlayUrl
}