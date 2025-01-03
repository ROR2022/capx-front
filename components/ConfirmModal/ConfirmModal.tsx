"use client";
import React, { useEffect, FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

//import { DataModalType } from "../Product/TableProducts";

export interface DataModalType {
  title: string;
  message: string;
  action: string;
  payload?: any;
}

interface ConfirmModalProps {
  dataModal: DataModalType | null;
  setDataModal: (dataModal: DataModalType | null) => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ dataModal, setDataModal }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //const { title, message, action } = dataModal;

  useEffect(() => {
    onOpen();
  }, []);

  const handleCancel = () => {
    onOpenChange();
    setDataModal(null);
  };

  const handleConfirm = () => {
    //console.log("Action: ", dataModal?.action);
    onOpenChange();
    setDataModal({
      title: "",
      message: "",
      action: "Confirmed",
      payload: dataModal?.payload,
    });
  };

  return (
    <div>
      {/* <Button onPress={onOpen}>Open Modal</Button> */}
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {
            //eslint-disable-next-line
            (onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {dataModal?.title}
                </ModalHeader>
                <ModalBody>
                  <p>{dataModal?.message}</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="default"
                    variant="light"
                    onPress={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    color={
                      dataModal?.action === "Delete" ? "danger" : "primary"
                    }
                    onPress={handleConfirm}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
