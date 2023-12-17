import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  fakewall1,
  fakewall2,
  fakewall3,
  fakewall4,
  FAKE_WALLS,
  blockColorList,
} from "../../utils/Constant";
import "../../App.scss";
import "./tvWall.scss";

const TvWall = () => {
  const [tvWallSize, setTvWallSize] = useState({ col: 4, row: 5 });
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [blocksWithPosition, setBlocksWithPosition] = useState([]);
  const [blocksByHtml, setBlocksByHtml] = useState([]);
  const screenSizeUnit = { horizontal: 60, straight: 40 };
  const fakewall = fakewall4;

  const getAboveScreen = (screen) => {
    if (screen.number > tvWallSize.col) {
      return fakewall[screen.number - tvWallSize.col - 1];
    } else return { block: "" };
  };

  const getLeftScreen = (screen) => {
    if (screen.number % tvWallSize.col === 1) return { block: "" };
    else return fakewall[screen.number - 2];
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
    fakewall.forEach((screen) => {
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
          marginLeft: (screen.number - 1) % tvWallSize.col,
        });
      }
    });
    setBlocks(tempBlocks);
  }, [fakewall]);

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
          key={block.block}
          style={{
            width: screenSizeUnit.horizontal * block.col,
            height: screenSizeUnit.straight * block.row,
            marginLeft: screenSizeUnit.horizontal * block.marginLeft,
            marginTop: screenSizeUnit.straight * block.marginTop,
            border: "1px dashed black",
          }}
        >
          <Button
            style={{ width: "100%", height: "100%" }}
            onClick={setVideoToBlock(index)}
          >
            <img
              style={{ width: "100%", height: "100%" }}
              src={block.video}
            ></img>
          </Button>
        </div>
      );

      currentAppearedRow = currentAppearedRow + block.row;
    });
    setTvWallTemplate(<div>{wall}</div>);
  }, [blocksWithPosition]);

  const setVideoToBlock = (blockIdx) => {
    //https://www.gstatic.com/webp/gallery3/2.png
    let tempBlocks = blocksWithPosition;
    tempBlocks[blockIdx].video = "https://www.gstatic.com/webp/gallery3/2.png";
    setBlocks(tempBlocks);
  };

  return <div>{tvWallTemplate}</div>;
};

export default TvWall;
