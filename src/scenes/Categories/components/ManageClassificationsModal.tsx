/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Avatar, Table, Dropdown, Menu, Tag } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import {
  EditOutlined,
  PlusOutlined,
  CaretDownOutlined,
  CheckSquareOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import ClassificationStore from '../../../stores/classificationStore';
import { EntityDto } from '../../../services/dto/entityDto';
import { CreateClassificationDto } from '../../../services/classifications/dto/createClassificationDto';
import { UpdateClassificationDto } from '../../../services/classifications/dto/updateClassificationDto';
import { ClassificationDto } from '../../../services/classifications/dto/classificationDto';
import CreateOrUpdateClassification from './createOrUpdateClassification';
import ImageModel from '../../../components/ImageModal';
import userService from '../../../services/user/userService';
import utils from '../../../utils/utils';
import ClassificationDetailsModal from '../../Classifications/components/classificationDetailsModal';

export interface IManageClassificationsModalProps {
  visible: boolean;
  onCancel: () => void;
  categoryId: number;
  classificationStore?: ClassificationStore;
}
export interface IManageClassificationsModalState {
  classificationModalVisible: boolean;
  classificationModalId: number;
  classificationDetailsModalVisible: boolean;
  classificationModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

declare var abp: any;

@inject(Stores.ClassificationStore)
@observer
class ManageClassificationsModal extends React.Component<IManageClassificationsModalProps, any> {
  formRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  state = {
    classificationModalVisible: false,
    classificationModalId: 0,
    classificationDetailsModalVisible: false,
    classificationModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Classifications.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Classifications.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Classifications.Activation')).valueOf(),
      },
    });
  }

  async updateClassificationsList(maxResultCount: number, skipCount: number) {
    this.props.classificationStore!.maxResultCount = maxResultCount;
    this.props.classificationStore!.skipCount = skipCount;
    await this.props.classificationStore!.getClassifications(this.props.categoryId);
  }

  async openClassificationDetailsModal(entityDto: EntityDto) {
    await this.props.classificationStore!.getClassification(entityDto);
    this.setState({
      classificationDetailsModalVisible: !this.state.classificationDetailsModalVisible,
      classificationModalId: entityDto.id,
    });
  }

  async openClassificationModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.classificationStore!.classificationModel = undefined;
      this.setState({ classificationModalType: 'create' });
    } else {
      this.props.classificationStore!.categoryId = this.props.categoryId;
      await this.props.classificationStore!.getClassification(entityDto);
      this.setState({ classificationModalType: 'edit' });
    }
    this.setState({
      classificationModalVisible: !this.state.classificationModalVisible,
      classificationModalId: entityDto.id,
    });
  }

  createOrUpdateClassification = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('classification-image')!.getAttribute('value')
        ? document.getElementById('classification-image')!.getAttribute('value')
        : this.props.classificationStore!.classificationModel?.imageUrl;
      values.categoryId = this.props.categoryId;
      if (this.state.classificationModalId === 0) {
        await this.props.classificationStore!.createClassification(
          values as CreateClassificationDto
        );
      } else {
        values.id = this.state.classificationModalId;
        await this.props.classificationStore!.updateClassification(
          values as UpdateClassificationDto
        );
      }

      this.props.classificationStore!.categoryId = this.props.categoryId;
      await this.props.classificationStore!.getClassifications(this.props.categoryId);
      this.setState({ classificationModalVisible: false });
      form!.resetFields();
    });
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  openChangeStatusModal(id: number, oldStatus: boolean) {
    this.setState({
      classificationModalId: id,
      classificationModalOldStatus: oldStatus,
      changeStatusModalVisible: true,
    });
  }

  doneClassificationChangeStatus = () => {
    this.updateClassificationsList(this.state.meta.pageSize, 0);
  };

  classificationsTableColumns = [
    {
      title: L('ArName'),
      dataIndex: 'arName',
      key: 'arName',
    },
    {
      title: L('EnName'),
      dataIndex: 'enName',
      key: 'enName',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: ClassificationDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.enName)}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.imageUrl} />
          </div>
        );
      },
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: ClassificationDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item onClick={() => this.openClassificationDetailsModal({ id: item.id })}>
                  <EyeOutlined className="action-icon" />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                {this.state.permisssionsGranted.update ? (
                  <Menu.Item onClick={() => this.openClassificationModal({ id: item.id })}>
                    <EditOutlined className="action-icon" />
                    <button className="inline-action">{L('Edit')}</button>
                  </Menu.Item>
                ) : null}
                {this.state.permisssionsGranted.activation ? (
                  <Menu.Item onClick={() => this.openChangeStatusModal(item.id, item.isActive)}>
                    <CheckSquareOutlined className="action-icon" />
                    <button className="inline-action">{L('ChangeStatus')}</button>
                  </Menu.Item>
                ) : null}
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon={<CaretDownOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateClassificationsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateClassificationsList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };
  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel } = this.props;
    const classifications = this.props.classificationStore!.classifications;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.classificationStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };

    return (
      <Modal
        visible={visible}
        title={L('ManageClassifications')}
        onCancel={onCancel}
        centered
        destroyOnClose
        width="70%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        {this.state.permisssionsGranted.create ? (
          <Button
            type="primary"
            style={{ float: localization.getFloat(), margin: '0 5px' }}
            icon={<PlusOutlined />}
            onClick={() => this.openClassificationModal({ id: 0 })}
          >
            {L('AddClassification')}
          </Button>
        ) : null}
        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.classificationStore!.loadingClassifications}
          dataSource={classifications === undefined ? [] : classifications}
          columns={this.classificationsTableColumns}
        />

        <CreateOrUpdateClassification
          formRef={this.formRef}
          visible={this.state.classificationModalVisible}
          onCancel={() =>
            this.setState({
              classificationModalVisible: false,
            })
          }
          modalType={this.state.classificationModalType}
          onOk={this.createOrUpdateClassification}
          isSubmittingClassification={this.props.classificationStore!.isSubmittingClassification}
          classificationStore={this.props.classificationStore}
        />

        <ClassificationDetailsModal
          visible={this.state.classificationDetailsModalVisible}
          onCancel={() =>
            this.setState({
              classificationDetailsModalVisible: false,
            })
          }
          classificationStore={this.props.classificationStore!}
        />
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

export default ManageClassificationsModal;
