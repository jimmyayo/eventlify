import {RootStore} from './rootStore';
import UserStore from './userStore';
import { observable, action, reaction } from 'mobx';

export default class CommonStore {
   rootStore: RootStore;
   
   constructor(rootStore: RootStore) {
      this.rootStore = rootStore;

      // this code will "react" to any change to this.token
      reaction(
         () => this.token,
         token => {
            if (token) {
               window.localStorage.setItem('jwt', token);
            } else {
               window.localStorage.removeItem('jwt');
            }
         }
      )
   }

   @observable token: string | null= window.localStorage.getItem('jwt');
   @observable appLoaded: boolean = false;

   @action setToken = (token: string | null) => {
      window.localStorage.setItem('jwt', token!);
      this.token = token;
   }

   @action setAppLoaded = () => {
      this.appLoaded = true;
   }
}