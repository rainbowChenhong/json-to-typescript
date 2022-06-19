


export  interface Data {
  id: number;
  tenantId: number;
  name: string;
  tag: number;
  describes: string;
  
}
export  interface RootObject {
  totalCount: number;
  pageNo: number;
  pageSize: number;
  data: Data[];
  
}