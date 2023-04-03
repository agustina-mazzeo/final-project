import classes from "./Modal.module.css";
import { ReactNode } from "react";
const Backdrop = () => {
  return <div className={classes.backdrop} />;
};

const ModalOverlay = ({ children }: { children: ReactNode }) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

function Modal({ children }: { children: ReactNode }) {
  return (
    <>
      <Backdrop />
      <ModalOverlay>{children}</ModalOverlay>
    </>
  );
}

export default Modal;
