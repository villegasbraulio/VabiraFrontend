import { IUserProfile } from './user-profile.interface';

export interface ILoginResponseUser {
  id: number;
  username: string;
  email: string;
  password: string;
  image?: string;
  profileUser: IUserProfile[];
}
