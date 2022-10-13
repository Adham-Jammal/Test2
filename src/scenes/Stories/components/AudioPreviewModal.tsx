/* eslint-disable */
import React from 'react';
import { Modal } from 'antd';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './storyVideo.css';

interface AudioPreviewProps {
  audioUrl?: string;
  visible: boolean;
  handleCancel: () => void;
}
const AudioPreviewModal: React.FC<AudioPreviewProps> = ({
  audioUrl,
  visible,
  handleCancel,
}): JSX.Element => {
  return (
    <Modal
      visible={visible}
      title={L('StoryAudio')}
      onCancel={handleCancel}
      centered
      destroyOnClose
      maskClosable={false}
      width="60%"
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      {audioUrl && (
        <audio style={{ margin: '0 auto' }} controls>
          <source src={audioUrl} />
          Your browser does not support the video tag.
        </audio>
      )}
    </Modal>
  );
};

export default AudioPreviewModal;
