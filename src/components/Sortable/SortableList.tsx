export {};
// import React from 'react';
// import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

// const Item = SortableElement(
//   ({
//     tabbable,
//     className,
//     isDisabled,
//     height,
//     style: propStyle,
//     shouldUseDragHandle,
//     value,
//     itemIndex,
//     isSorting,
//   }: any) => {
//     const bodyTabIndex = tabbable && !shouldUseDragHandle ? 0 : -1;
//     const handleTabIndex = tabbable && shouldUseDragHandle ? 0 : -1;

//     return (
//       <div
//         className={classNames(
//           className,
//           isDisabled && style.disabled,
//           isSorting && style.sorting,
//           shouldUseDragHandle && style.containsDragHandle
//         )}
//         style={{
//           height,
//           ...propStyle,
//         }}
//         tabIndex={bodyTabIndex}
//         data-index={itemIndex}
//       >
//         {shouldUseDragHandle && <Handle tabIndex={handleTabIndex} />}
//         <div className={style.wrapper}>
//           <span>Item</span> {value}
//         </div>
//       </div>
//     );
//   }
// );

// const Handle = SortableHandle(({ tabIndex }: any) => (
//   <div className={style.handle} tabIndex={tabIndex}>
//     <svg viewBox="0 0 50 50">
//       <path
//         d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"
//         color="#000"
//       />
//     </svg>
//   </div>
// ));

// const SortableList = SortableContainer(
//   ({
//     className,
//     items,
//     disabledItems = [],
//     itemClass,
//     isSorting,
//     shouldUseDragHandle,
//     type,
//   }: any) => {
//     return (
//       <div className={className}>
//         {items.map(({ value, height }: any, index: any) => {
//           const disabled = disabledItems.includes(value);

//           return (
//             <Item
//               tabbable
//               key={`item-${value}`}
//               disabled={disabled}
//               isDisabled={disabled}
//               className={itemClass}
//               index={index}
//               itemIndex={index}
//               value={value}
//               height={height}
//               shouldUseDragHandle={shouldUseDragHandle}
//               type={type}
//               isSorting={isSorting}
//             />
//           );
//         })}
//       </div>
//     );
//   }
// );

// export default SortableList;
