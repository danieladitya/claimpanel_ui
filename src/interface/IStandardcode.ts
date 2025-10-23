import { IBaseListResponse, IBaseResponse } from './IBaseResponse';

  export interface IStandardcode {
    standardcode_id: string
    is_active: number
    update_date: any
    created_date: string
    standardcode_name: string
    parent_id: string
    tag_property: any
  }
  

export interface IStandardcodeListResponse 
    extends IBaseListResponse<IStandardcode> {}

export interface IStandardcodeResponse
    extends IBaseResponse<IStandardcode> {}