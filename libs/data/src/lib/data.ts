export interface Todo{
  title: string;
  description: string;
  status: Status
}

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}

export const VALIDATIONS = {
  TITLE:{
    min: 10,
    max: 120
  },
  DESCRIPTION: {
    min: 100,
    max: 1000
  }
}