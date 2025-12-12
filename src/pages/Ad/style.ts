import styled from 'styled-components';
import { PRIMARY } from 'styles/colors';

export const SaveButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
`;

export const UploadWordsBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${PRIMARY};
  margin-top: 30px;
  height: 200px;
  padding: 10px;
`;

export const UploadTitle = styled.span`
  font-size: 24px;
`;

export const SmallTableContainer = styled.div`
  width: 45%;
  margin-bottom: 30px;
`;

export const SizeTipText = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
