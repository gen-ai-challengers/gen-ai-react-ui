import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const environment = process.env.REACT_APP_ENVIRONMENT;
export const sendToDetectionEndpoint = (form: any) => { debugger;
    axios.post('http://127.0.0.1:5000/api/v1/face/recognize',form)
    .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
}