/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Avatar } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './promoterDetailsModal.css';
import PromoterStore from '../../../stores/promoterStore';
import ImageModel from '../../../components/ImageModal';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
import { LicenseType, VehicleType } from '../../../lib/types';

export interface IPromoterDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  promoterStore: PromoterStore;
}

@inject(Stores.PromoterStore)
@observer
class PromoterDetailsModal extends React.Component<IPromoterDetailsModalProps, any> {
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

  handleCancel = () => {
    this.props.onCancel();
  };

  renderLicenseType = (licenseType: number) => {
    let licenseTypeName = undefined;
    switch (licenseType) {
      case LicenseType.A:
        licenseTypeName = L('A');
        break;
      case LicenseType.B:
        licenseTypeName = L('B');
        break;
      case LicenseType.C:
        licenseTypeName = L('C');
        break;
      case LicenseType.D:
        licenseTypeName = L('D');
    }
    return (
      <Tag color={'processing'} className="ant-tag-disable-pointer">
        {licenseTypeName}
      </Tag>
    );
  };

  renderVehicleType = (vehicleType: number) => {
    let vehicleTypeName = undefined;
    switch (vehicleType) {
      case VehicleType.Bicycle:
        vehicleTypeName = L('Bicycle');
        break;
      case VehicleType.Bus:
        vehicleTypeName = L('Bus');
        break;
      case VehicleType.Car:
        vehicleTypeName = L('Car');
        break;
      case VehicleType.Motorcycle:
        vehicleTypeName = L('Motorcycle');
        break;
      case VehicleType.Truck:
        vehicleTypeName = L('Truck');
        break;
      case VehicleType.Van:
        vehicleTypeName = L('Van');
    }
    return (
      <Tag color={'processing'} className="ant-tag-disable-pointer">
        {vehicleTypeName}
      </Tag>
    );
  };

  render() {
    const { visible } = this.props;
    const { promoterModel } = this.props.promoterStore!;
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
        <div className="promoter-details-modal">
          <div className="details-wrapper">
            <div className="detail-wrapper">
              <span className="detail-label">{L('Name')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined ? promoterModel.fullName : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('PhoneNumber')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined ? promoterModel.phoneNumber : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('LicenseType')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined
                  ? this.renderLicenseType(promoterModel.licenseType)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('ResidenceExpirationDate')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined
                  ? moment(promoterModel.residenceExpirationDate).format(
                      timingHelper.defaultDateFormat
                    )
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('VehicleName')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined ? promoterModel.vehicleName : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('VehicleNumber')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined ? promoterModel.vehicleNumber : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('VehicleType')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined
                  ? this.renderVehicleType(promoterModel.vehicleType)
                  : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Blocked?')}:</span>
              <span className="detail-value">
                <Tag
                  color={
                    promoterModel !== undefined && promoterModel.isActive ? 'green' : 'volcano'
                  }
                  className="ant-tag-disable-pointer"
                >
                  {promoterModel !== undefined && promoterModel.isActive
                    ? L('Unblocked')
                    : L('Blocked')}
                </Tag>
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Identity')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined ? (
                  <div
                    onClick={() =>
                      this.openImageModal(promoterModel.identityUrl, promoterModel.fullName)
                    }
                    style={{ cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={150} src={promoterModel.identityUrl} />
                  </div>
                ) : (
                  L('NoFileUploaded')
                )}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('DrivingLicense')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined ? (
                  <div
                    onClick={() =>
                      this.openImageModal(promoterModel.drivingLicenseUrl, promoterModel.fullName)
                    }
                    style={{ cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={150} src={promoterModel.drivingLicenseUrl} />
                  </div>
                ) : (
                  L('NoFileUploaded')
                )}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('Passport')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined && promoterModel.passportUrl ? (
                  <div
                    onClick={() =>
                      this.openImageModal(promoterModel.passportUrl, promoterModel.fullName)
                    }
                    style={{ cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={150} src={promoterModel.passportUrl} />
                  </div>
                ) : (
                  <div>{L('NoFileUploaded')}</div>
                )}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('VehicleImage')}:</span>
              <span className="detail-value">
                {promoterModel !== undefined && promoterModel.vehicleImageUrl ? (
                  <div
                    onClick={() =>
                      this.openImageModal(promoterModel.vehicleImageUrl, promoterModel.fullName)
                    }
                    style={{ cursor: 'zoom-in' }}
                  >
                    <Avatar shape="square" size={150} src={promoterModel.vehicleImageUrl} />
                  </div>
                ) : (
                  <div>{L('NoFileUploaded')}</div>
                )}
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

export default PromoterDetailsModal;
