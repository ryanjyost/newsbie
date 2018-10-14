import React, { Component } from "react";
import axios from "axios";
import SingleTopic from "../SingleTopic";
import { Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";

export default class Test extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios
      .get(`https://birds-eye-news-api.herokuapp.com/test/10/50`, {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  render() {
    return <div>TEST</div>;
  }
}
