import React, { useState } from "react";
import { Container, Typography } from "@material-ui/core";
import Loader from "./Loader";

function Temp({ page }) {
  const [loading, setLoading] = useState(true);

  return (
    <Container component="main">
      <div>
        <Typography component="h2" variant="h5" className="home-title">
          {page}
        </Typography>
        <div className="underline" />
        <div style={{ marginTop: "1em" }} />
        <div className="vids-container">{loading ? <Loader /> : null}</div>
      </div>
    </Container>
  );
}

export default Temp;
