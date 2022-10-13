/* eslint-disable */
import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { Upload, message } from 'antd';
import { L } from '../../i18next';
import AppConsts from '../../lib/appconst';
import './index.less';

export interface IEditableImageProps {
  onSuccess?: (fileName: string) => void;
  onRemove?: () => void;
  defaultFileList?: Array<any>;
  allowedExtensions?: string;
}
export interface IEditableImageState {
  isUploading: boolean;
  isUploaded: boolean;
}

class EditableImage extends Component<IEditableImageProps, IEditableImageState> {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isUploading: false,
    isUploaded: false,
  };

  fileList: Array<UploadFile> = [];

  componentDidMount() {
    const { defaultFileList } = this.props;
    if (defaultFileList && defaultFileList!.length > 0) {
      this.setState({ isUploaded: true });
    }
  }

  isValidImageType(file: any) {
    return (
      file.type === 'image/jpg' ||
      file.type === 'application/pdf' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp'
    );
  }

  isValidImageSize(file: any): boolean {
    return file.size / 1024 / 1024 < 3; // < 3MB
  }

  validateImage = (file: any) => {
    const isValidImageType = this.isValidImageType(file);
    if (!isValidImageType) {
      message.error(L('FileTypeNotSupported'));
    }

    const isLt5M = this.isValidImageSize(file);
    if (!isLt5M) {
      message.error(L('FileSizeExceedsTheLimit'));
    }

    return isValidImageType && isLt5M;
  };

  handleBeforeUpload = (file: any) => {
    return this.validateImage(file);
  };

  handleFileListChanges() {
    const { fileList } = this;
    // Read from response and show file link
    this.fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.result.url;
      }
      return file;
    });
    this.forceUpdate();
  }

  onEditableImageChange = (info: any) => {
    this.fileList = [...info.fileList];
    const { onSuccess } = this.props;

    if (info.file.status === 'uploading') {
      this.setState({ isUploading: true });
      return;
    }
    this.handleFileListChanges();

    if (info.file.status === 'removed') {
      this.setState({ isUploaded: false });
    }
    if (info.file.status === 'done') {
      this.setState({ isUploading: false, isUploaded: true });
      message.success(`${info.file.name} ${L('FileUploadedSuccessfully')}`);
      if (onSuccess) onSuccess!(info.file.response.result.url);
    } else if (info.file.status === 'error') {
      this.setState({ isUploading: false });
      message.error(`${info.file.name} ${L('FileUploadFailed')}`);
    }
  };

  uploadProps = {
    action: AppConsts.uploadImageEndpoint,
    headers: {
      authorization: `bearer ${localStorage.getItem('Abp.AuthToken')}`,
    },
    accept:
      this.props.allowedExtensions !== undefined
        ? this.props.allowedExtensions
        : '.png, .jpg, .jpeg, .webp',
    beforeUpload: this.handleBeforeUpload,
  };

  render() {
    const { defaultFileList, onRemove } = this.props;
    const { isUploaded, isUploading } = this.state;
    return (
      <div>
        <div>
          {defaultFileList && defaultFileList!.length > 0 ? (
            <Upload
              {...this.uploadProps}
              listType="picture-card"
              defaultFileList={defaultFileList}
              onChange={this.onEditableImageChange}
              onRemove={onRemove}
            >
              {isUploaded || isUploading ? null : <PlusOutlined />}
            </Upload>
          ) : (
            <Upload
              {...this.uploadProps}
              listType="picture-card"
              defaultFileList={[]}
              onChange={this.onEditableImageChange}
              onRemove={onRemove}
            >
              {isUploaded || isUploading ? null : <PlusOutlined />}
            </Upload>
          )}
        </div>
      </div>
    );
  }
}

export default EditableImage;
