import React, { useCallback, useRef } from 'react';
import { notification, Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useMutation } from '@apollo/client';
import { Partnership } from '../PartnershipList';
import { ColumnsType } from 'antd/lib/table';
import { UPDATE_PARTNERSHIP_NO } from 'graphql/mutation';

const type = 'DraggableBodyRow';

type Props = {
  data: Partnership[];
  handlePagination: (e: number) => void;
  setData: React.Dispatch<React.SetStateAction<Partnership[]>>;
  columns: ColumnsType<Partnership>;
  setTake: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  current: number;
  handleRefetch: () => void;
};

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}: any) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const dragIndex: number = monitor.getItem() ?? 0;
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

export const DragSortingTable = ({
  data,
  setData,
  columns,
  handlePagination,
  current,
  totalCount,
  setTake,
  handleRefetch,
}: Props) => {
  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  const [updateProductNo] = useMutation(UPDATE_PARTNERSHIP_NO, {
    onCompleted: () => {
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });
  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = data[dragIndex];

      if (dragIndex !== hoverIndex) {
        updateProductNo({
          variables: {
            id: data[dragIndex].id,
            no: data[hoverIndex].no,
          },
        });
      }
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },

    [data],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        dataSource={data}
        style={{
          marginTop: 30,
        }}
        components={components}
        onRow={(_record, index): any => ({
          index,
          moveRow,
        })}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        rowKey={(rec) => rec.id}
        scroll={{ x: 800 }}
      />
    </DndProvider>
  );
};
