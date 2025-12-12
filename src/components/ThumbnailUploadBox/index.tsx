import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, notification } from 'antd';
import { BroadCastInfoType } from 'pages/Operation/Live';
import { useMutation } from '@apollo/client';
import {
  UploadBroadcastInfoImageResponse,
  UPLOAD_BROADCAST_INFO_IMAGE,
} from 'graphql/mutation';
import { UploadFile } from 'antd/lib/upload/interface';
import Loader from 'components/Loader';

interface Props {
  setFile: React.Dispatch<BroadCastInfoType>;
  file: BroadCastInfoType;
  disabled: boolean;
}

export const ThumbnailUploadBox = ({ setFile, file, disabled }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isBeforeUpload, setIsBeforeUpload] = useState(true);
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
      uploadImage({
        variables: {
          file: e.file,
        },
      });
      setIsBeforeUpload(() => false);

      setState({ ...state, fileList: e.fileList });
    } catch (e: any) {
      notification.error({ message: e.message });
    }
  };

  const handleRemove = (e: UploadFile<any>) => {
    const removeIndex = state.fileList.findIndex((v) => v.uid === e.uid);
    const tempArr = state.fileList.filter((_v, i) => i !== removeIndex);

    setState({ ...state, fileList: tempArr });
    setFile({
      ...file,
      thumbnail: '',
    });
    return false;
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

  const [uploadImage, { loading: uploadLoading }] =
    useMutation<UploadBroadcastInfoImageResponse>(UPLOAD_BROADCAST_INFO_IMAGE, {
      onCompleted: (data) => {
        setFile({
          ...file,
          thumbnail: data.uploadBroadcastInfoImage,
        });
      },
    });

  useEffect(() => {
    setState({
      ...state,
      fileList: file.thumbnail.length
        ? [
            {
              uid: '-1',
              name: file.thumbnail,
              status: 'done',
              url: `${process.env.REACT_APP_BROADCAST_URL}/${file.thumbnail}`,
            },
          ]
        : [],
    });
  }, [file.thumbnail]);

  return (
    <>
      {uploadLoading && <Loader />}
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        beforeUpload={() => false}
        fileList={state.fileList}
        maxCount={1}
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
