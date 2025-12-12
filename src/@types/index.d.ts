type IsPaginationBaseParams = {
  take: number;
  skip: number;
};

type IsSearchTextBaseParams = {
  searchText?: string;
} & IsPaginationBaseParams;

type KindType = {
  id: number;
  name: string;
};
