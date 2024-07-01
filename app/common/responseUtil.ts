const httpStatus = require("http-status");
const errorMsg = require("./errors")
var xml2js = require('xml2js'); 

const jsonResponse = (res,{ status, data = {}, error = new Error("") }) => {
  if (status !== httpStatus.OK && status !== httpStatus.FOUND && status !== httpStatus.CREATED) {
    return res.status(status).send(
      { success: false, error: error.message, data }
    );
  } else {
    return res.status(status).send(
      { success: true, error: error.message, data }
    );
  }
};

const xmlResponse = ( res, { status, data = {}, error = errorMsg.DEFAULT } ) => {

    let response = null;
    if (status !== httpStatus.OK && status !== httpStatus.FOUND && status !== httpStatus.CREATED) {
        response =  {  error: error };
    } else {
        response =  {  data: data };
    }
    var builder = new xml2js.Builder( { headless: false, renderOpts: { pretty: true }  });
    const xmlResponse = builder.buildObject(response);
    res.set( 'Content-Type', 'text/xml');
    return res.status(status).send(
        xmlResponse
    );

}


const directResponse= ( res, { status, data = {}, error = errorMsg.DEFAULT } ) => {

    let response = null;
    if (status !== httpStatus.OK && status !== httpStatus.FOUND && status !== httpStatus.CREATED) {
        response =  {  error: error };
    } else {
        response =  data;
    }

    res.set( 'Content-Type', 'text/xml');
    return res.status(status).send(
        response
    );
}

export {jsonResponse, xmlResponse, directResponse};
