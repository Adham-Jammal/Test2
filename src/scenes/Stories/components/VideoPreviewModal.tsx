/* eslint-disable */
import React from 'react';
import { Modal } from 'antd';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './storyVideo.css';

interface VideoPreviewProps {
  videoUrl?: string;
  visible: boolean;
  handleCancel: () => void;
}
const VideoPreviewModal: React.FC<VideoPreviewProps> = ({
  videoUrl,
  visible,
  handleCancel,
}): JSX.Element => {
  return (
    <Modal
      visible={visible}
      title={L('StoryVideo')}
      onCancel={handleCancel}
      centered
      destroyOnClose
      maskClosable={false}
      width="60%"
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      {videoUrl && (
        <video style={{ margin: '0 auto' }} width="100%" height="450" controls>
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      )}
    </Modal>
  );
};

export default VideoPreviewModal;
