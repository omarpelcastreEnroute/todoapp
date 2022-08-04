export interface Todo{
  title: string;
  description: string;
  status: Status
}

export enum Status {
  PENDING = 'Pending',
  IN_PROGRESS = 'In progress',
  DONE = 'Done',
}