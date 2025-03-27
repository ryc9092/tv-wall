import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button } from "antd";
import { getTemplateScreensById, getWallScreensById } from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import { WALL_SCREEN_SIZE, POSITION_CLEAR_BTN } from "../../utils/Constant";
import ScreenBackgroundImage from "../../assets/screenBackground.png";
import ClearLinkIcon from "../../assets/clearLink.png";
import ClearLinkDisabledIcon from "../../assets/clearLinkDisabled.png";
import "./tvWall.scss";
import "../../App.scss";

const TvWall = ({
  selectedWall,
  selectedTemplate,
  selectedEncoder,
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
  const [tvWallSize, setTvWallSize] = useState({ col: 0, row: 0 });

  useEffect(() => {
    let tempScreens = [];
    let tempBlocksDetail = [];
    if (
      selectedWall &&
      selectedTemplate &&
      selectedWall.col === selectedTemplate.col &&
      selectedWall.row === selectedTemplate.row
    ) {
      (async () => {
        const templateScreens = await getTemplateScreensById(
          store,
          selectedTemplate.templateId
        );
        const wallScreens = await getWallScreensById(
          store,
          selectedWall.wallId
        );
        wallScreens.sort(function (wall1, wall2) {
          return wall1.num - wall2.num;
        });
        if (
          wallScreens &&
          templateScreens &&
          blockEncoderMapping &&
          Object.keys(blockEncoderMapping).length >= 0
        ) {
          wallScreens.forEach((screen, idx) => {
            let tempScreen = screen;
            tempScreen.encoder = blockEncoderMapping.hasOwnProperty(
              templateScreens[idx].block
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
                blockCol < selectedWall.col
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
          col: selectedWall.col,
          row: selectedWall.row,
        });
        setBlocksDetail(tempBlocksDetail);
        setSelectedBlockNumber(null);
      })();
    }
  }, [
    selectedWall,
    selectedTemplate,
    store,
    setSelectedBlockNumber,
    setBlocksDetail,
    blockEncoderMapping,
  ]);

  const [wallHTML, setWallHTML] = useState();
  useEffect(() => {
    let wallBlocksHTML = [];
    if (tvWallSize.col !== 0) {
      blocksDetail?.forEach((block) => {
        wallBlocksHTML.push(
          <div
            className="wall-block-outer"
            style={{
              width: block.col * WALL_SCREEN_SIZE,
              height: block.row * WALL_SCREEN_SIZE,
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
                width: block.col * WALL_SCREEN_SIZE - 4,
                height: block.row * WALL_SCREEN_SIZE - 4,
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
                  <FormattedMessage {...Messages.Text_Common_Block} />{" "}
                  {block.block}
                </span>
              </div>
              <div id={block.block}>
                <div id={block.block} className="wall-block-desc">
                  <FormattedMessage {...Messages.Text_Common_Dimension} />
                  {": "}
                  {block.col} X {block.row}
                </div>
              </div>
              <div id={block.block}>
                <div id={block.block} className="wall-block-desc">
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} />
                  {": "}{" "}
                  {blockEncoderMapping[block.block]?.nickName
                    ? blockEncoderMapping[block.block].nickName
                    : intl.formatMessage(Messages.Text_Common_None)}
                </div>
              </div>
              <div id={block.block}>
                <div id={block.block} className="wall-block-desc">
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div>
                      <FormattedMessage {...Messages.Text_Common_Decoder} />
                      {":"}
                    </div>
                    <div>
                      {blocksDetail?.map((detail) => {
                        if (detail.block === block.block)
                          return detail.detail?.map((detail) => {
                            return (
                              <span style={{ marginLeft: 4 }}>
                                {detail.nickName}
                                <br />
                              </span>
                            );
                          });
                        else return null;
                      })}
                    </div>
                  </div>
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
                      height: 34,
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
                      height: 34,
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
          </div>
        );
      });
    }
    setWallHTML(
      <div id="wallScreens" style={{ position: "absolute" }}>
        {wallBlocksHTML}
      </div>
    );
  }, [
    blocksDetail,
    tvWallSize,
    selectedBlockNumber,
    blockEncoderMapping,
    intl,
    setSelectedBlockNumber,
  ]);

  return (
    <div
      id="tv-wall-container"
      style={{
        padding: 3,
        width: tvWallSize.col * WALL_SCREEN_SIZE + 6,
        height: tvWallSize.row * WALL_SCREEN_SIZE + 6,
        borderRadius: 12,
        backgroundColor: "white",
      }}
    >
      {wallHTML}
    </div>
  );
};

export default TvWall;
