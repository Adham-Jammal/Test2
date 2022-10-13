import * as React from 'react';
import { Modal, Button, Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './offerDetailsModal.css';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import OffersStore from '../../../stores/offersStore';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import ThousandSeparator from '../../../components/ThousandSeparator';

export interface IOfferDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  offerStore: OffersStore;
}

@inject(Stores.OffersStore)
@observer
class OfferDetailsModal extends React.Component<IOfferDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;
    const { offerModel } = this.props.offerStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
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
              <span className="detail-label">{L('StartDate')}:</span>
              <span className="detail-value">
                {offerModel !== undefined
                  ? moment(offerModel.startDate).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('EndDate')}:</span>
              <span className="detail-value">
                {offerModel !== undefined
                  ? moment(offerModel.endDate).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('Type')}:</span>
              <span className="detail-value">
                <Tag color={'processing'} className="ant-tag-disable-pointer">
                  {offerModel !== undefined && offerModel.type === 0
                    ? L('ForOrder')
                    : L('ForProduct')}
                </Tag>
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('CreationDate')}:</span>
              <span className="detail-value">
                {offerModel !== undefined
                  ? moment(offerModel.creationTime).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('DiscountPercentage')}:</span>
              <span className="detail-value">
                {offerModel !== undefined ? offerModel.percentage + '%' : undefined}
              </span>
            </div>
            {offerModel !== undefined && offerModel.type === 0 ? (
              <div className="detail-wrapper">
                <span className="detail-label">{L('OrderedMinValue')}:</span>
                <span className="detail-value">
                  {offerModel !== undefined ? (
                    <ThousandSeparator number={offerModel.orderMinValue} />
                  ) : undefined}{' '}
                  {L('SAR')}
                </span>
              </div>
            ) : (
              <div className="detail-wrapper">
                <span className="detail-label">{L('Products')}:</span>
                <span className="detail-value">
                  {offerModel !== undefined && offerModel.products.length > 0
                    ? offerModel.products.map((item: LiteEntityDto) => {
                        return (
                          <Tag key={item.value} color="default" className="classification-name">
                            {item.text}
                          </Tag>
                        );
                      })
                    : L('NotAvailable')}
                </span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default OfferDetailsModal;
