import {
  IIndividualPerson,
  ILegalPerson,
} from 'src/app/shared/user-data.interfaces';
import { IUserProfile } from './user-profile.interface';
import { IUserStatus } from './user-status.interface';

export interface IRegisterResponse {
  id: number;
  username: string;
  email: string;
  password: string;
  image?: string;
  userStatus: IUserStatus;
  userProfile: IUserProfile[];
  individualPerson?: IIndividualPerson;
  legalPerson?: ILegalPerson;
}
