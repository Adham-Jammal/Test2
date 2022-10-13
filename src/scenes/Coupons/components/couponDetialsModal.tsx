/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './couponDetailsModal.css';
import CouponStore from '../../../stores/couponStore';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';

export interface ICouponDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  couponStore?: CouponStore;
}

@inject(Stores.CouponStore)
@observer
class CouponDetailsModal extends React.Component<ICouponDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;
    const { couponModel } = this.props.couponStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        width="70%"
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
                {couponModel !== undefined ? couponModel.id : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Code')}:</span>
              <span className="detail-value">
                {couponModel !== undefined ? couponModel.code : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('DiscountPercentage')}:</span>
              <span className="detail-value">
                {couponModel !== undefined ? couponModel.discountPercentage : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('MaxTotalUseCount')}:</span>
              <span className="detail-value">
                {couponModel !== undefined ? couponModel.maxTotalUseCount : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('MaxClientUseCount')}:</span>
              <span className="detail-value">
                {couponModel !== undefined ? couponModel.maxClientUseCount : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Shop')}:</span>
              <span className="detail-value">
                {couponModel !== undefined && couponModel.shop !== null
                  ? couponModel.shop?.name
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('IsFreeShipping')}:</span>
              <span className="detail-value">
                <Tag
                  color={
                    couponModel !== undefined && couponModel.isFreeShipping ? 'green' : 'volcano'
                  }
                  className="ant-tag-disable-pointer"
                >
                  {couponModel !== undefined && couponModel.isFreeShipping ? L('Yes') : L('No')}
                </Tag>
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Status')}:</span>
              <span className="detail-value">
                <Tag
                  color={couponModel !== undefined && couponModel.isExpired ? 'magenta' : 'success'}
                  className="ant-tag-disable-pointer"
                >
                  {couponModel !== undefined && couponModel.isExpired
                    ? L('Expired')
                    : L('UnExpired')}
                </Tag>
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Clients')}:</span>
              <span className="detail-value">
                {couponModel !== undefined && couponModel.clients && couponModel.clients.length > 0
                  ? couponModel.clients.map((item: LiteEntityDto) => {
                      return (
                        <Tag key={item.value} color="default" className="classification-name">
                          {item.text}
                        </Tag>
                      );
                    })
                  : L('ForAllClients')}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Classifications')}:</span>
              <span className="detail-value">
                {couponModel !== undefined &&
                couponModel.classifications &&
                couponModel.classifications.length > 0
                  ? couponModel.classifications.map((item: LiteEntityDto) => {
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
              <span className="detail-label">{L('StartDate')}:</span>
              <span className="detail-value">
                {couponModel !== undefined
                  ? moment(couponModel.startDate).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('EndDate')}:</span>
              <span className="detail-value">
                {couponModel !== undefined
                  ? moment(couponModel.endDate).format(timingHelper.defaultDateFormat)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('EventOrganizerInfo')}:</span>
              <span className="detail-value">
                {couponModel !== undefined && couponModel.eventOrganizerInfo
                  ? couponModel.eventOrganizerInfo
                  : L('NotAvailable')}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('CreatedBy')}:</span>
              <span className="detail-value">
                {couponModel !== undefined && couponModel.createdBy
                  ? couponModel.createdBy
                  : L('NotAvailable')}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('CreationDate')}:</span>
              <span className="detail-value">
                {couponModel !== undefined && couponModel.creationTime
                  ? moment(couponModel.creationTime).format(timingHelper.defaultDateFormat)
                  : L('NotAvailable')}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CouponDetailsModal;
