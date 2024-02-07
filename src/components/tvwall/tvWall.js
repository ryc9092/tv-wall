import { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { StoreContext } from "../../components/store/store";
import { getTemplateScreensById, getWallScreensById } from "../../api/API";
import { useDocumentDimensions } from "../../utils/WindowDimension";
import { FormattedMessage } from "react-intl";
import Messages from "../../messages";
import "../../App.scss";

const TvWall = ({
  selectedWall,
  selectedTemplate,
  selectedEncoder,
  clearTvWall,
}) => {
  const [store] = useContext(StoreContext);
  const { width, height } = useDocumentDimensions();
  const [tvWallScreens, setTvWallScreens] = useState([]);
  const [tvWallSize, setTvWallSize] = useState({ col: 0, row: 0 });
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [blocksWithPosition, setBlocksWithPosition] = useState([]);
  const [needUpdateBlocks, setNeedUpdateBlocks] = useState(null);
  const [clearBlock, setClearBlock] = useState({
    needClear: false,
    blockIdx: null,
  });

  useEffect(() => {
    let tempScreens = [];
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
        if (wallScreens && templateScreens) {
          wallScreens.forEach((screen, idx) => {
            let tempScreen = screen;
            tempScreen.encoder = "";
            tempScreen.block = parseInt(templateScreens[idx].block);
            tempScreens.push(tempScreen);
          });
        }
        setTvWallScreens(tempScreens);
        setTvWallSize({
          col: selectedWall.col,
          row: selectedWall.row,
        });
      })();
    }
  }, [selectedWall, selectedTemplate, clearTvWall]);

  const getAboveScreen = (screen) => {
    if (screen.num > tvWallSize.col) {
      return tvWallScreens[screen.num - tvWallSize.col - 1];
    } else return { block: "" };
  };

  const getLeftScreen = (screen) => {
    if (screen.num % tvWallSize.col === 1) return { block: "" };
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
    setBlocksWithPosition(tempBlocks);
  }, [blocks]);

  useEffect(() => {
    let wall = [];
    let currentAppearedRow = 0;
    blocksWithPosition.forEach((block, index) => {
      wall.push(
        <div
          key={index}
          style={{
            width: ((width * 0.34) / tvWallSize.col) * block.col,
            height: (((height - 105) * 0.5) / tvWallSize.row) * block.row,
            marginLeft: ((width * 0.34) / tvWallSize.col) * block.marginLeft,
            marginTop:
              (((height - 105) * 0.5) / tvWallSize.row) * block.marginTop,
            border: "1px solid black",
          }}
        >
          <div
            key={index}
            style={{ width: "100%", height: "100%", cursor: "pointer" }}
            onClick={() => {
              onBlockClick(index);
            }}
          >
            {block.encoder?.previewUrl ? (
              <>
                <embed
                  style={{ width: "100%", height: "100%" }}
                  src={block.encoder?.previewUrl}
                  title="Video player"
                />
                <Button
                  key={index}
                  onClick={() => {
                    setClearBlock({ needClear: true, blockIdx: index });
                  }}
                  size="small"
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    left: ((width * 0.34) / tvWallSize.col) * block.marginLeft,
                    opacity: "0.8",
                  }}
                >
                  <FormattedMessage {...Messages.Text_TVWall_ClearBlock} />
                </Button>
              </>
            ) : (
              <>
                <div style={{ position: "absolute" }}>
                  <FormattedMessage {...Messages.Text_Common_Block} />:{" "}
                  {block.block}
                  <br></br>
                  <FormattedMessage {...Messages.Text_Common_Dimension} />:{" "}
                  {block.col} X {block.row}
                </div>
                {generateBlockTable(block.col, block.row)}
              </>
            )}
          </div>
        </div>
      );

      currentAppearedRow = currentAppearedRow + block.row;
    });
    setTvWallTemplate(<div>{wall}</div>);
  }, [blocksWithPosition, selectedEncoder, needUpdateBlocks, width, height]);

  // setClearBlock take effect after onBlockClick event
  useEffect(() => {
    if (clearBlock.needClear === true && clearBlock.blockIdx != null) {
      // add video to block
      let tempBlocks = blocksWithPosition.slice();
      tempBlocks[clearBlock.blockIdx].encoder = { name: "", previewUrl: "" };
      setBlocks(tempBlocks);
      setBlocksWithPosition(tempBlocks);

      // add video to screens
      let tempScreens = tvWallScreens;
      tempScreens.forEach((screen, idx) => {
        if (screen.block === tempBlocks[clearBlock.blockIdx].block) {
          tempScreens[idx].encoder = { name: "", previewUrl: "" };
        }
      });
      setTvWallScreens(tempScreens);

      // re-render wall
      setNeedUpdateBlocks(Math.random);

      // reset
      setClearBlock({ needClear: false, blockIdx: null });
    }
  }, [clearBlock]);

  const onBlockClick = (blockIdx) => {
    // add video to block
    let tempBlocks = blocksWithPosition.slice();
    tempBlocks[blockIdx].encoder = selectedEncoder;
    setBlocks(tempBlocks);
    setBlocksWithPosition(tempBlocks);

    // add video to screens
    let tempScreens = tvWallScreens;
    tempScreens.forEach((screen, idx) => {
      if (screen.block === tempBlocks[blockIdx].block) {
        tempScreens[idx].encoder = selectedEncoder;
      }
    });
    setTvWallScreens(tempScreens);

    // re-render wall
    setNeedUpdateBlocks(Math.random);
  };

  const generateBlockTable = (col, row) => {
    const tempRows = [];
    for (let r = 0; r < row; r++) {
      let tempRow = [];
      for (let c = 0; c < col; c++) {
        tempRow.push(
          <td
            key={r.toString() + c.toString()}
            style={{
              width: (width * 0.34) / tvWallSize.col,
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
            height: ((height - 105) * 0.5) / tvWallSize.row,
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
          borderCollapse: "collapse",
          marginTop: -1,
          marginLeft: -1,
        }}
      >
        <tbody>{tempRows}</tbody>
      </table>
    );
  };

  return <div>{tvWallTemplate}</div>;
};

export default TvWall;
