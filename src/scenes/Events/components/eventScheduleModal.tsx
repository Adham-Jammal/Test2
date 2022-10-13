/* eslint-disable */
import * as React from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  TimePicker,
} from 'antd';
import * as RULES from './validationRules';

import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './eventDetailsStyle.css';
import { EventOccoursOptions } from '../../../lib/types';
import AppComponentBase from '../../../components/AppComponentBase';
import eventsService from '../../../services/events/eventsService';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
// import moment from 'moment';

interface EventScheduleModalProps {
  visible: boolean;
  onCancel: () => void;
  setScheduleData: (value: Array<any>) => void;
  scheduleData: Array<any>;
  setSchedules: (value: Array<any>) => void;
  schedules: Array<any>;
}

const endingTypesOptions = [
  {
    label: L('UseEndDate'),
    value: 0,
  },
  {
    label: L('OrAfter'),
    value: 1,
  },
];

class EventScheduleModal extends AppComponentBase<EventScheduleModalProps, any> {
  state = {
    endingType: 0,
    events: [],
  };
  formRef = React.createRef<FormInstance>();

  async componentDidMount() {
    let result = await eventsService.getAllLite({ status: 1 });
    this.setState({ events: result.items });
  }

  setEndingType = (value: number) => {
    this.setState({ endingType: value });
  };
  // const validateEndDate = (_1: any, value: number) => {
  //   const startDate = form.getFieldValue('startDate');
  //   if (moment(value).isBefore(Date.now())) {
  //     return Promise.reject(L('EventTimeMustBeAfterTodayDate'));
  //   }
  //   if (value !== undefined && value !== null && startDate) {
  //     if (!moment(value).isAfter(startDate)) {
  //       return Promise.reject(L('TheEndTimeMustBeMoreThanEndTime'));
  //     }
  //   }
  //   return Promise.resolve();
  // };

  // // validate start date
  // const validateStartDate = (_1: any, value: number) => {
  //   const startDate = form.getFieldValue('endDate');
  //   if (moment(value).isBefore(Date.now())) {
  //     return Promise.reject(L('EventTimeMustBeAfterTodayDate'));
  //   }
  //   if (value !== undefined && value !== null && startDate) {
  //     if (moment(value).isAfter(startDate)) {
  //       return Promise.reject(L('TheStartTimeMustBeLessThanEndTime'));
  //     }
  //   }
  //   return Promise.resolve();
  // };
  handleCancelScheduleModal = () => {
    this.props.onCancel();
  };
  handleSubmitScheduleModal = async () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.endingType === 0) {
        values.endAfterEvents = [];
        values.endDate = moment(values.endDate).format(timingHelper.defaultDateFormat);
      } else {
        values.endDate = undefined;
      }
      values.startDate = moment(values.startDate).format(timingHelper.defaultDateFormat);
      values.fromHour = values.fromHour;
      values.toHour = values.toHour;

      const schedulesResult = await eventsService.getRecurringDates(values);
      let temp: Array<any> = [];
      schedulesResult.map((item: any) =>
        temp.push({
          title:
            moment(values.fromHour).format(timingHelper.defaultTimeFormat) +
            ' - ' +
            moment(values.toHour).format(timingHelper.defaultTimeFormat),
          start: moment(item.startDate).format(timingHelper.defaultDateFormat),
          end: moment(item.endDate).format(timingHelper.defaultDateFormat),
        })
      );
      this.props.setSchedules([...this.props.schedules, [values]]);

      this.props.setScheduleData([...this.props.scheduleData, ...temp]);
      this.props.onCancel();
    });
  };
  render() {
    return (
      <Modal
        style={{ padding: '20px' }}
        visible={this.props.visible}
        title={L('AddSchedule')}
        onCancel={this.props.onCancel}
        centered
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancelScheduleModal}>
            {L('Cancel')}
          </Button>,

          <Button
            type="primary"
            key="dd"
            // loading={this.props.isSubmittingEventSchedule}
            onClick={async () => {
              await this.handleSubmitScheduleModal();
            }}
          >
            {L('Save')}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          <Form layout="vertical" ref={this.formRef}>
            <Row>
              <Col xs={24}>
                <Form.Item
                  label={L('StartDate')}
                  name="startDate"
                  style={{ width: '100%' }}
                  rules={[
                    RULES.required,
                    // {
                    //   validator: validateStartDate,
                    // },
                  ]}
                >
                  <DatePicker placeholder={L('StartDate')} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="custom-row">
              <Col xs={24} md={11}>
                <Form.Item
                  label={L('StartTime')}
                  name="fromHour"
                  style={{ width: '100%' }}
                  rules={[RULES.required]}
                >
                  <TimePicker showSecond={false} placeholder={L('StartTime')} />
                </Form.Item>
              </Col>
              <Col xs={24} md={11}>
                <Form.Item
                  label={L('EndTime')}
                  name="toHour"
                  style={{ width: '100%' }}
                  rules={[RULES.required]}
                >
                  <TimePicker showSecond={false} placeholder={L('EndTime')} />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <Col xs={24}>
                <Form.Item label={L('Occours')} name={'repeat'} rules={[RULES.required]}>
                  <Select placeholder={L('PleaseSelectTheOccour')}>
                    <Select.Option key={EventOccoursOptions.None} value={EventOccoursOptions.None}>
                      {L('None')}
                    </Select.Option>
                    <Select.Option
                      key={EventOccoursOptions.Daily}
                      value={EventOccoursOptions.Daily}
                    >
                      {L('Daily')}
                    </Select.Option>
                    <Select.Option
                      key={EventOccoursOptions.Weekly}
                      value={EventOccoursOptions.Weekly}
                    >
                      {L('Weekly')}
                    </Select.Option>
                    <Select.Option
                      key={EventOccoursOptions.Monthly}
                      value={EventOccoursOptions.Monthly}
                    >
                      {L('Monthly')}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <hr />
            <h3 style={{ marginTop: 10 }}>{L('Ending')}</h3>
            <Row>
              <Col xs={24} md={8}>
                <Form.Item
                  name="ending"
                  initialValue={this.state.endingType}
                  className="ending"
                  colon={false}
                >
                  <Radio.Group
                    options={endingTypesOptions}
                    onChange={({ target: { value } }: RadioChangeEvent) => {
                      this.setEndingType(value);
                    }}
                    optionType="default"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={16}>
                <Form.Item
                  name="endDate"
                  style={{ width: '100%' }}
                  rules={[
                    RULES.required,
                    // {
                    //   validator: validateEndDate,
                    // },
                  ]}
                >
                  <DatePicker placeholder={L('EndDate')} />
                </Form.Item>
                <Form.Item name="endAfterEvents">
                  <Select placeholder={L('PleaseSelectTheEvents')}>
                    {this.state.events &&
                      this.state.events.length > 0 &&
                      this.state.events.map((item: LiteEntityDto) => {
                        return (
                          <Select.Option key={item.value} value={item.value}>
                            {item.text}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default EventScheduleModal;
