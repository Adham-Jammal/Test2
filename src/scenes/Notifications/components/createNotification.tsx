/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Switch, Select, Col, Row } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { FormInstance } from 'antd/lib/form';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import clientsService from '../../../services/clients/clientsService';
import NotificationStore from '../../../stores/NotificationStore';
import { CreateNotificationDto } from '../../../services/notifications/dto';

export interface ICreateNotificationProps {
  visible: boolean;
  onCancel: () => void;
  notificationStore?: NotificationStore;
  isSubmittingNotification: boolean;
  formRef: React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 },
  },
};
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 12 },
};

@inject(Stores.NotificationStore)
@observer
class CreateNotification extends React.Component<ICreateNotificationProps, any> {
  clients: LiteEntityDto[] = [];
  async componentDidMount() {
    const clientsResult = await clientsService.getAllLite({ isActive: true });
    this.clients = clientsResult.items;
  }
  state = {
    forAllClients: false,
  };
  handleSubmit = async () => {
    const form = this.props.formRef.current;
    form!.validateFields().then(async (values: any) => {
      await this.props.notificationStore!.createNotification(values as CreateNotificationDto);
      await this.props.notificationStore!.getNotifications();
      this.props.onCancel();
      form!.resetFields();
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal
        visible={visible}
        title={L('CreateNotification')}
        onCancel={onCancel}
        centered
        maskClosable={false}
        destroyOnClose
        width={'90%'}
        className={localization.isRTL() ? 'rtl-modal admin-modal' : 'ltr-modal admin-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingNotification}
            onClick={this.handleSubmit}
          >
            {L('Create')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Row>
            <Col {...colLayout}>
              <FormItem
                label={L('EnTitle')}
                name="enTitelNotification"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('ArTitle')}
                name="arTitelNotification"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnContent')}
                name="enContent"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input.TextArea rows={4} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('ArContent')}
                name="arContent"
                {...formItemLayout}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Input.TextArea rows={4} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                name="forAllClient"
                colon={false}
                label={L('ForAllClient')}
                {...formItemLayout}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={L('Yes')}
                  unCheckedChildren={L('No')}
                  onChange={(checked: boolean) => this.setState({ forAllClients: checked })}
                />
              </FormItem>
            </Col>

            {/* if no for all clients select the specific clients */}
            {!this.state.forAllClients && (
              <Col {...colLayout}>
                <FormItem
                  label={L('Clients')}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  {...formItemLayout}
                  name="userIds"
                >
                  <Select
                    mode="multiple"
                    placeholder={L('PleaseSelectClients')}
                    showSearch
                    optionFilterProp="children"
                  >
                    {this.clients.length > 0 &&
                      this.clients.map((element: LiteEntityDto) => (
                        <Select.Option key={element.value} value={element.value}>
                          {element.text}
                        </Select.Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateNotification;
