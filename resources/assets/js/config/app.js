
import axios from 'axios';
const api = axios.create({
  baseURL: __app.baseURL + "/api"
});


export function errorResponseHandler(error) {
  if(error.response.status == 419){
      location.reload();
  }
  else if(error.response.status == 401){
      location.href = __app.routeBaseURL + "/login"
  }
  return error.response.data;
}
export function successResponseHandler(response) {
  if(response.data.redirect){
      location.replace(__app.baseURL + response.data.redirect);
  }
  return response.data;
}

// apply interceptor on request
// api.interceptors.request.use(
//   config => {
//     config.data = stringifyDates(_.cloneDeep(config.data));
//     return config;
//   }
// );

// apply interceptor on response
api.interceptors.response.use(
 response => successResponseHandler(response),
 error => errorResponseHandler(error)
);

api.uploadTempFile = (file, _data)=>{
  let data = new FormData();
  data.append('temp', file, file.name);
  _.forEach(_data, (value, key)=>{
    data.append(key, value);
  })
  return api.post("/media/raw", data, {
    headers: { 'content-type': 'multipart/form-data'}
  });
}

api.uploadTempImage = (file, _data)=>{
  let data = new FormData();
  data.append('temp', file, file.name);
  _.forEach(_data, (value, key)=>{
    data.append(key, value);
  })
  return api.post("/media/raw-image", data, {
    headers: { 'content-type': 'multipart/form-data'}
  });
}

api.login = function(data){return api.post('login', data);}
api.logout = function(){return api.post('/logout');}

export default api;