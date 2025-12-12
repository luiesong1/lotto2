import { useMutation } from '@apollo/client';
import { notification } from 'antd';
import Loader from 'components/Loader';
import {
  UploadNoticeImageParams,
  UploadNoticeImageResponse,
  UPLOAD_NOTICE_IMAGE,
} from 'graphql/mutation';
import useResizeHandler from 'hooks/useHandleResize';
import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  isNotice?: boolean;
};

export function Editor({ state, setState, isNotice }: Props) {
  const { isMobile } = useResizeHandler();
  const quillRef = useRef<ReactQuill>();
  const handleImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      const file = input.files?.length ? input.files[0] : null;
      if (file) {
        uploadNoticeImage({
          variables: {
            file,
          },
        });
      }
    });
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        // 툴바에 넣을 기능들을 순서대로 나열하면 된다.
        container: [
          [{ size: ['small', false, 'large', 'huge'] }, { color: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
            { align: [] },
          ],
          [isNotice ? 'image' : undefined, 'link'],
        ],
        handlers: {
          image: handleImage,
        },
      },
    }),
    [],
  );

  const [uploadNoticeImage, { loading }] = useMutation<
    UploadNoticeImageResponse,
    UploadNoticeImageParams
  >(UPLOAD_NOTICE_IMAGE, {
    onCompleted: (data) => {
      const IMG_URL = `${process.env.REACT_APP_NOTICE_IMAGE_URL}/${data.uploadNoticeImage}`;
      const range = quillRef.current?.getEditor().getSelection()?.index ?? 0;
      if (range > -1) {
        let quill = quillRef.current?.getEditor();
        quill?.setSelection(range, 1);

        quill?.clipboard.dangerouslyPasteHTML(
          range,
          `<p class="ql-align-center"><img src=${IMG_URL} alt="이미지 태그가 삽입됩니다." /></p>`,
        );
      }
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  return (
    <>
      {loading && <Loader />}
      <ReactQuill
        ref={(element) => {
          if (element !== null) {
            quillRef.current = element;
          }
        }}
        modules={modules}
        style={{
          width: '100%',
          height: '300px',
          marginBottom: `${isMobile ? '50px' : ''}`,
        }}
        value={state}
        onChange={setState}
      />
    </>
  );
}
