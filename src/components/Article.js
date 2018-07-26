import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";
import ReactImageMagnify from "react-image-magnify";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      hoverLink: false,
      loaded: false
    };
  }

  render() {
    const { article, articleMargin, index, articleWidth } = this.props;
    const { hover, hoverLink, loaded } = this.state;

    // console.log(article);

    return (
      <Motion
        key={index}
        defaultStyle={{
          imageOpacity: 0
        }}
        style={{
          imageOpacity: spring(loaded ? 1 : 0)
        }}
      >
        {style => {
          return (
            <a
              href={""}
              rel="noreferrer"
              key={index}
              style={{
                margin: articleMargin - 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: articleWidth,
                border: "3px solid #e5e5e5",
                width: articleWidth,
                backgroundColor: "#f2f2f2",
                position: "relative",
                borderRadius: 3,
                backgroundImage: `url(${
                  article ? ("image" in article ? article.image.url : "") : ""
                })`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"

                //border: "2px solid rgba(0,0,0,0.1)"
                // boxShadow:
                //   "0 10px 20px rgba(0,0,0,0.08), 0 6px 6px rgba(0,0,0,0.12)"
                // filter: `blur(${style.imageOpacity * 2}px)`,
                // WebkitFilter: `blur(${style.imageOpacity * 2}px)`
              }}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
            >
              {/*<ReactImageMagnify*/}
              {/*enlargedImagePosition={"over"}*/}
              {/*hoverDelayInMs={500}*/}
              {/*{...{*/}
              {/*smallImage: {*/}
              {/*height: articleWidth,*/}
              {/*width: articleWidth,*/}
              {/*src: article*/}
              {/*? "image" in article*/}
              {/*? article.image.url*/}
              {/*: ""*/}
              {/*: "",*/}
              {/*onLoad: () => this.setState({ loaded: true })*/}
              {/*},*/}
              {/*largeImage: {*/}
              {/*src: article*/}
              {/*? "image" in article*/}
              {/*? article.image.url*/}
              {/*: ""*/}
              {/*: "",*/}
              {/*width: 1024,*/}
              {/*height: 1024*/}
              {/*}*/}
              {/*}}*/}
              <div style={{ height: "100%", width: "100%" }}>hey</div>
            </a>
          );
        }}
      </Motion>
    );
  }
}
