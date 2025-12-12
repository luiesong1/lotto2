import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useMutation } from '@apollo/client';
import {
  UploadAdvertisementImageResponse,
  UPLOAD_ADVERTISEMENT_IMAGE,
} from 'graphql/mutation';
import { AdType } from 'pages/Ad/Ad';
import Loader from 'components/Loader';

interface Props {
  file: AdType[];
  setFile: React.Dispatch<React.SetStateAction<AdType[]>>;
  idx: number;
  disabled: boolean;
}

export const AdUploadBox = ({ idx, setFile, file, disabled }: Props) => {
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
      uploadImage({
        variables: {
          file: e.file,
        },
      });
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

  const [uploadImage, { loading: uploadLoading }] =
    useMutation<UploadAdvertisementImageResponse>(UPLOAD_ADVERTISEMENT_IMAGE, {
      onCompleted: (data) => {
        setFile((prev) => {
          prev[idx].image = data.uploadAdvertisementImage;
          return [...prev];
        });
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    });

  useEffect(() => {
    if (file[idx].image.length) {
      setState({
        ...state,
        fileList: [
          {
            uid: '-1',
            name: file[idx].image,
            status: 'done',
            url: `${process.env.REACT_APP_ADVERTISEMENT_URL}/${file[idx].image}`,
          },
        ],
      });
    }
  }, []);

  return (
    <>
      {uploadLoading && <Loader />}
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
