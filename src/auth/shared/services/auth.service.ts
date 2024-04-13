import axios from 'axios';
// import config from '../../../../assets/config/config';
export const signUp = (form: any) => { ;
    axios.post(process.env.REACT_APP_API_URL+'/register/',form)
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