import React, { useState } from "react";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import logo from "../assets/icons/streamplay3.png";
import "./Contact.css";
import dev from "../api/dev";
import Loader from "../components/Loader";
import AlertModal from "../components/AlertModal";

function Contact() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState({ isShow: false, message: [] });

  const handleSend = () => {
    const { name, email, subject, message } = state;
    if (name === "" || email === "" || subject === "" || message === "")
      setError(true);
    else {
      setLoading(true);
      fetch(`${dev.BaseUrl}/users/sendmail`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.success) {
            setShowModal({
              isShow: true,
              message: ["Mail sent.", `We will come back soon.`],
            });
            window.location.reload(false);
          } else {
            setShowModal({
              isShow: true,
              message: [
                "Empty email & password",
                `You should enter email and pasword in sendMail.js in helper folder on server`,
              ],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {loading ? <Loader type="spin" /> : null}
      <Container component="main">
        {showModal.isShow ? (
          <AlertModal
            hideModal={() =>
              setShowModal((prev) => ({ ...prev, isShow: false }))
            }
            message={showModal.message}
          />
        ) : null}
        <div>
          <Typography component="h2" variant="h5" className="home-title">
            Contact us
          </Typography>
          <div className="underline" />
          <div style={{ marginTop: "1em" }} />
          <div className="main-cont">
            <Container className="left-cont">
              <div className="ContactInfo">
                <table>
                  <tr>
                    <th>
                      <h4>Contact Information</h4>
                      <span className="underline" />
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <span>Address: </span>
                      <p>198 West 21th Street, Suite 721 New York NY 10016</p>
                    </th>
                  </tr>

                  <tr>
                    <th>
                      <span>Phone: </span>
                      <a>+ 1235 2355 98</a>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Email: <a>info@streamplay.com</a>{" "}
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Website: <a>www.streamplay.com</a>
                    </th>
                  </tr>
                </table>
              </div>
            </Container>
            <Container className="right-cont">
              <div className="logo_container_contactPage">
                <img className="header_logo" src={logo} alt="" />
              </div>
              <TextField
                id="standard-name"
                label="Name"
                value={state.name}
                className="text-field"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, name: e.target.value }))
                }
                helperText={
                  state.name === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
              <TextField
                id="standard-email"
                label="Email"
                value={state.email}
                margin="normal"
                className="text-field"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, email: e.target.value }))
                }
                helperText={
                  state.email === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
              <TextField
                id="standard-subject"
                label="Subject"
                value={state.subject}
                className="text-field"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, subject: e.target.value }))
                }
                helperText={
                  state.subject === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
              <TextField
                id="standard-name"
                label="Message"
                autoComplete="message"
                multiline
                rows={4}
                value={state.message}
                className="text-field"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, message: e.target.value }))
                }
                helperText={
                  state.message === "" && error ? (
                    <span style={{ color: "red" }}>*Required Field</span>
                  ) : null
                }
              />
              <Button
                variant="contained"
                startIcon={<Send />}
                className="send-btn"
                onClick={handleSend}
              >
                Send an email
              </Button>
            </Container>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Contact;
