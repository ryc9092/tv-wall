import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../components/store/store";
import { getTemplateScreensById, getWallScreensById } from "../../api/API";
import { FormattedMessage, useIntl } from "react-intl";
import Messages from "../../messages";
import "./tvWall.scss";
import "../../App.scss";

const TvWall = ({
  wallWidth,
  wallHeight,
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
  const [currentBlock, setCurrentBlock] = useState(null);

  const handleBlockMouseEnter = (event) => {
    const itemId = event.target.id;
    setCurrentBlock(itemId);
  };

  const handleBlockMouseLeave = () => {
    setCurrentBlock(null);
  };

  const [blocksDetail, setBlocksDetail] = useState([]); // [{block: 1, smallestScreenNum: 1, col: 1, row: 1, details: [...]}]
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
        if (wallScreens && templateScreens) {
          wallScreens.forEach((screen, idx) => {
            let tempScreen = screen;
            tempScreen.encoder = "";
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
        setTvWallScreens(tempScreens);
        setTvWallSize({
          col: selectedWall.col,
          row: selectedWall.row,
        });
        setBlocksDetail(tempBlocksDetail);
        setWallReloaded(false);
        setSelectedBlockNumber(null);
      })();
    }
  }, [selectedWall, selectedTemplate]);

  const [wallHTML, setWallHTML] = useState();
  useEffect(() => {
    let wallBlocksHTML = [];
    if (tvWallSize.col !== 0) {
      console.log(blocksDetail);
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
              zIndex: 100,
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
            </div>
          </div>
        );
      });
    }
    setWallHTML(
      <div
        id="wallScreens"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        {wallBlocksHTML}
      </div>
    );
  }, [blocksDetail, tvWallSize, selectedBlockNumber]);

  const getAboveScreen = (screen) => {
    if (screen.num > tvWallSize.col) {
      return tvWallScreens[screen.num - tvWallSize.col - 1];
    } else return { block: "" };
  };

  const getLeftScreen = (screen) => {
    if (screen.num === 1 || screen.num % tvWallSize.col === 1)
      return { block: "" };
    else return tvWallScreens[screen.num - 2];
  };

  const updateBlocks = (blocks, blockNumber, addCol, addRow, addDecoder) => {
    blocks.forEach((block, index) => {
      if (block.block === blockNumber) {
        blocks[index].col = blocks[index].col + addCol;
        blocks[index].row = blocks[index].row + addRow;
        blocks[index].decoder.push(addDecoder);
      }
    });
    return blocks;
  };

  useEffect(() => {
    // create tv blocks col, row list
    let tempBlocks = [];
    tvWallScreens.forEach((screen) => {
      const aboveScreen = getAboveScreen(screen);
      const leftScreen = getLeftScreen(screen);
      const block = screen.block;
      const decoder = screen.decoder;
      if (aboveScreen.block === block && leftScreen.block === block) {
        tempBlocks = updateBlocks(tempBlocks, block, 0, 0, decoder);
      } else if (aboveScreen.block === block && leftScreen.block !== block) {
        tempBlocks = updateBlocks(tempBlocks, block, 0, 1, decoder);
      } else if (aboveScreen.block !== block && leftScreen.block === block) {
        tempBlocks = updateBlocks(tempBlocks, block, 1, 0, decoder);
      } else if (aboveScreen.block !== block && leftScreen.block !== block) {
        tempBlocks.push({
          col: 1,
          row: 1,
          block: block,
          decoder: [decoder],
          encoder: screen.encoder,
          marginLeft: (screen.num - 1) % tvWallSize.col,
        });
      }
    });
    setBlocks(tempBlocks);
  }, [tvWallScreens]);

  useEffect(() => {
    // create blocks list with margin top info
    let currentColInRows = {};
    for (let i = 0; i < tvWallSize.row; i++) {
      currentColInRows[i] = 0;
    }

    let marginTop = 0;
    let tempBlocks = blocks;
    blocks.forEach((block, index) => {
      // for row in rows
      for (const [row, col] of Object.entries(currentColInRows)) {
        // if row.col < tv wall col
        if (col < tvWallSize.col) {
          // set margin top information
          tempBlocks[index].marginTop = parseInt(marginTop);
          if (marginTop !== 0) marginTop = 0;
          // update used row & col information
          for (let i = 0; i < block.row; i++) {
            if (
              currentColInRows[parseInt(row) + i] + block.col <
              tvWallSize.col
            )
              marginTop = marginTop - 1;
            currentColInRows[parseInt(row) + i] =
              currentColInRows[parseInt(row) + i] + block.col;
          }
          break;
        }
      }
    });

    // set encoder info to block to active tv wall at first time
    if (isActivedWall) {
      tempBlocks.forEach((block) => {
        block.encoder = blockEncoderMapping[block.block];
      });
    }
    setBlocksWithPosition(tempBlocks);
  }, [blocks, blockEncoderMapping]);

  const modifyVideoSize = (previewUrl, width, height) => {
    const hostname = previewUrl.split("?")[0];
    const modifiedUrl = `${hostname}?action=stream&w=${width}&h=${height}&fps=15&bw=5000&as=0`;
    return modifiedUrl;
  };

  useEffect(() => {
    let wall = [];
    let currentAppearedRow = 0;
    blocksWithPosition.forEach((block, index) => {
      wall.push(
        <div
          key={index}
          style={{
            width: `${(100 / selectedWall.col) * block.col}%`,
            height: `${(100 / tvWallSize.row) * block.row}%`,
            marginLeft: `${(100 / selectedWall.col) * block.marginLeft}%`,
            marginTop: `${
              (document.getElementById("tv-wall-container").clientHeight /
                tvWallSize.row) *
              block.marginTop
            }px`,
            border: "1px solid #a5a5a5",
            cursor: "pointer",
          }}
          onClick={() => {
            onBlockClick(index);
          }}
        >
          <div
            id={`screen-${block.block}`}
            style={{ width: "100%", height: "100%" }}
            onMouseEnter={handleBlockMouseEnter}
            onMouseLeave={handleBlockMouseLeave}
          >
            {block.encoder?.previewUrl ? (
              <iframe
                style={{
                  width: document.getElementById(`screen-${block.block}`)
                    ?.clientWidth,
                  height: document.getElementById(`screen-${block.block}`)
                    ?.clientHeight,
                  position: "absolute",
                  overflow: "hidden",
                  border: 0,
                }}
                src={modifyVideoSize(
                  block.encoder?.previewUrl,
                  document.getElementById(`screen-${block.block}`)?.clientWidth,
                  document.getElementById(`screen-${block.block}`)?.clientHeight
                )}
                // src={block.encoder?.previewUrl}
                title="Video player"
              />
            ) : null}
            <div
              style={{
                width: document.getElementById(`screen-${block.block}`)
                  ?.clientWidth
                  ? document.getElementById(`screen-${block.block}`)
                      ?.clientWidth
                  : 180,
                height: document.getElementById(`screen-${block.block}`)
                  ?.clientHeight
                  ? document.getElementById(`screen-${block.block}`)
                      ?.clientHeight
                  : 180,
                position: "absolute",
              }}
            >
              <div
                id={`screen-cover-${block.block}`}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  padding: "12px",
                  zIndex: 10,
                  opacity: 0.8,
                  backgroundColor:
                    currentBlock === `screen-cover-${block.block}`
                      ? "gray"
                      : null,
                }}
              >
                <span
                  style={
                    currentBlock === `screen-cover-${block.block}`
                      ? { color: "white" }
                      : {}
                  }
                  className="wall-block-title"
                >
                  {block.encoder?.previewUrl &&
                  currentBlock === `screen-cover-${block.block}` ? (
                    <span>
                      <FormattedMessage {...Messages.Text_Common_Block} />{" "}
                      {block.block}{" "}
                    </span>
                  ) : null}
                  {block.encoder?.previewUrl ? null : (
                    <FormattedMessage {...Messages.Text_TVWall_ConnectSource} />
                  )}
                </span>
                <br />
                <br />
                <span
                  className="wall-block-text"
                  style={
                    currentBlock === `screen-cover-${block.block}`
                      ? { color: "white" }
                      : { display: "none" }
                  }
                >
                  <FormattedMessage {...Messages.Text_Common_Dimension} /> :{" "}
                  {block.col} X {block.row}
                </span>
                <br />
                <span
                  className="wall-block-text"
                  style={
                    currentBlock === `screen-cover-${block.block}`
                      ? { color: "white" }
                      : { display: "none" }
                  }
                >
                  <FormattedMessage {...Messages.Text_TVWall_VideoSource} /> :{" "}
                  {block.encoder?.previewUrl
                    ? block.encoder.nickName
                    : intl.formatMessage(Messages.Text_Common_None)}
                </span>
              </div>
              {generateBlockTable(block.col, block.row, block.block)}
            </div>
          </div>
        </div>
      );

      currentAppearedRow = currentAppearedRow + block.row;
    });
    setTvWallTemplate(
      <div id="wallScreens" style={{ width: "100%", height: "100%" }}>
        {wall}
      </div>
    );
  }, [
    blocksWithPosition,
    selectedEncoder,
    needUpdateBlocks,
    wallWidth,
    wallHeight,
    currentBlock,
    reloadWall,
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

  const onBlockClick = (blockIdx) => {
    if (selectedEncoder.previewUrl) {
      // add video to block
      let tempBlocks = blocksWithPosition.slice();
      tempBlocks[blockIdx].encoder = selectedEncoder;
      setBlocks(tempBlocks);
      setBlocksWithPosition(tempBlocks);
      setBlockEncoderMapping({
        ...blockEncoderMapping,
        [blocks[blockIdx].block]: selectedEncoder,
      });

      // add video to screens
      let tempScreens = tvWallScreens;
      tempScreens.forEach((screen, idx) => {
        if (screen.block === tempBlocks[blockIdx].block) {
          tempScreens[idx].encoder = selectedEncoder;
        }
      });
      setTvWallScreens(tempScreens);

      // re-render wall
      setNeedUpdateBlocks(Math.random());
    }
  };

  const generateBlockTable = (col, row, block) => {
    const tempRows = [];
    for (let r = 0; r < row; r++) {
      let tempRow = [];
      for (let c = 0; c < col; c++) {
        tempRow.push(
          <td
            id={block}
            key={r.toString() + c.toString()}
            style={{
              width: `${100 / tvWallSize.col}%`,
              border: "1px dashed #D7DBDD",
              borderStyle:
                c === 0 ? "none none none none" : "none none none dashed",
            }}
          />
        );
      }
      tempRows.push(
        <tr
          key={r.toString()}
          style={{
            height: `${100 / tvWallSize.row}%`,
            border: "1px dashed #D7DBDD",
            borderStyle:
              r === 0 ? "none none none none" : "dashed none none none",
          }}
        >
          {tempRow}
        </tr>
      );
    }
    return (
      <table
        style={{
          width: "100%",
          height: "100%",
          borderCollapse: "collapse",
          marginTop: -1,
          marginLeft: -1,
        }}
      >
        <tbody style={{ width: "100%", height: "100%" }}>{tempRows}</tbody>
      </table>
    );
  };

  return (
    <div
      id="tv-wall-container"
      style={{
        padding: 6,
        width: tvWallSize.col * 240 + 12,
        height: tvWallSize.row * 240 + 12,
        borderRadius: 12,
        backgroundColor: "white",
      }}
    >
      {wallHTML}
      {/* {tvWallTemplate} */}
    </div>
  );
};

export default TvWall;
