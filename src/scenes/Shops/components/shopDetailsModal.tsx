/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Image } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './shopDetailsModal.css';
import ShopStore from '../../../stores/shopStore';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import { ShopBankDto } from '../../../services/shops/dto/shopDto';

export interface IShopDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  shopStore: ShopStore;
}

@inject(Stores.ShopStore)
@observer
class ShopDetailsModal extends React.Component<IShopDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;
    const { shopModel } = this.props.shopStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        width="90%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <div className="shop-modal">
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('ArName')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.arName : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnName')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.enName : undefined}
                </span>
              </div>
              {shopModel !== undefined && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('ArLogoImage')}:</span>

                  <span className="detail-value">
                    {shopModel.arLogoUrl ? (
                      <Image className="shop-logo" src={shopModel.arLogoUrl} />
                    ) : (
                      L('NotAvailable')
                    )}
                  </span>
                </div>
              )}
              {shopModel !== undefined && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('EnLogoImage')}:</span>

                  <span className="detail-value">
                    {shopModel.enLogoUrl ? (
                      <Image className="shop-logo" src={shopModel.enLogoUrl} />
                    ) : (
                      L('NotAvailable')
                    )}
                  </span>
                </div>
              )}
              {shopModel !== undefined && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('ArCoverImage')}:</span>

                  <span className="detail-value">
                    {shopModel.arCoverUrl ? (
                      <Image className="shop-cover" src={shopModel.arCoverUrl} />
                    ) : (
                      L('NotAvailable')
                    )}
                  </span>
                </div>
              )}
              {shopModel !== undefined && (
                <div className="detail-wrapper image">
                  <span className="detail-label">{L('EnCoverImage')}:</span>

                  <span className="detail-value">
                    {shopModel.enCoverUrl ? (
                      <Image className="shop-cover" src={shopModel.enCoverUrl} />
                    ) : (
                      L('NotAvailable')
                    )}
                  </span>
                </div>
              )}

              <div className="detail-wrapper">
                <span className="detail-label">{L('ArDescription')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.arDescription
                    ? shopModel.arDescription
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnDescription')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.enDescription
                    ? shopModel.enDescription
                    : L('NotAvailable')}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('City')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.city?.text : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Email')}:</span>
                <span className="detail-value">{shopModel !== undefined && shopModel.email}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Categories')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined
                    ? shopModel.categories.map((item: LiteEntityDto) => {
                        return (
                          <Tag key={item.value} color="default" className="classification-name">
                            {item.text}
                          </Tag>
                        );
                      })
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Banks')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined
                    ? shopModel.banks.map((item: ShopBankDto) => {
                        return (
                          <Tag key={item.bankId} color="default" className="classification-name">
                            {item.bankName}
                          </Tag>
                        );
                      })
                    : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('ManagerName')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.name : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ManagerEmail')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined && shopModel.manager
                    ? shopModel.manager.emailAddress
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ManagerPhoneNumber')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined
                    ? shopModel.ownerCountryCode + '' + shopModel.ownerPhoneNumber
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('ProductsCount')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.productsCount : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('FollowersCount')}:</span>
                <span className="detail-value">{shopModel ? shopModel.followersCount : 0}</span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('OrdersCount')}:</span>
                <span className="detail-value">
                  {shopModel !== undefined ? shopModel.ordersCount : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('IsActive')}:</span>
                <span className="detail-value">
                  <Tag
                    color={shopModel !== undefined && shopModel.isActive ? 'green' : 'volcano'}
                    className="ant-tag-disable-pointer"
                  >
                    {shopModel !== undefined && shopModel.isActive ? L('Active') : L('Inactive')}
                  </Tag>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ShopDetailsModal;
