/* eslint-disable */
import * as React from 'react';
import { Button, Card, Col, Input, Row, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import { SaveOutlined } from '@ant-design/icons';
import Form, { FormInstance } from 'antd/lib/form';
import ConfigurationsStore from '../../stores/configurationsStore';
import FormItem from 'antd/lib/form/FormItem';

export interface IConfigurationsProps {
  configurationsStore?: ConfigurationsStore;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 22 },
    sm: { span: 22 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
  wrapperCol: {
    xs: { span: 22 },
    sm: { span: 22 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

export interface IConfigurationsState {
  editMode: boolean;
  feesPercentage?: number;
}

@inject(Stores.ConfigurationsStore)
@observer
export class Configurations extends AppComponentBase<IConfigurationsProps, IConfigurationsState> {
  formRef = React.createRef<FormInstance>();

  state = {
    editMode: false,
    feesPercentage: undefined,
  };

  async componentDidMount() {
    await this.props!.configurationsStore?.getConfigurations();
    this.setState({ feesPercentage: this.props.configurationsStore!.configurations?.percentage });
  }

  updateConfigs = async () => {
    await this.props!.configurationsStore!.updateConfigurations({
      percentage: this.state.feesPercentage!,
    });
    window.location.reload();
  };

  public render() {
    return (
      <Card
        style={{ minHeight: '70vh' }}
        title={
          <div>
            <span>{L('Configurations')}</span>
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              disabled={this.state.editMode ? false : true}
              icon={<SaveOutlined />}
              loading={this.props.configurationsStore?.isSubmittingConfigurations}
              onClick={async () => await this.updateConfigs()}
            >
              {L('Save')}
            </Button>
          </div>
        }
      >
        {this.props.configurationsStore?.loadingConfigurations ? (
          <Spin></Spin>
        ) : (
          <Form layout="vertical" className={localization.isRTL() ? 'rtl-form' : 'ltr-form'}>
            <Row>
              <Col xs={24} md={12}>
                <FormItem
                  colon={false}
                  {...formItemLayout}
                  label={L('FeesPercentage')}
                  rules={[
                    {
                      max: 100,
                      min: 0,
                      message: L('PleaseEnterAValidNumber'),
                    },
                  ]}
                >
                  <Input
                    style={{ width: '100%' }}
                    name="feesPercentage"
                    min={0}
                    max={100}
                    value={this.state.feesPercentage}
                    type="number"
                    onChange={(e) => {
                      this.setState({ feesPercentage: +e.target.value! });
                      this.setState({ editMode: true });
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    );
  }
}

export default Configurations;
