import { useState } from "react";
import { Button, Col, Input, Modal, Row } from "antd";
import "./tvWallTemplate.scss";

const TVWallTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tvWallCol, setTvWallCol] = useState(1);
  const [tvWallRow, setTvWallRow] = useState(1);

  const col = Array.from(Array(tvWallCol));
  let screen = (
    <>
      {col.map(() => {
        return (
          <td key={Math.random()}>
            <Button key={Math.random()} />
          </td>
        );
      })}
    </>
  );

  const row = Array.from(Array(tvWallRow));
  let tvWall = (
    <table>
      <tbody>
        {row.map(() => {
          return <tr key={Math.random()}>{screen}</tr>;
        })}
      </tbody>
    </table>
  );

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>建立牆面版型</Button>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Row>
          <Col>{"電視牆大小: "}</Col>
          <Col>
            <Input
              type="number"
              defaultValue={1}
              min={1}
              max={6}
              size="small"
              onChange={(e) => {
                const col = parseInt(e.target.value);
                if (col > 0 && col <= 6) setTvWallCol(col);
              }}
            ></Input>
          </Col>
          <Col>{" X "}</Col>
          <Col>
            <Input
              type="number"
              defaultValue={1}
              min={1}
              max={6}
              size="small"
              onChange={(e) => {
                const row = parseInt(e.target.value);
                if (row > 0 && row <= 6) setTvWallRow(row);
              }}
            ></Input>
          </Col>
        </Row>
        <Row>
          <Col>{tvWall}</Col>
          <Col>
            <Row>
              <Button>畫面1</Button>
            </Row>
            <Row>
              <Button>畫面2</Button>
            </Row>
            <Row>
              <Button>畫面3</Button>
            </Row>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default TVWallTemplate;
