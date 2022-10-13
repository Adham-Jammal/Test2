/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './shopManagerDetailsModal.css';
import ShopManagerStore from '../../../stores/shopmanagerStore';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { UserStatus } from '../../../lib/types';

export interface IShopManagerDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  shopManagerStore: ShopManagerStore;
}

@inject(Stores.ShopManagerStore)
@observer
class ShopManagerDetailsModal extends React.Component<IShopManagerDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };

  resolveStatus = (status: number) => {
    switch (status) {
      case UserStatus.Active:
        return (
          <Tag color={'green'} className="ant-tag-disable-pointer">
            {L('Active')}
          </Tag>
        );
      case UserStatus.Blocked:
        return (
          <Tag color={'red'} className="ant-tag-disable-pointer">
            {L('Blocked')}
          </Tag>
        );
      case UserStatus.Inactive:
        return (
          <Tag color={'volcano'} className="ant-tag-disable-pointer">
            {L('Inactive')}
          </Tag>
        );
    }
    return null;
  };

  render() {
    const { visible } = this.props;
    const { shopManagerModel } = this.props.shopManagerStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
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
          <div className="shopManager-details-modal">
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('ShopName')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.shopName : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('JoinDate')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined
                    ? moment(shopManagerModel.joinDate).format(timingHelper.defaultDateFormat)
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Email')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.emailAddress : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('PhoneNumber')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.phoneNumber : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('City')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.city?.text : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Categories')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined && shopManagerModel.categories.length > 0 ? (
                    shopManagerModel.categories.map((item: LiteEntityDto) => {
                      return (
                        <Tag key={item.value} color="default" className="classification-name">
                          {item.text}
                        </Tag>
                      );
                    })
                  ) : (
                    <div>{L('ThereAreNotCategories')}</div>
                  )}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ProductsCount')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.productsCount : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('OrdersCount')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.ordersCount : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('TotalIncome')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined ? shopManagerModel.totalIncome : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('Status')}:</span>
                <span className="detail-value">
                  {shopManagerModel !== undefined && shopManagerModel.status !== undefined
                    ? this.resolveStatus(shopManagerModel.status)
                    : undefined}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ShopManagerDetailsModal;
