/* eslint-disable */
import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { L } from '../../../i18next';

const { Dragger } = Upload;

export interface IUploadProps {
  onDrop?: (e: any) => void;
  onChange?: (info: any) => void;
  multiple?: boolean;
  name?: string;
  mediaType?: number;
  action?: string;
  headers?: any;
  accept?: string;
  setURL?: (value: any) => void;
  beforeUpload?: (file: any) => boolean;
}

const UploadMedia: React.FC<IUploadProps> = (props: any) => {
  const isValidType = (file: any) => {
    if (props.mediaType === 1) {
      return file.type === 'video/mp4' || file.type === 'video/x-ms-wmv';
    } else if (props.mediaType === 2) {
      return file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    } else {
      return (
        file.type === 'audio/mpeg' ||
        file.type === 'audio/x-wav' ||
        file.type === 'audio/x-aiff' ||
        file.type === 'audio/x-aiff' ||
        file.type === 'audio/mpeg,' ||
        file.type === 'audio/x-ms-wma'
      );
    }
  };

  const handleBeforeUpload = (file: any) => {
    const isValid = isValidType(file);
    if (!isValid) {
      message.error(L('FileTypeNotSupported'));
    }

    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error(L('FileSizeExceedsTheLimit'));
    }

    return isValid && isLt3M;
  };
  const props2: IUploadProps = {
    name: 'file',
    multiple: false,
    accept:
      props.mediaType === 1
        ? 'video/mp4, video/x-ms-wmv'
        : props.mediaType === 2
        ? 'image/png, image/jpeg, image/webp'
        : 'audio/mpeg, audio/x-wav, audio/x-aiff, audio/x-aiff, audio/mpeg, audio/x-ms-wma',
    action: props.action,
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      const { status } = info.file;
      //   if (status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      //   }
      if (status === 'done') {
        message.success(`${info.file.name} ${L('FileUploadedSuccessfully')}`);
        props.setURL(info.file.response.result.url);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${L('FileUploadFailed')}`);
      }
    },
    // onDrop(e) {
    //   console.log('Dropped files', e.dataTransfer.files[0]);
    // },
    headers: {
      authorization: `bearer ${localStorage.getItem('Abp.AuthToken')}`,
    },
  };
  return (
    <div className="media-uploader">
      <Dragger {...props2}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Dragger>
    </div>
  );
};

export default UploadMedia;
