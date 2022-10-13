/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Tree } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import AdminStore from '../../../stores/adminStore';
import UserStore from '../../../stores/userStore';
import './adminDetailsModal.css';
import { UserStatus } from '../../../lib/types';

export interface IAdminDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  adminStore?: AdminStore;
  userStore?: UserStore;
  treeData: any[];
}

@inject(Stores.AdminStore, Stores.UserStore)
@observer
class AdminDetailsModal extends React.Component<IAdminDetailsModalProps, any> {
  treeData: any[] = [];
  state = {
    treeData: [],
  };

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
    const { adminModel } = this.props.adminStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        width="80%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <div className="details-modal">
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('FirstName')}:</span>
                <span className="detail-value">
                  {adminModel !== undefined ? adminModel.name : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Surname')}:</span>
                <span className="detail-value">
                  {adminModel !== undefined ? adminModel.surname : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Email')}:</span>
                <span className="detail-value">
                  {adminModel !== undefined ? adminModel.emailAddress : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Status')}:</span>
                <span className="detail-value">
                  {adminModel !== undefined && adminModel.status !== undefined
                    ? this.resolveStatus(adminModel.status)
                    : undefined}
                </span>
              </div>
              <div className="detail-wrapper big">
                <span className="detail-label">{L('Permissions')}:</span>
                <span className="detail-value permissions">
                  <Tree treeData={this.props.treeData} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AdminDetailsModal;
