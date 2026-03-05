import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../store/store";
import { getDecoders } from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "antd";
import Messages from "../../messages";
import { WALL_SCREEN_SIZE, POSITION_CLEAR_BTN } from "../../utils/Constant";
import ScreenBackgroundImage from "../../assets/screenBackground.png";
import ClearLinkIcon from "../../assets/clearLink.png";
import ClearLinkDisabledIcon from "../../assets/clearLinkDisabled.png";
import "../tvwall/tvWall.scss";
import "../../App.scss";

const MultiView = ({
  wallWidth,
  wallHeight,
  selectedWall,
  selectedTemplate,
  selectedEncoder,
  clearTvWall,
  blocks,
  setBlocks,
  isActivedWall,
  blockEncoderMapping,
  setBlockEncoderMapping,
  selectedBlockNumber,
  setSelectedBlockNumber,
  setClearBlockNumber,
  blocksDetail,
  setBlocksDetail,
}) => {
  const intl = useIntl();
  const [store] = useContext(StoreContext);
  const [reloadWall, setReloadWall] = useState(null);
  const [wallReloaded, setWallReloaded] = useState(null);
  const [tvWallScreens, setTvWallScreens] = useState([]);
  const [tvWallSize, setTvWallSize] = useState({ col: 0, row: 0 });
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocksWithPosition, setBlocksWithPosition] = useState([]);
  const [needUpdateBlocks, setNeedUpdateBlocks] = useState(null);
  const [clearBlock, setClearBlock] = useState({
    needClear: false,
    blockIdx: null,
  });

  useEffect(() => {
    let tempScreens = [];
    let tempBlocksDetail = [];
    if (selectedWall && selectedTemplate) {
      (async () => {
        const templateScreens = Array.from(
          { length: selectedTemplate.col * selectedTemplate.row },
          (value, idx) => ({
            block: idx + 1,
            num: idx + 1,
          }),
        );
        const wallScreens = Array.from(
          { length: selectedTemplate.col * selectedTemplate.row },
          (value, idx) => ({
            block: idx + 1,
            decoder: selectedWall.mac,
            encoder: "",
            ip: "",
            monitorBrand: "",
            monitorBrandName: "",
            nickName: selectedWall.mac,
            num: idx + 1,
            state: "Up",
          }),
        );
        const decoders = await getDecoders(store);
        wallScreens?.sort(function (wall1, wall2) {
          return wall1.num - wall2.num;
        });
        if (
          wallScreens &&
          templateScreens &&
          blockEncoderMapping &&
          decoders?.length > 0 &&
          Object.keys(blockEncoderMapping).length >= 0
        ) {
          wallScreens.forEach((screen, idx) => {
            let tempScreen = screen;

            // set state to screen
            const decoder = decoders?.filter(
              (decoder) => decoder.mac === screen.decoder,
            )[0];
            tempScreen.state = decoder?.state;

            // set encoder to screen
            tempScreen.encoder = Object.values(blockEncoderMapping).includes(
              templateScreens[idx].block,
            )
              ? blockEncoderMapping[templateScreens[idx].block].mac
              : "";
            tempScreen.block = parseInt(templateScreens[idx].block);
            tempScreens.push(tempScreen);

            if (tempBlocksDetail.length >= 0) {
              let hasSet = false;
              tempBlocksDetail.forEach((block, idx) => {
                if (block.block === tempScreen.block) {
                  if (tempBlocksDetail[idx].smallestScreenNum > tempScreen.num)
                    tempBlocksDetail[idx].smallestScreenNum = tempScreen.num;
                  tempBlocksDetail[idx].detail.push(tempScreen);
                  hasSet = true;
                }
              });
              if (!hasSet) {
                tempBlocksDetail.push({
                  block: tempScreen.block,
                  smallestScreenNum: tempScreen.num,
                  detail: [tempScreen],
                });
              }
            } else {
              tempBlocksDetail.push({
                block: tempScreen.block,
                smallestScreenNum: tempScreen.num,
                detail: [tempScreen],
              });
            }
          });
          // caculate block size
          tempBlocksDetail?.forEach((block) => {
            let previousScreenNum = 0;
            let blockCol = 1;
            block.detail.forEach((screen) => {
              if (previousScreenNum === 0) {
                previousScreenNum = screen.num;
              } else if (
                previousScreenNum + 1 === screen.num &&
                blockCol < selectedTemplate.col
              ) {
                blockCol = blockCol + 1;
                previousScreenNum = screen.num;
              }
            });
            block.col = blockCol;
            block.row = block.detail.length / blockCol;
          });
        }
        setTvWallSize({
          col: selectedTemplate.col,
          row: selectedTemplate.row,
        });
        setBlocksDetail(tempBlocksDetail);
        setSelectedBlockNumber(null);
      })();
    }
  }, [selectedWall, selectedTemplate, clearTvWall]);

  const [wallHTML, setWallHTML] = useState();
  useEffect(() => {
    let wallBlocksHTML = [];
    if (tvWallSize.col !== 0) {
      blocksDetail?.forEach((block) => {
        wallBlocksHTML.push(
          <div
            className="wall-block-outer"
            style={{
              width: block.col * WALL_SCREEN_SIZE - 3,
              height: block.row * WALL_SCREEN_SIZE - 3,
              left:
                ((block.smallestScreenNum - 1) % tvWallSize.col) *
                WALL_SCREEN_SIZE,
              top:
                Math.floor((block.smallestScreenNum - 1) / tvWallSize.col) *
                WALL_SCREEN_SIZE,
              backgroundImage: blockEncoderMapping[block.block]?.nickName
                ? `url(${ScreenBackgroundImage})`
                : null,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            {block.col > 1
              ? [...Array(block.col - 1)].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      zIndex: 1000,
                      height: "100%",
                      position: "absolute",
                      left: `${(i + 1) * WALL_SCREEN_SIZE - 3}px`,
                      borderLeft: "1px dashed #757371",
                      opacity: 0.3,
                    }}
                  />
                ))
              : null}
            {block.row > 1
              ? [...Array(block.row - 1)].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      zIndex: 1000,
                      width: "100%",
                      position: "absolute",
                      top: `${(i + 1) * WALL_SCREEN_SIZE - 3}px`,
                      borderBottom: "1px dashed #757371",
                      opacity: 0.3,
                    }}
                  />
                ))
              : null}
            <div
              id={block.block}
              className={
                selectedBlockNumber?.toString() === block.block?.toString()
                  ? "wall-block-selected"
                  : "wall-block"
              }
              style={{
                width: block.col * WALL_SCREEN_SIZE - 16,
                height: block.row * WALL_SCREEN_SIZE - 16,
              }}
              onClick={(event) => {
                const blockNo = event.target.id;
                // already selected, unselected it
                if (selectedBlockNumber === blockNo)
                  setSelectedBlockNumber(null);
                else setSelectedBlockNumber(blockNo);
              }}
            >
              <div id={block.block} className="wall-block-title-row">
                <span
                  id={block.block}
                  className={
                    selectedBlockNumber?.toString() === block.block?.toString()
                      ? "wall-block-title-selected"
                      : "wall-block-title"
                  }
                >
                  <FormattedMessage {...Messages.Text_Common_Window} />{" "}
                  {block.block}
                </span>
              </div>
              <div id={block.block}>
                <div id={block.block} className="wall-block-desc">
                  <FormattedMessage {...Messages.Text_Common_Dimension} />
                  {" : "}
                  {block.col} X {block.row}
                </div>
              </div>
              <div id={block.block}>
                <div id={block.block} className="wall-block-desc">
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {" : "}{" "}
                  {blockEncoderMapping[block.block]?.nickName
                    ? blockEncoderMapping[block.block].nickName
                    : intl.formatMessage(Messages.Text_Common_None)}
                </div>
              </div>
              <div
                id={block.block}
                style={{
                  position: "absolute",
                  left:
                    POSITION_CLEAR_BTN.left +
                    (block.col - 1) * WALL_SCREEN_SIZE,
                  top:
                    POSITION_CLEAR_BTN.top + (block.row - 1) * WALL_SCREEN_SIZE,
                }}
              >
                {blockEncoderMapping[block.block]?.nickName ? (
                  <Button
                    id={block.block}
                    type="primary"
                    style={{
                      color: "#e7e7e7",
                      backgroundColor: "#262320",
                      position: "absolute",
                      borderRadius: "20px",
                      zIndex: 100,
                    }}
                    onClick={(event) => {
                      let clearBlockNumber = event.target.id;
                      setClearBlockNumber(clearBlockNumber);
                    }}
                  >
                    <div id={block.block} style={{ display: "flex" }}>
                      <img
                        id={block.block}
                        alt="clear link"
                        src={ClearLinkIcon}
                        style={{
                          width: 18,
                          height: 18,
                          marginTop: 2,
                          marginRight: 6,
                        }}
                      />
                      <span id={block.block} className="single-screen-btn-text">
                        <FormattedMessage
                          {...Messages.Text_Button_ClearSource}
                        />
                      </span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    id={block.block}
                    type="primary"
                    disabled
                    style={{
                      color: "#a5a5a5",
                      backgroundColor: "#c6c6c6",
                      position: "absolute",
                      borderRadius: "20px",
                      zIndex: 100,
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <img
                        id={block.block}
                        alt="clear link"
                        src={ClearLinkDisabledIcon}
                        style={{
                          width: 18,
                          height: 18,
                          marginTop: 2,
                          marginRight: 6,
                        }}
                      />
                      <span id={block.block} className="single-screen-btn-text">
                        <FormattedMessage
                          {...Messages.Text_Button_ClearSource}
                        />
                      </span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>,
        );
      });
    }
    setWallHTML(
      <div id="wallScreens" style={{ position: "absolute" }}>
        {wallBlocksHTML}
      </div>,
    );
  }, [
    blocksDetail,
    tvWallSize,
    selectedBlockNumber,
    blockEncoderMapping,
    intl,
    setSelectedBlockNumber,
  ]);

  // for temp fix bug: wall screen text show vertical, because document.getElementById(`screen-${block.block}`)?.clientWidth is undefined
  useEffect(() => {
    if (!wallReloaded) {
      setWallReloaded(true);
      (async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        await sleep(1000);
        setReloadWall(Math.random());
      })();
    }
  }, [tvWallTemplate, selectedTemplate]);

  // setClearBlock take effect after onBlockClick event
  useEffect(() => {
    if (clearBlock.needClear === true && clearBlock.blockIdx != null) {
      // add video to block
      let tempBlocks = blocksWithPosition.slice();
      tempBlocks[clearBlock.blockIdx].encoder = {
        mac: "",
        previewUrl: "",
        nickName: "",
      };
      setBlocks(tempBlocks);
      setBlocksWithPosition(tempBlocks);
      setBlockEncoderMapping({
        ...blockEncoderMapping,
        [blocks[clearBlock.blockIdx].block]: "",
      });

      // add video to screens
      let tempScreens = tvWallScreens;
      tempScreens.forEach((screen, idx) => {
        if (screen.block === tempBlocks[clearBlock.blockIdx].block) {
          tempScreens[idx].encoder = { mac: "", previewUrl: "", nickName: "" };
        }
      });
      setTvWallScreens(tempScreens);

      // re-render wall
      setNeedUpdateBlocks(Math.random());

      // reset
      setClearBlock({ needClear: false, blockIdx: null });
    }
  }, [clearBlock]);

  return (
    <div id="tv-wall-container" style={{ width: "100%", height: "100%" }}>
      {wallHTML}
    </div>
  );
};

export default MultiView;
