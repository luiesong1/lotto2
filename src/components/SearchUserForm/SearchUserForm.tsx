import { useLazyQuery } from '@apollo/client';
import { AutoComplete, Input, notification, Form } from 'antd';
import {
  SearchUserByAdminParams,
  SearchUserByAdminResponse,
  SEARCH_USER_BY_ADMIN,
} from 'graphql/query';

import React, { useState } from 'react';
import { UserType } from 'utils/columns';

type AutoCompleteResult = {
  label: string;
  value: string;
};

type Props = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchUserForm({ setEmail }: Props) {
  const [result, setResult] = useState<AutoCompleteResult[]>();
  const [user, setUser] = useState<UserType[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchUser({
      variables: {
        searchText: e.target.value,
      },
    });
  };
  const [searchUser] = useLazyQuery<
    SearchUserByAdminResponse,
    SearchUserByAdminParams
  >(SEARCH_USER_BY_ADMIN, {
    onCompleted: (data) => {
      const arr: AutoCompleteResult[] = [];
      setUser(data.searchUserByAdmin);
      data.searchUserByAdmin.map((v) => {
        return arr.push({
          label: `${v.nickname} - ${v.name}`,
          value: v.nickname,
        });
      });
      setResult(arr);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <AutoComplete
      options={result}
      notFoundContent={'Not Found'}
      onSelect={(v: any) =>
        setEmail(user.find((v2) => v === v2.nickname)?.email ?? '')
      }
    >
      <Input
        allowClear
        placeholder="검색어(아이디(이메일), 닉네임, 이름)"
        onChange={handleSearch}
      />
    </AutoComplete>
  );
}
