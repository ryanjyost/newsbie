import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";
import ReactImageMagnify from "react-image-magnify";

export default class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      hoverLink: false,
      loaded: false
    };
  }

  render() {
    const { siteMargin, imageWidth, record, index } = this.props;
    const { hover, hoverLink, loaded } = this.state;

    const Placeholder = () => {
      return (
        <div
          style={{
            height: imageWidth,
            width: imageWidth,
            backgroundColor: "#e5e5e5"
          }}
        >
          <div
            style={{
              margin: "auto",
              width: "50%",
              backgroundColor: "#f2f2f2",
              height: 20
            }}
          />
        </div>
      );
    };

    return (
      <Motion
        defaultStyle={{
          linkPosition: -50,
          imageOpacity: 0
        }}
        style={{
          linkPosition: spring(this.state.hover ? 10 : -50),
          imageOpacity: spring(loaded ? 1 : 0)
        }}
      >
        {style => {
          return (
            <a
              href={record ? record.site.url : ""}
              rel="noreferrer"
              key={index}
              style={{
                marginRight: siteMargin - 1,
                marginRight: siteMargin - 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: imageWidth,
                // border: "3px solid #e5e5e5",
                width: imageWidth,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                position: "relative",
                //border: "2px solid rgba(0,0,0,0.1)"
                boxShadow:
                  "0 1px 3px rgba(255,255,255,0.08), 0 1px 2px rgba(255,255,255,0.12)"
                // filter: `blur(${style.imageOpacity * 2}px)`,
                // WebkitFilter: `blur(${style.imageOpacity * 2}px)`
              }}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
            >
              {/*<a*/}
              {/*href={record.site.url}*/}
              {/*rel="noreferrer"*/}
              {/*target={"_blank"}*/}
              {/*style={{ position: "absolute", top: 0, right: 0 }}*/}
              {/*/>*/}
              {/*{!loaded ? <Placeholder /> : null}*/}
              {record && (
                <ReactImageMagnify
                  enlargedImagePosition={"over"}
                  hoverDelayInMs={500}
                  {...{
                    smallImage: {
                      height: imageWidth,
                      width: imageWidth,
                      src: `https://d1dzf0mjm4jp11.cloudfront.net/${
                        record.image
                      }`,
                      onLoad: () => this.setState({ loaded: true })
                    },
                    largeImage: {
                      src: `https://d1dzf0mjm4jp11.cloudfront.net/${
                        record.image
                      }`,
                      width: 1024,
                      height: 1024
                    }
                  }}
                  style={{
                    display: loaded ? "" : "none",
                    opacity: style.imageOpacity
                  }}
                />
              )}
            </a>
          );
        }}
      </Motion>
    );
  }
}
