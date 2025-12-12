import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

interface Props {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export const LogoUploadBoxOnModal = ({ setFile, file }: Props) => {
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
      setFile(e.fileList[0].originFileObj);
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
    setFile(undefined);

    return false;
  };

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
