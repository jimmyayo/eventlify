export interface IProfile {
   displayName: string,
   userName: string,
   bio: string,
   image: string,
   photos: IPhoto[],
   following: boolean,
   followersCount: number,
   followingCount: number
}

export interface IPhoto {
   id: string,
   url: string,
   isMain: boolean
}