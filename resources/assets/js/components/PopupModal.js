import React from "react";
import { Modal, Button } from "react-bootstrap";

function PopupModal(props) {
  const { title, list, show, handleClose } = props;
  return (
    <React.Fragment>
      <Modal
        style={{ backgroundColor: "rgb(0,0,0,0,0.7" }}
        show={show}
        onHide={handleClose}
        animation={false}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {list
            ? list.map((item, key) => {
                return (
                  <React.Fragment key={key}>
                    {item.titleList}
                    <ul>
                      {item.list.map((data, key1) => {
                        return <li key={key1}> {data}</li>;
                      })}
                    </ul>
                  </React.Fragment>
                );
              })
            : "NO REQUIRED DOCUMENTS"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
export default PopupModal;
