import { ReactNode } from "react";
import styles from "./modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ open, onClose, children }: ModalProps) => {
  if(!open) return null;
  
  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
