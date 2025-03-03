import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { Button } from "antd";
import { getTemplateScreensById, getWallScreensById } from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
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
              width: block.col * 240,
              height: block.row * 240,
              left: ((block.smallestScreenNum - 1) % tvWallSize.col) * 240,
              top:
                Math.floor((block.smallestScreenNum - 1) / tvWallSize.col) *
                240,
              backgroundImage: blockEncoderMapping[block.block]?.nickName
                ? `url(${ScreenBackgroundImage})`
                : null,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              id={block.block}
              className={
                selectedBlockNumber?.toString() === block.block?.toString()
                  ? "wall-block-selected"
                  : "wall-block"
              }
              style={{
                width: block.col * 240 - 4,
                height: block.row * 240 - 4,
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
                className="single-screen-btn-position"
                style={{
                  marginLeft: 95 + (block.col - 1) * 240,
                  marginTop: 55 + (block.row - 1) * 240,
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
        width: tvWallSize.col * 240 + 6,
        height: tvWallSize.row * 240 + 6,
        borderRadius: 12,
        backgroundColor: "white",
      }}
    >
      {wallHTML}
    </div>
  );
};

export default TvWall;
