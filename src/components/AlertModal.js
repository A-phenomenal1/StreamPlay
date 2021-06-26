import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    border: "2px solid #000",
    padding: theme.spacing(2, 4, 3),
    Width: "90%",
    color: "#ffffff",
  },
}));

function AlertModal({ hideModal, message, children }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    hideModal();
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{message[0]}</h2>
            {children === undefined ? (
              <p id="transition-modal-description">{message[1]}</p>
            ) : (
              children
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default AlertModal;
