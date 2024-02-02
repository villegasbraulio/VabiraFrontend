
import { IProfileAccess } from './profile-access';
import { IProfileType } from './profile-type.interface';

export interface IProfile {
  id: number;
  name: string;
  accessProfile: IProfileAccess[];
}

