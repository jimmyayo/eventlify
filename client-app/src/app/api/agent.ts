import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivityEnvelope } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';


axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(
   (config) => {
      const token = window.localStorage.getItem('jwt');
      if (token) config.headers.Authorization = `Bearer ${token}`;

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
)

axios.interceptors.response.use(
   undefined, // <--- onFulfilled
   error => { // <--- onRejected
      if (error.message.toUpperCase() === 'NETWORK ERROR' && !error.response) {
         toast.error('Network error - make sure API server is online!');
      }
      const { status, data, config } = error.response;

      if (status === 404) {
         history.push('/notfound');
      }
      if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
         history.push('/notfound');
      }
      if (status === 500) {
         toast.error('Server 500 error - check terminal for more info');
      }
      throw error.response;
   });

const responseBody = (response: AxiosResponse) => response.data;
const sleep = (ms: number) => (response: AxiosResponse) =>
   new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


const requests = {
   get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
   post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
   put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
   delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
   postForm: (url: string, file: Blob) => {
      let formData = new FormData();
      formData.append('File', file);
      return axios.post(url, formData, {
         headers: { 'Content-type': 'multipart/form-data' }
      }).then(responseBody)
   }
}

const Activities = {
   list: (params: URLSearchParams): Promise<IActivityEnvelope> =>
      axios.get('/activities', {params: params}).then(sleep(1000)).then(responseBody),
   //requests.get(`/activities?limit=${limit}&offset=${page ? page * limit! : 0}`),
   details: (id: string) => requests.get(`/activities/${id}`),
   create: (activity: IActivity) => requests.post('/activities', activity),
   update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
   delete: (id: string) => requests.delete(`/activities/${id}`),
   attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
   unattend: (id: string) => requests.delete(`/activities/${id}/attend`)
}

const User = {
   current: (): Promise<IUser> => requests.get('/user'),
   login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login/`, user),
   register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register/`, user)
}

const Profiles = {
   get: (userName: string): Promise<IProfile> => requests.get(`/profiles/${userName}`),
   uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
   setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
   deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
   updateProfile: (profile: Partial<IProfile>) => requests.put('/profiles', profile),
   follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}),
   unfollow: (username: string) => requests.delete(`/profiles/${username}/follow`),
   listFollowings: (username: string, predicate: string) =>
      requests.get(`/profiles/${username}/follow?predicate=${predicate}`)
}

export default {
   Activities,
   User,
   Profiles
}