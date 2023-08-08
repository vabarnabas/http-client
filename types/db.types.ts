export type DatabaseType = "PG";

export interface Database {
  id: string;
  name: string;
  method: DatabaseType;
  url: string;
}
