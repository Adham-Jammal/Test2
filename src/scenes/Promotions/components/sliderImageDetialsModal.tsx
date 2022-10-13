/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Avatar } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './sliderImageDetailsModal.css';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import SliderImageStore from '../../../stores/sliderImageStore';
import ImageModal from '../../../components/ImageModal';

export interface ISliderImageDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  sliderImageStore?: SliderImageStore;
}

@inject(Stores.SliderImageStore)
@observer
class SliderImageDetailsModal extends React.Component<ISliderImageDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };
  state = {
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  render() {
    const { visible } = this.props;
    const { SliderImageModel } = this.props.sliderImageStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="details-modal">
          <div className="details-wrapper">
            <div className="detail-wrapper">
              <span className="detail-label">{L('ID')}:</span>
              <span className="detail-value">
                {SliderImageModel !== undefined ? SliderImageModel.id : L('NotAvailable')}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Shop')}:</span>
              <span className="detail-value">
                {SliderImageModel !== undefined ? SliderImageModel.shopId : L('NotAvailable')}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Image')}:</span>
              <span className="detail-value">
                {SliderImageModel !== undefined ? (
                  <div
                    onClick={() =>
                      this.openImageModal(SliderImageModel.imageUrl!, SliderImageModel.shopId + '')
                    }
                    style={{ display: 'inline-block', cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={50} src={SliderImageModel.imageUrl} />
                  </div>
                ) : (
                  L('NotAvailable')
                )}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('StartDate')}:</span>
              <span className="detail-value">
                {SliderImageModel !== undefined
                  ? moment(SliderImageModel.startDate).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('EndDate')}:</span>
              <span className="detail-value">
                {SliderImageModel !== undefined
                  ? moment(SliderImageModel.endDate).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('Status')}:</span>
              <span className="detail-value">
                <Tag
                  color={
                    SliderImageModel !== undefined && SliderImageModel.isActive
                      ? 'green'
                      : 'volcano'
                  }
                  className="ant-tag-disable-pointer"
                >
                  {SliderImageModel !== undefined && SliderImageModel.isActive
                    ? L('Active')
                    : L('Inactive')}
                </Tag>
              </span>
            </div>
          </div>
        </div>
        <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
      </Modal>
    );
  }
}

export default SliderImageDetailsModal;
