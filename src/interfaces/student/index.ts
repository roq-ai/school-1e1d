import { UserInterface } from 'interfaces/user';
import { SchoolInterface } from 'interfaces/school';
import { GetQueryInterface } from 'interfaces';

export interface StudentInterface {
  id?: string;
  name: string;
  attendance?: number;
  academic_record?: number;
  behavior_record?: number;
  health_record?: number;
  user_id?: string;
  school_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  school?: SchoolInterface;
  _count?: {};
}

export interface StudentGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
  school_id?: string;
}
