import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";
import ReactImageMagnify from "react-image-magnify";
import {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon
} from "react-share";

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
    const {
      siteMargin,
      imageWidth,
      record,
      index,
      showSlider,
      touchOnly
    } = this.props;
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
      <div
        style={
          {
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
            // margin: touchOnly ? "auto" : `${siteMargin - 1}px`
          }
        }
      >
        <a
          href={record ? record.site.url : ""}
          rel="noreferrer"
          key={index}
          style={{
            // margin: "auto",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            // height: imageWidth,
            // border: "3px solid #e5e5e5",
            // width: imageWidth,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            position: "relative",
            // border: "2px solid rgba(255,255,255,0.2)",
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
          {record ? (
            touchOnly ? (
              <img
                height={imageWidth}
                width={imageWidth}
                src={`https://d1dzf0mjm4jp11.cloudfront.net/${record.image}`}
                onLoad={() => this.setState({ loaded: true })}
                style={{
                  display: loaded ? "" : "none",
                  opacity: 1
                }}
              />
            ) : (
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
                  opacity: 1,
                  borderRight: touchOnly
                    ? "5px solid rgba(33, 58, 73, 1)"
                    : "none",
                  borderLeft: touchOnly
                    ? "5px solid rgba(33, 58, 73, 1)"
                    : "none"
                }}
              />
            )
          ) : null}
        </a>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: showSlider ? "auto" : ""
          }}
        >
          <a
            href={record.site.url}
            className={"hoverBtn"}
            style={{
              textAlign: "left",
              marginTop: 10,
              fontWeight: "300",
              display: "inline-block",
              textDecoration: "none",
              marginRight: 15,
              padding: "5px 12px",
              borderRadius: "50px",
              fontSize: 14,
              letterSpacing: "0.03em"
            }}
          >
            {record.site.title}
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 10,
              opacity: 0.7
            }}
          >
            <TwitterShareButton
              url={`https://d1dzf0mjm4jp11.cloudfront.net/${record.image}`}
              title={`Front page of ${record.site.title} `}
              className="Demo__some-network__share-button"
              style={{ marginRight: 10 }}
            >
              <TwitterIcon size={30} round />
            </TwitterShareButton>
            <RedditShareButton
              url={`https://d1dzf0mjm4jp11.cloudfront.net/${record.image}`}
              title={`Check out the front page of ${record.site.title}`}
              windowWidth={660}
              windowHeight={460}
              className="Demo__some-network__share-button"
            >
              <RedditIcon size={30} round />
            </RedditShareButton>
          </div>
        </div>
      </div>
    );
  }
}
