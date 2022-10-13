import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import _ from 'lodash';
import { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { L } from '../../i18next';
import AppConstants from '../../lib/appconst';

interface IUploadImageProps extends UploadProps {
  onUploadComplete: (result: string) => void;
  onRemoveFile: (result: string) => void;
  currentCount: number;
  fileTypes: string[];
  maxSizeInMB?: number;
  files?: string[];
  isMultiple?: boolean;
  fileName: string;
}

const CustomUpload: React.FC<IUploadImageProps> = ({
  onRemoveFile,
  onUploadComplete,
  currentCount,
  maxSizeInMB,
  accept = '*',
  fileTypes = [],
  children,
  listType = 'text',
  files,
  isMultiple = false,
  fileName = 'File',
}): JSX.Element => {
  //   const [multiple, setMultiple] = useState<boolean>(false);
  const [count, setCount] = useState<number>(currentCount);
  const [fileList, setFileList] = useState<any>([]);
  let uploadFileList: Array<UploadFile> = [];

  useEffect(() => {
    if (files && !_.isNull(files) && _.isArray(files) && files.length > 0) {
      if (isMultiple) {
        const newFiles = files.map((file: string, index: number) => ({
          uid: index.toString(),
          name: `${fileName}${index}`,
          status: 'done',
          url: file,
          thumbUrl: file,
        }));
        setFileList(newFiles);
      } else {
        setFileList([
          {
            uid: '1',
            name: `${fileName}`,
            status: 'done',
            url: files?.[0],
            thumbUrl: files?.[0],
          },
        ]);
      }
    } else {
      setFileList([]);
    }
  }, [files]);

  // check file type  based on props
  const checkFileType = (fileType: string) => {
    if (_.isArray(fileTypes) && !_.isEmpty(fileTypes) && fileTypes.indexOf(fileType) !== -1) {
      return true;
    }
    return false;
  };

  // validate file size based on props
  const isValidFileSize = (file: any): boolean | void => {
    if (maxSizeInMB) {
      return file.size / 1024 / 1024 < maxSizeInMB;
    }
  };

  // validate file
  const validateFile = (file: any) => {
    const isValidFileType = checkFileType(file.type);
    if (!isValidFileType) {
      message.error(L('FileTypeNotSupported'));
    }
    const isValidSize = maxSizeInMB && maxSizeInMB > 0 ? isValidFileSize(file.size) : true;
    if (!isValidSize) {
      message.error(L('FileSizeExceedsTheLimit'));
    }

    return (isValidFileType && isValidSize) || Upload.LIST_IGNORE;
  };

  // handle file before upload
  const handleBeforeUpload = (file: any): boolean | string => validateFile(file);

  // handle file list changes
  const handleFileListChanges = (): void => {
    // Read from response and show file link
    uploadFileList = uploadFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    // setFileList(newFileList);
  };

  // handle remove file
  const handleRemove = (info: any): void => {
    if (info?.url) {
      onRemoveFile(info.url);
    } else {
      onRemoveFile(info?.response?.result?.url);
    }
    setCount((prevCount) => prevCount - 1);
  };

  // handle change  file
  const handleChange = (info: any) => {
    uploadFileList = [...info.fileList];
    if (info?.file?.status !== 'removed') {
      const isValidFile = validateFile(info.file);
      const isValidSize = maxSizeInMB && maxSizeInMB > 0 ? isValidFileSize(info.file) : true;
      if (!isValidFile && !isValidSize) {
        // empty files list if file is not valid
        uploadFileList = new Array<UploadFile>();
        return;
      }
      handleFileListChanges();
    }
    if (info.file.status === 'done') {
      onUploadComplete(info.file.response.result.url);
      message.success(`${info.file.name} ${L('FileUploadedSuccessfully')}`);
      setCount((prevCount) => prevCount + 1);
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name} ${L('FileUploadFailed')}`);
    }
  };

  const uploadProps = {
    action: AppConstants.uploadImageEndpoint,
    headers: {
      authorization: `bearer ${localStorage.getItem('Abp.AuthToken')}'`,
    },
    beforeUpload: handleBeforeUpload,
    onChange: handleChange,
    accept,
  };

  return (
    <Upload {...uploadProps} listType={listType} defaultFileList={fileList} onRemove={handleRemove}>
      {count >= 15 ? null : children}
    </Upload>
  );
};

export default React.memo(CustomUpload);
