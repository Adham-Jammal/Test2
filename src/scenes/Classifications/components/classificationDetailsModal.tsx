/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Avatar } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import ImageModel from '../../../components/ImageModal';
import localization from '../../../lib/localization';
import './classificationDetailsModal.css';
import ClassificationStore from '../../../stores/classificationStore';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';

export interface IClassificationDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  classificationStore: ClassificationStore;
}

@inject(Stores.ClassificationStore)
@observer
class ClassificationDetailsModal extends React.Component<IClassificationDetailsModalProps, any> {
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
    const { classificationModel } = this.props.classificationStore!;

    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        width="60%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="classification-details-modal">
          <div className="details-wrapper">
            <div className="detail-wrapper">
              <span className="detail-label">{L('ArName')}</span>
              <span className="detail-value">
                {classificationModel !== undefined ? classificationModel.arName : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('EnName')}</span>
              <span className="detail-value">
                {classificationModel !== undefined ? classificationModel.enName : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Category')}</span>
              <span className="detail-value">
                {classificationModel !== undefined ? classificationModel.category.text : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('IsActive')}</span>
              <span className="detail-value">
                {classificationModel !== undefined && classificationModel.isActive ? (
                  <Tag color="green">{L('Active')}</Tag>
                ) : (
                  <Tag color="red">{L('Inactive')}</Tag>
                )}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('Events')}</span>
              <span className="detail-value">
                {classificationModel !== undefined && classificationModel.events.length > 0
                  ? classificationModel.events.map((item: LiteEntityDto) => {
                      return (
                        <Tag key={item.value} color="default" className="classification-name">
                          {item.text}
                        </Tag>
                      );
                    })
                  : L('NotAvailable')}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Image')}</span>
              <span className="detail-value">
                {classificationModel !== undefined ? (
                  <div
                    onClick={() =>
                      this.openImageModal(classificationModel.imageUrl!, classificationModel.enName)
                    }
                    style={{ display: 'inline-block', cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={50} src={classificationModel.imageUrl} />
                  </div>
                ) : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('ProductsCount')}</span>
              <span className="detail-value">
                {classificationModel !== undefined ? classificationModel.productsCount : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('OrdersCount')}</span>
              <span className="detail-value">
                {classificationModel !== undefined ? classificationModel.ordersCount : undefined}
              </span>
            </div>
          </div>
        </div>
        <ImageModel
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

export default ClassificationDetailsModal;
