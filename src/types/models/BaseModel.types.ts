import { Types } from 'mongoose';

export interface IBaseModel {
  name: string;
  _id: Types.ObjectId;
  __v?: number;
}
