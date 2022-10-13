/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Avatar, Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import ImageModel from '../../../components/ImageModal';
import FoodCategoryStore from '../../../stores/foodCategoryStore';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import './categoryDetailsModal.css';
export interface ICategoryDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  foodCategoryStore: FoodCategoryStore;
}

@inject(Stores.FoodCategoryStore)
@observer
class CategoryDetailsModal extends React.Component<ICategoryDetailsModalProps, any> {
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
    const { categoryModel } = this.props.foodCategoryStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width="60%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="category-details-modal">
          <div className="details-wrapper">
            <div className="detail-wrapper">
              <span className="detail-label">{L('ArName')}:</span>
              <span className="detail-value">
                {categoryModel !== undefined ? categoryModel.arTitle : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('EnName')}:</span>
              <span className="detail-value">
                {categoryModel !== undefined ? categoryModel.enTitle : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('Image')}:</span>
              <span className="detail-value image">
                {categoryModel !== undefined ? (
                  <div
                    onClick={() =>
                      this.openImageModal(categoryModel.imageUrl!, categoryModel.enTitle)
                    }
                    style={{ display: 'inline-block', cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={50} src={categoryModel.imageUrl} />
                  </div>
                ) : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('CreationDate')}:</span>
              <span className="detail-value">
                {categoryModel !== undefined
                  ? moment(categoryModel.creationTime).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('IsActive')}:</span>
              <span className="detail-value">
                <Tag
                  color={
                    categoryModel !== undefined && categoryModel.isActive ? 'green' : 'volcano'
                  }
                  className="ant-tag-disable-pointer"
                >
                  {categoryModel !== undefined && categoryModel.isActive
                    ? L('Active')
                    : L('Inactive')}
                </Tag>
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

export default CategoryDetailsModal;
