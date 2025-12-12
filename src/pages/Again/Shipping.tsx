import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined';
import { useMutation } from '@apollo/client';
import { Button, Divider, Input, Upload, Table, notification } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import TransformBox from 'components/TransformBox';
import {
  UpdateRegistrationInfoForSendGiftParams,
  UpdateRegistrationInfoForSendGiftResponse,
  UPDATE_REGISTRATION_INFO_FOR_SEND_GIFT,
} from 'graphql/mutation/again';
import useResizeHandler from 'hooks/useHandleResize';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { shippingResultColumns, ShippingResultType } from 'utils/columns';
import * as Xlsx from 'xlsx';
import * as S from './style';

type ShippingType = {
  name: string;
  nickname: string;
  phone: string;
};

export function Shipping() {
  const [isTryUpload, setIsTryUpload] = useState(false);
  const [datas, setDatas] = useState<ShippingType[]>([]);
  const [fileName, setFileName] = useState('');
  const [shippingResultData, setShippingResultData] = useState<
    ShippingResultType[]
  >([]);

  const roles = useRecoilValue(rolesState);

  const { isMobile } = useResizeHandler();

  const handleUpload = (e: UploadChangeParam<UploadFile<any>>) => {
    const reader = new FileReader();
    const file = e.fileList[0].originFileObj as Blob;
    reader.onload = function () {
      let data = reader.result;
      let workBook = Xlsx.read(data, { type: 'binary' });
      workBook.SheetNames.forEach(function (sheetName) {
        let rows = Xlsx.utils.sheet_to_json(workBook.Sheets[sheetName]);

        if (rows.length > 0) {
          const arr: ShippingType[] = rows.map((v: any) => {
            return {
              name: v.이름.toString(),
              nickname: v.닉네임.toString(),
              phone: v.전화번호.toString().replaceAll('-', ''),
            };
          });
          setDatas(arr);
        }
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleSampleDownload = () => {
    const ws = Xlsx.utils.aoa_to_sheet([
      ['이름', '닉네임', '전화번호'],
      ['홍길동', '번쩍홍길동', '010-1234-1234'],
    ]);
    const wb = Xlsx.utils.book_new();

    Xlsx.utils.book_append_sheet(wb, ws);
    Xlsx.writeFile(wb, `발송내역 샘플.xlsx`);
  };

  const [uploadShipping, { loading }] = useMutation<
    UpdateRegistrationInfoForSendGiftResponse,
    UpdateRegistrationInfoForSendGiftParams
  >(UPDATE_REGISTRATION_INFO_FOR_SEND_GIFT, {
    onCompleted: (data) => {
      setShippingResultData(data.updateRegistrationInfoForSendGift);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    if (isTryUpload) {
      if (!datas.length) {
        return notification.error({
          message: '엑셀파일을 샘플파일 형식에 맞춰주세요.',
        });
      }
      uploadShipping({
        variables: {
          datas,
        },
      });
    }
  }, [datas]);

  return (
    <>
      <Divider>발송내역 업로드</Divider>
      <S.UploadContainer>
        {roles.includes('WRITE_REGISTRATION_INFO') ||
          (roles.includes('MASTER') && (
            <TransformBox
              alignItems={isMobile ? 'flex-start' : 'center'}
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <h3
                style={{
                  margin: isMobile ? '' : '0',
                  marginRight: 10,
                }}
              >
                파일 가져오기
              </h3>
              <Upload
                accept=".xlsx"
                onChange={(e) => {
                  setIsTryUpload(true);
                  setFileName(e.file.name);
                  handleUpload(e);
                }}
                showUploadList={false}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Input
                  disabled
                  style={{
                    width: 150,
                  }}
                  value={fileName}
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginLeft: 10,
                  }}
                >
                  업로드
                </Button>
              </Upload>
            </TransformBox>
          ))}
        <TransformBox justifyContent="flex-start" marginTop="30px">
          <Button
            style={{
              borderColor: 'green',
              color: 'green',
            }}
            onClick={handleSampleDownload}
          >
            샘플 다운로드
          </Button>
        </TransformBox>
      </S.UploadContainer>
      <Divider />
      {isTryUpload && (
        <Table
          scroll={{ x: 800 }}
          columns={shippingResultColumns}
          dataSource={shippingResultData}
          pagination={false}
          loading={loading}
        />
      )}
    </>
  );
}
