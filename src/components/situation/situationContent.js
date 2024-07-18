import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { Button, Modal, Table, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddSituationContentModal from "./addSituationContent";
import {
  getSituationDetails,
  setSituationDetailsOrder,
  removeSituationDetail,
} from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "./createSituation.scss";

const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: "move",
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const SituationContentModal = ({ id, name, desc }) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [orderChange, setOrderChange] = useState(null);
  const [reloadPresetDetails, setReloadPresetDetails] = useState(null);

  const columns = [
    {
      key: "sort",
    },
    {
      title: intl.formatMessage(Messages.Text_Common_Type),
      dataIndex: "set_type",
    },
    {
      title: intl.formatMessage(Messages.Text_Situation_Description),
      dataIndex: "remark",
    },
    {
      title: intl.formatMessage(Messages.Text_Situation_Operation),
      dataIndex: "id",
      render: (id) => (
        <div key={`${id}-action`}>
          <Button key={`${id}-delete`} id={id} onClick={removeDetail}>
            <FormattedMessage {...Messages.Text_Button_Delete} />
          </Button>
        </div>
      ),
    },
  ];

  // Get preset data by preset id
  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        const result = await getSituationDetails(store, id);
        if (result) {
          let data = [];
          result.forEach((detail) => {
            data.push({ ...detail, key: detail.orderNum });
          });
          setDataSource(data);
        }
      })();
    }
  }, [isModalOpen, reloadPresetDetails]);

  // save new order of preset details
  useEffect(() => {
    (async () => {
      let orderedDetails = [];
      dataSource.forEach((detail, idx) => {
        detail.orderNum = idx + 1;
        orderedDetails.push({
          id: detail.id,
          orderNum: detail.orderNum,
        });
      });
      await setSituationDetailsOrder(store, orderedDetails);
    })();
  }, [orderChange]);

  const onDragEnd = ({ active, over }) => {
    setOrderChange(Math.random());
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  const removeDetail = async (event) => {
    const detailId = event.currentTarget.id;
    await removeSituationDetail(detailId, store);
    setReloadPresetDetails(Math.random());
  };

  return (
    <div>
      <span>{desc}</span>
      <Button
        onClick={() => setIsModalOpen(true)}
        style={{ float: "right", marginTop: -6 }}
      >
        <Typography.Text>edit</Typography.Text>
      </Button>
      <Modal
        title={name}
        className="modal-title"
        width={700}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <AddSituationContentModal
          id={id}
          detailsNum={dataSource.length}
          setReloadPresetDetails={setReloadPresetDetails}
        />
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </Modal>
    </div>
  );
};

export default SituationContentModal;
