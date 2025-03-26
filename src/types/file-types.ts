export interface INode {
  id: string;
  type: "directory" | "file";
  name: string;
  children?: string[]; // file or directory ids
}
