import React from "react";
import { Container } from "@material-ui/core";
import Github from "../assets/icons/Octocat.png";
import LinkedIn from "../assets/icons/linkedin.png";
import Instagram from "../assets/icons/instagram.png";
import "./AboutUs.css";

function AboutUs() {
  return (
    <Container component="main">
      <div className="top-container">
        <span className="headline">About StreamPlay</span>
      </div>
      <div className="about-text-cont1">
        <div className="about-text1">
          <span style={{ fontSize: "35px", color: "#ffcc33" }}>S</span>treamPlay
          is a video streaming and uploading Web Application, just like Youtube.
          StreamPlay gives priority to user's info, It uses Google-OAth for
          authentication. One can watch streams, comment and like, dislike a
          stream. User have an option to subscribe the channel and can see all
          his/her streams. Searching is a major feature of any stream playing
          web application, for that reason StreamPlay also gives a feature to
          search any video by his title. It's a MERN based web application,
          which uses{" "}
          <u>
            <a href="https://cloudinary.com/" style={{ color: "#d1d1d1" }}>
              Cloudinary
            </a>
          </u>{" "}
          for saving video/images on cloud. It uses{" "}
          <u>
            <a
              href="https://ffmpeg.org/download.html"
              style={{ color: "#d1d1d1" }}
            >
              <i>ffmpeg</i>
            </a>
          </u>{" "}
          external module in <span>Window & Linux</span> for creating thumbnail
          from a video. StreamPlay's user interface experience is Exciting and
          Amazing!!
        </div>
      </div>
      <div className="main-cont">
        <div className="left-cont1">
          <div className="icon-container">
            <div className="icon-box">
              <img
                src={Github}
                alt="github"
                href="https://github.com/A-phenomenal1"
                className="icon"
              />
            </div>
            <div className="icon-box">
              <img
                src={LinkedIn}
                alt="github"
                href="https://www.linkedin.com/in/niteshkumar89/"
                className="icon"
              />
            </div>
            <div className="icon-box">
              <img
                src={Instagram}
                alt="github"
                href="https://www.instagram.com/a_phenomenal1/"
                className="icon"
              />
            </div>
          </div>
          <span className="author-name">
            Nitesh Kumar{" "}
            <span className="sub-name">
              <i>[Developer]</i>
            </span>
          </span>
          <div className="about-text-cont2">
            <span className="about-text2">
              Nitesh Kumar has 3 months of experience in an Ed-Tech Startup
              named Scienovelx Education and Technology Pvt Ltd. He is currently
              in 3rd year of his B.Tech from G.H. Raisoni Institute of
              Engineering and Technology Pune. He has an aggregate score of 9.0
              CGPA till 3rd Semester. In Technical skills, He is core C++
              programmer, and also have a good understanding of C and Python
              programming language. In Development Skills, He have an excellent
              knowledge of MERN stack and dev-tools like Postman, Heroku,
              PhpAdmin, GitHub etc. With the help of these skills, He have
              engineered a variety projects in field of App Development,
              Frontend plus Backend Development and Full Stack Development. In
              extra-curricular activities, He enjoy listening music and love to
              learn about new tetechnologies. Coming to his day track, He uses a
              major time in enhancing his skills. He is a very focused person,
              and always try to complete a task in quick and efficient manner.
              He is an optimistic person in difficult time.
            </span>
          </div>
        </div>

        <div className="author-img-cont">
          <img
            src="https://res.cloudinary.com/immortal-0298/image/upload/v1624353236/me1_rrfhj1.jpg"
            alt="mypic"
            className="author-image"
          />
          <div className="mysign">Nitesh Kumar</div>
        </div>
      </div>
    </Container>
  );
}

export default AboutUs;
