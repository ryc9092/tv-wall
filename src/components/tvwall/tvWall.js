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
import { FAKE_WALLS, blockColorList } from "../../utils/Constant";
import "../../App.scss";
import "./tvWall.scss";

const fakewall = [
  {
    number: 1,
    decoder: "解碼器1",
    block: 1,
  },
  {
    number: 2,
    decoder: "解碼器2",
    block: 1,
  },
  {
    number: 3,
    decoder: "解碼器3",
    block: 1,
  },
  {
    number: 4,
    decoder: "解碼器4",
    block: 2,
  },
  {
    number: 5,
    decoder: "解碼器5",
    block: 1,
  },
  {
    number: 6,
    decoder: "解碼器6",
    block: 1,
  },
  {
    number: 7,
    decoder: "解碼器7",
    block: 1,
  },
  {
    number: 8,
    decoder: "解碼器8",
    block: 3,
  },
  {
    number: 9,
    decoder: "解碼器61",
    block: 1,
  },
  {
    number: 10,
    decoder: "解碼器71",
    block: 1,
  },
  {
    number: 11,
    decoder: "解碼器81",
    block: 1,
  },
  {
    number: 12,
    decoder: "解碼器611",
    block: 4,
  },
];

const TvWall = () => {
  const [tvWallSize, setTvWallSize] = useState({ col: 4, row: 3 });
  const [tvWallTemplate, setTvWallTemplate] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const screenSizeUnit = 40;

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
        });
      }
    });
    setBlocks(tempBlocks);
  }, [fakewall]);

  useEffect(() => {
    // create tv wall template
    let wall = [];
    let currentColInRows = {};
    for (let i = 1; i <= tvWallSize.row; i++) {
      currentColInRows[i] = 0;
    }

    // let currentCol = 0;
    // let currentRow = 0;
    blocks.forEach((block) => {
      // add to this row
      // if (currentCol < tvWallSize.col) {
      //   // margin =
      //   // add to next row
      // } else {
      // }

      wall.push(
        <div
          key={block.block}
          style={{
            width: screenSizeUnit * block.col,
            height: screenSizeUnit * block.row,
            border: "1px dashed black",
          }}
        >
          {block.block}
        </div>
      );
    });
    setTvWallTemplate(<div>{wall}</div>);
  }, [blocks]);

  return (
    <div>
      {/* <div
        style={{
          width: screenSizeUnit * tvWallSize.col,
          height: screenSizeUnit * tvWallSize.row,
          border: "1px solid black",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 79,
            height: 79,
            border: "1px dashed black",
            display: "inline-block",
          }}
        >
          1
        </div>
        <div
          style={{
            width: 79,
            height: 39,
            border: "1px dashed black",
            display: "inline-block",
          }}
        >
          2
        </div>
        <div
          style={{
            width: 79,
            height: 39,
            border: "1px dashed black",
            display: "inline-block",
          }}
        >
          3
        </div>
        <div
          style={{
            width: 79,
            height: 79,
            marginTop: -40,
            border: "1px dashed black",
            display: "inline-block",
          }}
        >
          4
        </div> */}
      {/* <div
          style={{
            width: 79,
            height: 39,
            marginTop: -40,
            border: "1px dashed black",
            display: "inline-block",
          }}
        >
          5
        </div>
      </div> */}
      {tvWallTemplate}

      {/* <table>
        <thead>
          <tr>
            <th colSpan="2" rowSpan="3">
              test
            </th>
            <th colSpan="2" rowSpan="2">
              test
            </th>
            <th>test</th>
            <td>test</td>
            <th>test</th>
          </tr>
          <tr>
            <th colSpan="2" rowSpan="3">
              test
            </th>
            <th>test</th>
            <th>test</th>
            <th>test</th>
          </tr>
          <tr>
            <th>test</th>
            <th>test</th>
            <th>test</th>
            <th>test</th>
          </tr>
          <tr>
            <th>test</th>
            <th>test</th>
            <th>test</th>
            <th>test</th>
          </tr>
        </thead>
      </table> */}

      {/* <table>
        <tbody>
          <tr>
            <td colSpan="2" rowSpan="3">
              test
            </td>
            <td colSpan="2" rowSpan="2">
              test
            </td>
          </tr>
          <tr>
            <td colSpan="2" rowSpan="3">
              test
            </td>
            <td colSpan="2" rowSpan="4">
              test
            </td>
          </tr>
        </tbody>
      </table> */}

      {/* <table
        border="1"
        cellSpacing="5"
        cellPadding="5"
        summary="This table combines colspan and rowspan"
        style={{ margin: 12 }}
      >
        <tbody>
          <tr>
            <td colSpan="2" rowSpan="2">
              data
            </td>
            <td>data</td>
          </tr>
          <tr>
            <td>data</td>
          </tr>
          <tr>
            <td>data</td>
            <td>data</td>
            <td>data</td>
          </tr>
          <tr>
            <td>data</td>
            <td>data</td>
            <td>data</td>
          </tr>
        </tbody>
      </table> */}

      {/* <table
        border="1"
        cellSpacing="5"
        cellPadding="5"
        summary="This table combines colspan and rowspan"
        style={{ margin: 12 }}
      >
        <tbody>
          <tr>
            <td colSpan="2" rowSpan="2">
              data
            </td>
            <td colSpan="2" rowSpan="3">
              data
            </td>
          </tr>
          <tr>
            <td>1</td>
          </tr>
          <tr>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
          </tr>
          <tr>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};

export default TvWall;
