import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import "../pages/Help.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: "16px",
    color: "#fff",
    width: "100%",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

function QueryTable({ items }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="accord-cont">
      {items.map((item) => {
        return (
          <Accordion
            expanded={expanded === item.name}
            onChange={handleChange(item.name)}
            className="accord-wth"
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              style={{ borderBottom: "1px solid grey" }}
            >
              <Typography className={classes.heading}>{item.name}</Typography>
            </AccordionSummary>
            {item.data.map((subitem) => (
              <AccordionDetails className="accord-subitem">
                <Typography component="h2" variant="body2">
                  {subitem.name}
                </Typography>
              </AccordionDetails>
            ))}
          </Accordion>
        );
      })}
    </div>
  );
}

export default QueryTable;
