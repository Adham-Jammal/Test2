/* eslint-disable */
import * as React from 'react';
import { Modal, Button } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { EventOrderDto } from '../../../services/events/dto/updateEventOrdersDto';
import { L } from '../../../i18next';
import './sortCategoryOrders.css';
import localization from '../../../lib/localization';
const arrayMove = require('array-move');

const SortCategoryOrders = (props: any) => {
  const { visible, onCancel, onOk, isSortingItems, categories } = props;
  const [items, setItems] = React.useState([]);

  const SortableItem = SortableElement(({ value }: any) => (
    <li>
      <span>{value.name}</span>
    </li>
  ));
  const SortableList = SortableContainer(({ items }: any) => {
    if (items.length === 0) setItems(categories);
    return (
      <ol className="categories">
        {items.map((value: any, index: number) => (
          <SortableItem key={`item-${value.id}`} index={index} value={value} />
        ))}
      </ol>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const handleSubmit = async () => {
    let sortedItems: EventOrderDto[] = [];
    items.map((value: any, index: number) =>
      sortedItems.push(new EventOrderDto(value.id, index + 1))
    );
    await onOk(sortedItems);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      centered
      width={'60%'}
      visible={visible}
      title={L('SortCategories')}
      onCancel={onCancel}
      maskClosable={false}
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSortingItems} onClick={handleSubmit}>
          {L('Save')}
        </Button>,
      ]}
    >
      <div className="modal-contnet">
        <div className="sorting-section">
          <h3>{L('DragAndDropToSortCategories')}</h3>
          <SortableList items={items} onSortEnd={onSortEnd} />
        </div>
      </div>
    </Modal>
  );
};

export default SortCategoryOrders;
