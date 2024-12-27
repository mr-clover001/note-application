export interface Note {
  _id?: number; // Optional 'id' for newly created notes
  title: string;
    content: string;
    category: string;
    createdAt?:string
}