import { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { StoreContext } from "../../components/store/store";
import { getTemplateScreensById, getWallScreensById } from "../../api/API";
import "../../App.scss";

const TvWall = ({
  selectedWall,
  selectedTemplate,
  selectedEncoder,
  clearTvWall,
}) => {
  const [store] = useContext(StoreContext);
  const [tvWallScreens, setTvWallScreens] = useState([]);
  const [tvWallSize, setTvWallSize] = useState({ col: 0, row: 0 });
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [blocksWithPosition, setBlocksWithPosition] = useState([]);
  const [needUpdateBlocks, setNeedUpdateBlocks] = useState(null);
  const screenSizeUnit =
    tvWallSize.col * tvWallSize.row >= 25
      ? { horizontal: 60, straight: 45 }
      : tvWallSize.col * tvWallSize.row >= 16
      ? { horizontal: 80, straight: 60 }
      : { horizontal: 120, straight: 90 };

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
        wallScreens.forEach((screen, idx) => {
          let tempScreen = screen;
          tempScreen.encoder = "";
          tempScreen.block = parseInt(templateScreens[idx].block);
          tempScreens.push(tempScreen);
        });
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
            width: screenSizeUnit.horizontal * block.col,
            height: screenSizeUnit.straight * block.row,
            marginLeft: screenSizeUnit.horizontal * block.marginLeft,
            marginTop: screenSizeUnit.straight * block.marginTop,
            border: "1px dashed black",
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
                    onBlockClick(index);
                  }}
                  size="small"
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    left: screenSizeUnit.horizontal * block.marginLeft,
                    opacity: "0.8",
                  }}
                >
                  置換影像
                </Button>
              </>
            ) : null}
          </div>
        </div>
      );

      currentAppearedRow = currentAppearedRow + block.row;
    });
    setTvWallTemplate(<div>{wall}</div>);
  }, [blocksWithPosition, selectedEncoder, needUpdateBlocks]);

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

  return <div>{tvWallTemplate}</div>;
};

export default TvWall;
