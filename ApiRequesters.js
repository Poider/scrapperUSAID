async function sendRequest(url, method = 'GET', data = null) {
    try {
      const options = {
        method: method,
     
        body: data ? JSON.stringify(data) : null,
      };
  
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  



  

//   

async function main(){

const encodedQ = 'cHVyY2hhc2luZyBwb3dlciB6YW1iaWEgMjAyMA%3D%3D'

const ApiUrl = 'https://dec.usaid.gov/api/qsearch.ashx?q=' + encodedQ +'&rtype=JSON';

const scndApi = 'https://data.usaid.gov/resource/sf8i-fzzw.json'

const response = await sendRequest(scndApi);

console.log(response);

}


main();