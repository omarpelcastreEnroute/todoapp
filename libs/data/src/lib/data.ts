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