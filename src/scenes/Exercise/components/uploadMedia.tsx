/* eslint-disable */
import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { L } from '../../../i18next';
import AppConsts from '../../../lib/appconst';

const { Dragger } = Upload;

export interface IUploadProps {
  onDrop?: (e: any) => void;
  onChange?: (info: any) => void;
  multiple?: boolean;
  name?: string;
  mediaType?: number;
  headers?: any;
  accept?: string;
  action?: string;
  setURL?: (value: any) => void;
  beforeUpload?: (file: any) => boolean;
}

const UploadMedia: React.FC<IUploadProps> = (props: any) => {
  const [uploadAction, setAction] = useState<string>('');
  const isValidType = (file: any) => {
    if (file.type === 'video/mp4' || file.type === 'video/x-ms-wmv') {
      setAction(AppConsts.uploadVideoEndpoint);
      return true;
    } else if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp'
    ) {
      setAction(AppConsts.uploadImageEndpoint);
      return true;
    }
    return false;
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
    accept: 'video/mp4, video/x-ms-wmv, image/png, image/jpeg, image/webp',
    action: uploadAction + '',
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
    <div className="media-uploader excer">
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
