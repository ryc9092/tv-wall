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
  const screenSizeUnit = 40;

  useEffect(() => {
    // create tv wall table
    let currentRow = 1;
    let tvWallTemplate = [];
    fakewall.forEach((screen, index) => {
      if (screen.number === 1) {
        tvWallTemplate.push({ block: screen.block, col: 1, row: 1 });
      }

      // go next row
      if (screen.number % tvWallSize.col === 0) {
        currentRow = currentRow + 1;
      }
    });
  }, [fakewall]);

  return (
    <div>
      <div
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
        ></div>
        <div
          style={{
            width: 79,
            height: 39,
            border: "1px dashed black",
            display: "inline-block",
          }}
        ></div>
        <div
          style={{
            width: 79,
            height: 39,
            border: "1px dashed black",
            display: "inline-block",
          }}
        ></div>
        <div
          style={{
            width: 79,
            height: 79,
            marginTop: -40,
            border: "1px dashed black",
            display: "inline-block",
          }}
        ></div>
      </div>

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
