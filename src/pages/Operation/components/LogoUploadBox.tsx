import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

import { FileType, Partnership } from '../PartnershipList';

interface Props {
  file: Partnership[];
  setFile: React.Dispatch<React.SetStateAction<Partnership[]>>;
  idx: number;
  disabled: boolean;
  setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
}

export const LogoUploadBox = ({
  idx,
  setFile,
  file,
  disabled,
  setFiles,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<{
    previewImage: string;
    previewVisible: boolean;
    previewTitle: string;
    fileList: UploadFile[];
  }>({
    previewImage: '',
    previewVisible: false,
    previewTitle: '',
    fileList: [],
  });

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  }

  const handleChange = (e: any) => {
    try {
      const isLt2M = e.file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        throw Error('Image must smaller than 2MB!');
      }
      setState({ ...state, fileList: e.fileList });
      setFiles((prev) => [
        ...prev,
        { file: e.fileList[0].originFileObj, id: file[idx].id },
      ]);
    } catch (e: any) {
      notification.error({ message: e.message });
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  const handleCancel = () => setState({ ...state, previewVisible: false });

  const handleRemove = (file: UploadFile<any>) => {
    const removeIndex = state.fileList.findIndex((v) => v.uid === file.uid);
    const tempArr = state.fileList.filter((_v, i) => i !== removeIndex);

    setState({ ...state, fileList: tempArr });
    setFile((prev) => {
      prev[idx].image = '';
      return [...prev];
    });
    return false;
  };

  useEffect(() => {
    if (file[idx].image.length) {
      setState({
        ...state,
        fileList: [
          {
            uid: '-1',
            name: file[idx].image,
            status: 'done',
            url: `${process.env.REACT_APP_PARTNERSHIP_IMAGE_URL}/${file[idx].image}`,
          },
        ],
      });
    }
  }, []);

  return (
    <>
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        onChange={handleChange}
        onPreview={handlePreview}
        fileList={state.fileList}
        onRemove={handleRemove}
        maxCount={1}
        beforeUpload={() => false}
        accept="image/*"
        disabled={disabled}
      >
        {uploadButton}
      </Upload>
      <Modal
        visible={state.previewVisible}
        title={state.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={state.previewImage} />
      </Modal>
    </>
  );
};
