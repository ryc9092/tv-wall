import { useState } from "react";
import { Button, Input, Modal } from "antd";
import "./tvWallTemplate.scss";

const TVWallTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tvWallCol, setTvWallCol] = useState(1);
  const [tvWallRow, setTvWallRow] = useState(1);

  const j = Array.from(Array(tvWallCol));
  let cell = (
    <>
      {j.map((item) => {
        return (
          <td key={Math.random()}>
            <Button key={Math.random()} />
          </td>
        );
      })}
    </>
  );

  const i = Array.from(Array(tvWallRow));
  let test = (
    <table>
      <tbody>
        {i.map((item) => {
          return <tr key={Math.random()}>{cell}</tr>;
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
        <Input
          type="number"
          defaultValue={1}
          min={1}
          max={20}
          onChange={(e) => {
            setTvWallCol(parseInt(e.target.value));
          }}
        ></Input>
        <Input
          type="number"
          defaultValue={1}
          min={1}
          max={20}
          onChange={(e) => {
            setTvWallRow(parseInt(e.target.value));
          }}
        ></Input>
        {test}
      </Modal>
    </div>
  );
};

export default TVWallTemplate;
