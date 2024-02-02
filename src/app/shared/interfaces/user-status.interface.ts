import { IUserStatusType } from './user-status-type.interface';

export interface IUserStatus {
  id: number;
  statusRegistrationDateTime: string;
  userStatusType: IUserStatusType;
}
