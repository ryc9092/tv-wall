import { useEffect, useState } from "react";
import { Button } from "antd";
import {
  fakewall1,
  fakewall2,
  fakewall3,
  fakewall4,
  FAKE_WALLS,
  blockColorList,
} from "../../utils/Constant";
import "../../App.scss";

const TvWall = ({ selectedWall, selectedTemplate }) => {
  const [tvWallScreens, setTvWallScreens] = useState(fakewall4);
  const [tvWallSize, setTvWallSize] = useState({ col: 4, row: 5 });
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [blocksWithPosition, setBlocksWithPosition] = useState([]);
  const [needUpdateBlocks, setNeedUpdateBlocks] = useState(null);
  const screenSizeUnit = { horizontal: 60, straight: 45 };

  useEffect(() => {
    let tempScreens = [];
    if (
      selectedWall &&
      selectedTemplate &&
      selectedWall.dimension.col === selectedTemplate.dimension.col &&
      selectedWall.dimension.row === selectedTemplate.dimension.row
    ) {
      selectedWall.screens.forEach((screen, idx) => {
        let tempScreen = screen;
        tempScreen.block = parseInt(selectedTemplate.screens[idx].block);
        tempScreens.push(tempScreen);
      });
      setTvWallScreens(tempScreens);
      setTvWallSize({
        col: selectedWall.dimension.col,
        row: selectedWall.dimension.row,
      });
    }
  }, [selectedWall, selectedTemplate]);

  const getAboveScreen = (screen) => {
    if (screen.number > tvWallSize.col) {
      return tvWallScreens[screen.number - tvWallSize.col - 1];
    } else return { block: "" };
  };

  const getLeftScreen = (screen) => {
    if (screen.number % tvWallSize.col === 1) return { block: "" };
    else return tvWallScreens[screen.number - 2];
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
          marginLeft: (screen.number - 1) % tvWallSize.col,
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
          <Button
            key={index}
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              setEncoder(index);
            }}
          >
            <img
              style={{ width: "100%", height: "100%" }}
              src={block.encoder?.video}
              alt={block.block}
            />
          </Button>
        </div>
      );

      currentAppearedRow = currentAppearedRow + block.row;
    });
    setTvWallTemplate(<div>{wall}</div>);
  }, [blocksWithPosition, needUpdateBlocks]);

  const setEncoder = (blockIdx, encoder) => {
    // let video = "https://www.gstatic.com/webp/gallery3/2.png"; // encoder.video;
    encoder = { video: "https://www.gstatic.com/webp/gallery3/2.png" };

    // add video to block
    let tempBlocks = blocksWithPosition;
    tempBlocks[blockIdx].encoder = encoder;
    setBlocks(tempBlocks);

    // add video to screens
    let tempScreens = tvWallScreens;
    tempScreens.forEach((screen, idx) => {
      if (screen.block === tempBlocks[blockIdx].block) {
        tempScreens[idx].encoder = encoder;
      }
    });
    setTvWallScreens(tempScreens);

    // re-render wall
    setNeedUpdateBlocks(Math.random);
  };

  return <div>{tvWallTemplate}</div>;
};

export default TvWall;
