/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import timingHelper from '../../lib/timingHelper';
import NotificationStore from '../../stores/NotificationStore';
import CreateNotification from './components/createNotification';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';

export interface INotificationProps {
  notificationStore?: NotificationStore;
}

export interface INotificationState {
  notificationModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permisssionsGranted: {
    create: boolean;
  };
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare let abp: any;

@inject(Stores.NotificationStore)
@observer
export class Notifications extends AppComponentBase<INotificationProps, INotificationState> {
  formRef = React.createRef<FormInstance>();
  currentUser: any = undefined;

  state = {
    notificationModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permisssionsGranted: {
      create: false,
    },
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        create: (await utils.checkIfGrantedPermission('Notifications.Create')).valueOf(),
      },
    });
    await this.updateNotificationsList(this.state.meta.pageSize, 0);
  }

  async updateNotificationsList(maxResultCount: number, skipCount: number) {
    this.props.notificationStore!.maxResultCount = maxResultCount;
    this.props.notificationStore!.skipCount = skipCount;
    this.props.notificationStore!.getNotifications();
  }

  async openNotificationModal() {
    this.setState({
      notificationModalVisible: !this.state.notificationModalVisible,
    });
  }

  notificationTableColumns = [
    {
      title: L('ArTitle'),
      dataIndex: 'arTitelNotification',
      key: 'arTitelNotification',
    },
    {
      title: L('EnTitle'),
      dataIndex: 'enTitelNotification',
      key: 'enTitelNotification',
    },
    {
      title: L('ArMessage'),
      dataIndex: 'arMessage',
      key: 'arMessage',
    },
    {
      title: L('EnMessage'),
      dataIndex: 'enMessage',
      key: 'enMessage',
    },

    {
      title: L('CreationDate'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (creationTime: string) => {
        return moment(creationTime).format(timingHelper.defaultDateFormat);
      },
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateNotificationsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateNotificationsList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const notifications = this.props.notificationStore!.notifications;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.notificationStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Notifications')}</span>
            {this.state.permisssionsGranted.create && (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openNotificationModal()}
              >
                {L('AddNotification')}
              </Button>
            )}
          </div>
        }
      >
        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.notificationStore!.loadingNotifications}
          dataSource={notifications === undefined ? [] : notifications}
          columns={this.notificationTableColumns}
        />

        <CreateNotification
          formRef={this.formRef}
          visible={this.state.notificationModalVisible}
          onCancel={() =>
            this.setState({
              notificationModalVisible: false,
            })
          }
          isSubmittingNotification={this.props.notificationStore!.isSubmittingNotification}
          notificationStore={this.props.notificationStore!}
        />
      </Card>
    );
  }
}

export default Notifications;
