import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button, Input, Modal, Table } from "antd";
import { presetAudioSituation, getSituations } from "../../api/API";
import { showWarningNotification } from "../../utils/Utils";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import SearchIcon from "../../assets/magnifying-glass.png";
import "./addSituationContent.scss";
import "../../pages/Audio.scss";
import "./audioSituationModal.scss";
import "./audioModal.scss";

const audioSituationCategory = "2";

const AudioSituationModal = ({
  situation,
  situationItemLength,
  isModalOpen,
  setIsModalOpen,
  setReload,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [audioSituations, setAudioSituations] = useState([]);
  const [filteredSituations, setFilteredSituations] = useState([]);
  const [situationFilter, setSituationFilter] = useState("");

  useEffect(() => {
    (async () => {
      const situations = await getSituations(store, audioSituationCategory);
      situations?.forEach((situation) => {
        situation.key = situation.id;
      });
      setAudioSituations(situations);
    })();
  }, [store, isModalOpen]);

  useEffect(() => {
    let tempFilteredSituations = [];
    if (audioSituations?.length !== 0)
      audioSituations?.forEach((situation) => {
        if (situation.name.includes(situationFilter))
          tempFilteredSituations.push(situation);
      });
    setFilteredSituations(tempFilteredSituations);
  }, [audioSituations, situationFilter]);

  const audioSituationColumns = [
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Name)}
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: (
        <span className="audio-content-table-head">
          {intl.formatMessage(Messages.Text_Common_Description)}
        </span>
      ),
      dataIndex: "remark",
      key: "remark",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
  ];

  const [selectedSituations, setSelectedSituations] = useState(null);
  const situationSelection = {
    selectedRows: [selectedSituations],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedSituations(selectedRowKeys[0]);
    },
  };

  const handleReset = () => {
    setSituationFilter("");
    setAudioSituations([]);
    setSelectedSituations(null);
  };

  const handleCreateItem = async () => {
    if (selectedSituations) {
      let situationDesc;
      audioSituations.forEach((situation) => {
        if (situation.id === selectedSituations)
          situationDesc = situation.remark;
      });
      await presetAudioSituation({
        store: store,
        relation_id: selectedSituations,
        preSetId: situation.id,
        orderNum: situationItemLength + 1,
        remark: situationDesc,
      });
      handleReset();
      setReload(Math.random());
      setIsModalOpen(false);
    } else {
      showWarningNotification(
        intl.formatMessage(Messages.Text_Common_RequiredHint)
      );
    }
  };

  return (
    <div>
      {isModalOpen && (
        <Modal
          title={
            <span className="audio-modal-title">
              <FormattedMessage {...Messages.Text_Situation_AddSituationItem} />
              {" - "}
              <FormattedMessage {...Messages.Text_Situation_AudioSituation} />
            </span>
          }
          className="audio-situation-modal audio-content-modal-close-icon audio-content modal-title"
          open={isModalOpen}
          footer={null}
          onCancel={() => {
            handleReset();
            setIsModalOpen(false);
          }}
        >
          <div id="situation-selection">
            <div className="audio-add-subtitle">
              <FormattedMessage
                {...Messages.Text_Situation_ChooseAudioSituation}
              />
            </div>
            <Input
              className="audio-situation-input audio-add-input audio-input audio-add-input-placeholder"
              variant="filled"
              value={situationFilter}
              onChange={(e) => {
                setSituationFilter(e.target.value);
              }}
              prefix={
                <img
                  alt="search"
                  src={SearchIcon}
                  className="audio-add-input-prefix"
                />
              }
              placeholder={intl.formatMessage(
                Messages.Text_Situation_InputAudioSituationName
              )}
            />
            <Table
              className="situation-audio-table"
              columns={audioSituationColumns}
              dataSource={filteredSituations}
              rowSelection={{
                type: "radio",
                ...situationSelection,
              }}
              pagination={false}
            />
          </div>
          <div className="situation-audio-item-btn-row">
            <Button
              className="audio-situation-cancel-btn"
              style={{ marginRight: 16 }}
              onClick={() => {
                handleReset();
                setIsModalOpen(false);
              }}
            >
              <span className="audio-situation-cancel-btn-text">
                <FormattedMessage {...Messages.Text_Button_Cancel} />
              </span>
            </Button>
            <Button
              className="audio-situation-submit-btn"
              onClick={() => {
                handleCreateItem();
              }}
            >
              <span className="audio-situation-submit-btn-text">
                <FormattedMessage {...Messages.Text_Button_Add} />
              </span>
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AudioSituationModal;
