import axios from 'axios';

const API_BASE_URL = '/loginusername';

  let getResp = async  () =>{
    let results =[];
    let promise = 
     await  axios.get('/loginusername',{headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'application/json',
    }});
    return promise.data;
  };
 let   login =  () => {
  try {
    let resp ='';

       getResp().then((data) => {resp= data; console.log(' Promise Response is ',resp);return resp; });
      
     return resp;
  } catch (error) {
    throw error;
  }
};

 // export default login;
export default login;
