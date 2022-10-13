/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Avatar } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import ImageModel from '../../../components/ImageModal';
import localization from '../../../lib/localization';
import './newsDetailsModal.css';
import NewsStore from '../../../stores/newsStore';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';

export interface INewsDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  newsStore: NewsStore;
}

@inject(Stores.NewsStore)
@observer
class NewsDetailsModal extends React.Component<INewsDetailsModalProps, any> {
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
    const { newsModel } = this.props.newsStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width="80%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <div className="classification-details-modal">
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('ArName')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? newsModel.arTitle : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnName')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? newsModel.enTitle : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ArDescription')}</span>
                <span
                  className="detail-value"
                  dangerouslySetInnerHTML={{
                    __html: newsModel !== undefined ? newsModel.arDescription : '',
                  }}
                >
                  {/* {newsModel !== undefined ? newsModel.arDescription : undefined} */}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnDescription')}</span>
                <span
                  className="detail-value"
                  dangerouslySetInnerHTML={{
                    __html: newsModel !== undefined ? newsModel.enDescription : '',
                  }}
                >
                  {/* {newsModel !== undefined ? newsModel.enDescription : undefined} */}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnSourceName')}</span>
                <span className="detail-value">
                  {newsModel !== undefined && newsModel.enSourceName
                    ? newsModel.enSourceName
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ArSourceName')}</span>
                <span className="detail-value">
                  {newsModel !== undefined && newsModel.arSourceName
                    ? newsModel.arSourceName
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('SourceLogo')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? (
                    <div
                      onClick={() => this.openImageModal(newsModel.sourceLogo!, newsModel.title)}
                      style={{ display: 'inline-block', cursor: 'zoom-in' }}
                    >
                      <Avatar shape="square" size={50} src={newsModel.sourceLogo} />
                    </div>
                  ) : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ViewsCount')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? newsModel.viewsCount : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('LikesCount')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? newsModel.likesCount : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('SavedCount')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? newsModel.savedCount : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('CommentsCount')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? newsModel.commentsCount : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Category')}</span>
                <span className="detail-value">
                  {newsModel !== undefined && newsModel.category
                    ? newsModel.category.name
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Image')}</span>
                <span className="detail-value">
                  {newsModel !== undefined ? (
                    <div
                      onClick={() => this.openImageModal(newsModel.imageUrl!, newsModel.title)}
                      style={{ display: 'inline-block', cursor: 'zoom-in' }}
                    >
                      <Avatar shape="square" size={50} src={newsModel.imageUrl} />
                    </div>
                  ) : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Cities')}</span>
                <span className="detail-value">
                  {newsModel !== undefined && newsModel.cities && newsModel.cities.length > 0
                    ? newsModel.cities.map((city: any) => (
                        <Tag key={`${city.value}`} className="ant-tag-disable-pointer">
                          {city.text}
                        </Tag>
                      ))
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Tags')}</span>
                <span className="detail-value">
                  {newsModel !== undefined && newsModel.tags && newsModel.tags.length > 0
                    ? newsModel.tags.map((tag: string) => (
                        <Tag key={`${tag}`} className="ant-tag-disable-pointer">
                          {tag}
                        </Tag>
                      ))
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('FromDate')}</span>
                <span className="detail-value">
                  {newsModel !== undefined
                    ? moment(newsModel.fromDate).format(timingHelper.defaultDateFormat)
                    : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('ToDate')}</span>
                <span className="detail-value">
                  {newsModel !== undefined
                    ? moment(newsModel.toDate).format(timingHelper.defaultDateFormat)
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('CreationDate')}</span>
                <span className="detail-value">
                  {newsModel !== undefined
                    ? moment(newsModel.creationTime).format(timingHelper.defaultDateTimeFormat)
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('IsActive')}</span>
                <span className="detail-value">
                  <Tag
                    color={newsModel !== undefined && newsModel.isActive ? 'green' : 'volcano'}
                    className="ant-tag-disable-pointer"
                  >
                    {newsModel !== undefined && newsModel.isActive ? L('Active') : L('Inactive')}
                  </Tag>
                </span>
              </div>
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

export default NewsDetailsModal;
