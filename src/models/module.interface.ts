
export interface Module {
  name: string;
  authName: string;
  picture: string;
  bChildModule: boolean;
  examTime: number;
  singleCount: number;
  multiCount: number;
  judgeCount: number;
  logicCount: number;
  passScore: number;
  bDisabled: boolean;
  orderBy: number;
  bOpen: true;
  id: number;
  ownerId: number;
  lastUpdatedById: number;
  parentModuleId: number;
  createdAt: string;
  updatedAt: string;
}
