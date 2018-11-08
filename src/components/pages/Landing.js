import React, { Component } from "react";
import { Card, Button, Icon } from "antd";
import { Link } from "react-router-dom";
import UserAuthPage from "../pages/UserAuthPage";

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styles, educators } = this.props;
    const isSmall = styles.screenWidth < 500;
    const isHorz = styles.screenWidth > 800;

    let copyObject = {
      hero: (
        <span>Stay informed {isSmall ? <br /> : null}without going insane</span>
      ),
      subHeader:
        "newsbie makes it easy to balance, enhance and digest your news media diet, so that you can" +
        " understand more in less time",
      benefits: [
        {
          main: "Become a better, more critical news consumer",
          sub:
            "Discover biases, tactics, patterns," +
            " trends and other insights that add context and clarity to your worldview."
        },
        {
          main: "Absorb more info in less time",
          sub:
            " Efficiently find signals in all the noise with powerful tools and metrics."
        },
        {
          main: "Stay grounded with cold, hard data",
          sub:
            "Counteract biases and subjectivity with unbiased and objective analysis of news media data."
        },
        {
          main: "Break free from echo chambers and filter bubbles",
          sub:
            "newsbie's balanced, bird's eye view of the entire news media landscape let's you see every story and" +
            " theme from multiple angles."
        }
      ]
    };

    if (educators) {
      copyObject = {
        hero: "Help your students understand the news media",
        subHeader:
          "Newsbie is a better way for educators to foster news media literacy and critical" +
          " thinking, in the classroom and beyond",
        benefits: [
          {
            main: "Cultivate fruitful discussions",
            sub:
              "Showcase biases, tactics, patterns, trends, etc. to get students curious and the conversation going."
          },
          {
            main: "Empower students to explore relevant terms and topics",
            sub:
              "From discovering a term for the first time to diving deep on current contexts, you and your students" +
              " have" +
              " the right tools for the job."
          },
          {
            main: "Keep things grounded with cold, hard data",
            sub:
              "Leverage stats, graphs and metrics to promote objective, apolitical analysis and discussions."
          },
          {
            main: "Make information diversification easy",
            sub:
              "Newsbie's balanced, bird's eye view of the entire news media landscape helps you and your students see" +
              " every" +
              " story" +
              " and theme from multiple angles."
          }
        ]
      };
    }

    const cdn = "https://d1dzf0mjm4jp11.cloudfront.net/";

    let sectionStyle = { width: "100%", padding: "40px 25px" };
    let headerStyle = {
      textAlign: isHorz ? "left" : "center",
      fontWeight: 700,
      color: "rgba(0,0,0,0.8)",
      lineHeight: 1.3,
      fontSize: isSmall ? 22 : 22,
      marginBottom: isSmall ? 10 : isHorz ? 6 : 3
    };
    let featureHeaderStyle = {
      textAlign: "left",
      fontWeight: 500,
      color: "rgba(0,0,0,0.7)",
      lineHeight: 1.3,
      fontSize: 16,
      margin: "0px 10px"
    };

    let subHeaderStyle = {
      textAlign: isHorz ? "left" : "center",
      fontWeight: 500,
      color: "#898989",
      fontSize: isSmall ? 16 : 15,
      letterSpacing: "0.02em",
      lineHeight: 1.5,
      maxWidth: isHorz ? 350 : 500,
      margin: isHorz ? null : "auto",
      marginBottom: 18
    };

    let cardStyle = {
      backgroundColor: styles.colors.white,
      marginTop: 10,
      marginBottom: 10,
      margin: "auto",
      maxWidth: Math.min(1000, styles.screenWidth - 20),
      padding: !isSmall ? "60px 10px 100px 10px" : "30px 10px",
      border: "none",
      borderRadius: 5
    };
    let cardHeader = {
      marginBottom: 50,
      textAlign: "center",
      fontWeight: 700,
      color: "#1890ff",
      lineHeight: 1.3,
      fontSize: 26
    };

    let btnStyle = {
      display: "block",
      margin: "auto",
      boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
    };

    const outerDivStyle = {
      display: "flex",
      flexDirection: isHorz ? "row" : "column",
      alignItems: "center"
    };

    const innerDivStyle = {
      padding: isHorz ? "0px 30px 0px 30px" : "0px 0px",
      width: isHorz ? "40%" : "100%"
    };

    const renderImage = (image, isFeature) => {
      const Dot = ({ isLeft }) => {
        return (
          <div
            style={{
              height: 8,
              width: 8,
              backgroundColor: "rgba(0,0,0,0.07)",
              borderRadius: 10,
              margin: isLeft ? "0px 3px 0px 6px" : "0px 3px"
            }}
          />
        );
      };
      return (
        <div
          style={{
            borderRadius: 3,
            margin: isFeature ? "0px" : "auto",
            marginTop: isHorz ? 0 : !isFeature ? 0 : 30,
            marginBottom: isHorz ? 0 : !isFeature ? 0 : 30,
            display: "block",
            boxShadow: "0 20px 40px 0 rgba(0,0,0,.15)",
            border: "1px solid rgba(0,0,0,0.1)",
            width: Math.min(520, styles.screenWidth - 40),
            maxWidth: "100%"
          }}
        >
          <div
            style={{
              width: "100%",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              backgroundColor: "#f0f2f5",
              height: 20,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Dot isLeft /> <Dot /> <Dot />
          </div>

          <img
            style={{
              // boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
              borderBottomRightRadius: 3,
              borderBottomLeftRadius: 3
            }}
            src={`${cdn}${image}`}
            width={"100%"}
          />
        </div>
      );
    };

    const renderVideo = () => {
      const Dot = ({ isLeft }) => {
        return (
          <div
            style={{
              height: 8,
              width: 8,
              backgroundColor: "rgba(0,0,0,0.07)",
              borderRadius: 10,
              margin: isLeft ? "0px 3px 0px 6px" : "0px 3px"
            }}
          />
        );
      };
      return (
        <div
          style={{
            borderRadius: 3,
            margin: "auto",
            marginBottom: 30,
            marginTop: 50,
            display: "block",
            boxShadow: "0 20px 40px 0 rgba(0,0,0,.15)",
            border: "1px solid rgba(0,0,0,0.1)",
            width: Math.min(800, styles.screenWidth - 40),
            maxWidth: "100%"
          }}
        >
          <div
            style={{
              width: "100%",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              backgroundColor: "#f0f2f5",
              height: 20,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Dot isLeft /> <Dot /> <Dot />
          </div>
          <video
            width={"100%"}
            autoPlay
            loop
            muted
            playsInline
            style={{ borderRadius: 2 }}
          >
            <source
              src="https://d1dzf0mjm4jp11.cloudfront.net/newsbie-preview.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      );
    };

    const renderHero = () => {
      return (
        <div
          style={{
            ...{
              backgroundColor: styles.colors.white,
              marginBottom: 30,
              padding: "160px 20px 80px 20px"
            }
          }}
        >
          <h3
            style={{
              fontSize: isSmall ? 25 : 28,
              fontWeight: 700,
              color: "rgba(0,0,0,0.8)",
              textAlign: "center"
            }}
          >
            {copyObject.hero}
          </h3>
          <h5
            style={{
              fontSize: isSmall ? 15 : 16,
              padding: "0px 20px",
              maxWidth: 550,
              width: "100%",
              margin: "auto",
              marginBottom: 30,
              textAlign: "center",
              fontWeight: 500,
              color: "#9B9B9B",
              letterSpacing: "0.02em",
              lineHeight: 1.5
            }}
          >
            {/*newsbie makes it easy to monitor, analyze and understand the news*/}
            {/*media. Life-long news junkies, beginners, and everyone in*/}
            {copyObject.subHeader}
          </h5>

          <Link to="/app">
            <Button style={btnStyle} type={"primary"} size={"large"}>
              <span style={{ paddingRight: 8 }}>Try it out</span> &rarr;
            </Button>
          </Link>

          {renderVideo()}
        </div>
      );
    };

    const renderInfo = () => {
      let infoHeader = { ...headerStyle, ...{ fontSize: 18 } };
      let infoSub = {
        ...subHeaderStyle,
        ...{
          textAlign: "center",
          width: "100%",
          maxWidth: 500,
          marginBottom: 50
        }
      };

      return (
        <Card style={cardStyle}>
          <h2 style={cardHeader}>First things first...</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/*<div style={innerDivStyle}>*/}
            <h3 style={infoHeader}>What exactly is newsbie?</h3>
            <h5 style={infoSub}>
              It's a web application that you access at{" "}
              <a style={{ color: "#1890ff" }} href="newsbie.io/app">
                https://newsbie.io/app
              </a>
            </h5>

            <h3 style={infoHeader}>What does it offer?</h3>
            <h5 style={infoSub}>
              Simple, powerful news media aggregation, navigation and analysis
              tools.
            </h5>

            <h3 style={infoHeader}>Where does the data come from?</h3>
            <h5 style={infoSub}>
              Newsbie collects news article data and screenshots from a couple
              dozen news websites every 15 minutes.
            </h5>

            <h3 style={infoHeader}>Who is newsbie for?</h3>
            <h5 style={infoSub}>
              Teachers, professors, academics, and others who wish to lead
              healthy discussions and facilitate news media literacy. It's also
              just a great way to stay informed and better understand the news.
            </h5>
          </div>
        </Card>
      );
    };

    const renderBenefits = () => {
      let infoHeader = { ...headerStyle, ...{ fontSize: 18 } };
      let infoSub = {
        ...subHeaderStyle,
        ...{
          textAlign: "center",
          width: "100%",
          maxWidth: 500,
          marginBottom: 50
        }
      };

      return (
        <Card style={cardStyle}>
          <h2 style={cardHeader}>Benefits</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/*<div style={innerDivStyle}>*/}
            <h3 style={infoHeader}>More engaged students</h3>
            <h5 style={infoSub}>
              The app makes it easy to present current events in the classroom
              and for students to explore on their own.
            </h5>

            <h3 style={infoHeader}>
              A chance for civil, nonpartisan discourse
            </h3>
            <h5 style={infoSub}>
              The balanced, analytical presentation of news data provides a
              novel, neutral place to explore the news and dampen polarizing
              forces.
            </h5>

            <h3 style={infoHeader}>
              Constantly new material for assignments and exercises
            </h3>
            <h5 style={infoSub}>
              Newsbie never stops updating and analyzing the latest news, so you
              always have something new and interesting to bring to the
              classroom.
            </h5>

            <h3 style={infoHeader}>A better understanding of the news media</h3>
            <h5 style={infoSub}>
              The main goal of newsbie is to help users better understand and be
              critical of the news media - that means <strong>everyone</strong>{" "}
              has something to learn!
            </h5>
          </div>
        </Card>
      );
    };

    const renderUseCases = () => {
      let infoHeader = { ...headerStyle, ...{ fontSize: 18 } };
      let infoSub = {
        ...subHeaderStyle,
        ...{
          textAlign: "center",
          width: "100%",
          maxWidth: 500,
          marginBottom: 50
        }
      };

      return (
        <Card style={cardStyle}>
          <h2 style={cardHeader}>Use Cases</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/*<div style={innerDivStyle}>*/}
            <h3 style={infoHeader}>Daily news check-in</h3>
            <h5 style={infoSub}>
              Every day for five minutes or so, walk through newsbie with your
              students. Showcase interesting phenomena, pick a single topic to
              explore, etc.
            </h5>

            <h3 style={infoHeader}>Open ended hand raising</h3>
            <h5 style={infoSub}>
              Simply throw newsbie up on the big screen, navigate around the app
              and encourage students to ask questions and share observations.
            </h5>

            <h3 style={infoHeader}>Fun homework exercises</h3>
            <h5 style={infoSub}>
              Have students log into newsbie and write a piece on an
              observation, or have them compare two news sources' coverage of
              the same story.
            </h5>

            <h3 style={infoHeader}>
              Teach media literacy, journalism and more
            </h3>
            <h5 style={infoSub}>
              Discuss biases, journalist practices and more with abundant real
              world examples.
            </h5>
          </div>
        </Card>
      );
    };

    const renderOverview = () => {
      return (
        <Card style={cardStyle}>
          <h2 style={cardHeader}>What can I do with newsbie?</h2>
          <div style={outerDivStyle}>
            <div style={innerDivStyle}>
              <h3 style={headerStyle}>{copyObject.benefits[0].main}</h3>
              <h5 style={subHeaderStyle}>{copyObject.benefits[0].sub}</h5>
            </div>
            {renderImage("landing-main.png")}
          </div>

          <div
            style={{
              ...outerDivStyle,
              ...{
                flexDirection: isHorz ? "row-reverse" : "column",
                marginTop: 150
              }
            }}
          >
            <div
              style={{ ...innerDivStyle, ...{ marginLeft: isHorz ? 20 : 0 } }}
            >
              <h3 style={headerStyle}>{copyObject.benefits[1].main}</h3>
              <h5 style={subHeaderStyle}>{copyObject.benefits[1].sub}</h5>
            </div>
            {renderImage("newsbie-term-analysis-preview.png")}
          </div>

          <div
            style={{
              ...outerDivStyle,
              ...{ marginTop: 150 }
            }}
          >
            <div style={innerDivStyle}>
              <h3 style={headerStyle}>{copyObject.benefits[2].main}</h3>
              <h5 style={subHeaderStyle}>{copyObject.benefits[2].sub}</h5>
            </div>
            {renderImage("newsbie-trend-preview.png")}
          </div>

          <div
            style={{
              ...outerDivStyle,
              ...{
                flexDirection: isHorz ? "row-reverse" : "column",
                marginTop: 150
              }
            }}
          >
            <div
              style={{ ...innerDivStyle, ...{ marginLeft: isHorz ? 20 : 0 } }}
            >
              <h3 style={headerStyle}>{copyObject.benefits[3].main}</h3>
              <h5 style={subHeaderStyle}>{copyObject.benefits[3].sub}</h5>
            </div>
            {renderImage("newsbie-articles-preview.png")}
          </div>
        </Card>
      );
    };

    const renderProblems = () => {
      return (
        <Card style={{ ...cardStyle, ...{ backgroundColor: "#fff" } }}>
          <h2 style={{ ...cardHeader, ...{ color: "rgba(0,0,0,0.8)" } }}>
            Any of these struggles feel familiar?
          </h2>
          <div style={outerDivStyle}>
            <div style={innerDivStyle}>
              <h3 style={headerStyle}>
                Become a better, more critical news consumer
              </h3>
              <h5 style={subHeaderStyle}>
                Discover biases, tactics, patterns, trends and other insights
                that add context and clarity to your worldview.
              </h5>
            </div>
            {renderImage("landing-main.png")}
          </div>
        </Card>
      );
    };

    const renderNewFeatures = () => {
      let innerDiv = {
        padding: isHorz ? "0px 20px 0px 20px" : "0px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        borderRadius: 3,
        width: "100%",
        maxWidth: 500
      };

      let outerDiv = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // maxWidth: 500,
        margin: "auto",
        borderRadius: 3
      };

      const SingleFeature = ({ problem, solution, image, reverse }) => {
        return (
          <div style={{ padding: "70px 00px" }}>
            <div style={outerDiv}>
              <div style={innerDiv}>
                <div
                  style={{
                    flex: 0.5,
                    backgroundColor: "#f0f2f5",
                    padding: "40px 20px",
                    position: "relative",
                    borderRadius: 3
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      lineHeight: 1.3,
                      color: "rgba(0,0,0,0.6)"
                    }}
                  >
                    {problem}
                  </h4>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      position: "absolute",
                      bottom: -15,
                      right: "calc(50% - 15px)",
                      color: "#1890ff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 20,
                      fontWeight: "bold"
                    }}
                  >
                    &darr;
                  </div>
                </div>
                <div
                  style={{
                    flex: 0.5,
                    backgroundColor: "rgba(24, 144, 255, 1)",
                    padding: "40px 20px",
                    borderRadius: 3
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#fff",
                      lineHeight: 1.3
                    }}
                  >
                    {solution}
                  </h4>
                </div>
              </div>
              {/*<div*/}
              {/*style={{*/}
              {/*padding: !isHorz ? 0 : "0px 10px",*/}
              {/*width: isHorz ? "40%" : "100%"*/}
              {/*}}*/}
              {/*>*/}
              {/*{renderImage(image, true)}*/}
              {/*</div>*/}
            </div>
          </div>
        );
      };

      return (
        <Card style={{ ...cardStyle, ...{ paddingTop: 70 } }}>
          <h2 style={cardHeader}>
            <div style={{ color: "rgba(0,0,0,0.3)", fontSize: 22 }}>
              The old way sucks
            </div>
            <div style={{ padding: "10px 0px" }}>&darr;</div>{" "}
            <div style={{ fontSize: 26 }}>The newsbie way is better</div>
          </h2>

          <SingleFeature
            problem={
              "Feel like you don't have a clear view of what's going on?"
            }
            solution={
              "newsbie provides a rich overview of the entire news media landscape."
            }
            image={"landing-main.png"}
          />

          <SingleFeature
            problem={
              "Ever seem like there's multiple versions of the news out there?"
            }
            solution={
              "Be confident you've got the whole picture, not just a small slice, with access to thousands" +
              " of articles across the spectrum."
            }
            image={"feature-4.png"}
            reverse
          />

          <SingleFeature
            problem={
              "Overwhelmed by the fire hose of content and news stories? It's a lot to manage and makes things more" +
              " confusing."
            }
            solution={
              "Absorb a greater quality and quantity of information through unique tools, graphs and metrics."
            }
            image={"feature-3.png"}
          />

          <SingleFeature
            problem={
              "Struggle to keep up with the constant avalanche of topics, terms and people?"
            }
            solution={
              "Access in-depth breakdowns of trending topics. Research terms on Google, Wikipedia or Twitter" +
              " in one click."
            }
            image={"feature-6.png"}
            reverse
          />

          <SingleFeature
            problem={
              "The news cycle is so rapid and disorienting - it's easy to forget what happened yesterday, let" +
              " alone a week ago."
            }
            solution={
              "Browse current and historical front pages of news sites. See how topics and terms trend over" +
              " time."
            }
            image={"feature-7.png"}
          />
        </Card>
      );
    };

    const renderFeatures = () => {
      const features = [
        {
          icon: "eye",
          text: "Holistic and efficient overview of recent news"
        },
        {
          icon: "read",
          text: "Thousands of articles a day from dozens of sources"
        },
        {
          icon: "pie-chart",
          text: "Monitor the entire news media, not just a slice"
        },
        {
          icon: "dashboard",
          text: "Metrics, stats and graphs that are worth 1,000 words"
        },
        {
          icon: "experiment",
          text: "In-depth analysis of trending terms"
        },
        {
          icon: "calendar",
          text: "Browse current and historical front pages of news sites"
        },
        {
          icon: "rise",
          text: "See how topics and terms trend over time"
        },
        {
          icon: "colum-height",
          text: "Wide and balanced spectrum of news sources"
        },
        {
          icon: "tablet",
          text: "Works on all devices"
        },
        {
          icon: "filter",
          text: "Search, sort and filter articles by time, source and topic"
        },
        {
          icon: "picture",
          text: "Explore the news through hundreds of recent images"
        },
        {
          icon: "search",
          text: "Research terms on Google, Wikipedia or Twitter in one click"
        }
      ];

      return (
        <Card
          style={{
            backgroundColor: styles.colors.white,
            marginTop: 10,
            marginBottom: 10,
            margin: "auto",
            maxWidth: Math.min(1000, styles.screenWidth - 20),
            padding: !isSmall ? "60px 0px 100px 0px" : "30px 10px",
            border: "none",
            borderRadius: 5
          }}
          bodyStyle={{
            padding: "20px 0px",
            width: "100%"
          }}
        >
          <h2 style={cardHeader}>Features</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "stretch",
              width: "100%"
            }}
          >
            {features.map((feature, i) => {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: 300,
                    margin: "30px 20px"
                  }}
                >
                  <Icon
                    type={feature.icon}
                    style={{
                      fontSize: 30,
                      color: "#1890ff",
                      transform:
                        feature.icon === "colum-height" ? "rotate(90deg)" : null
                    }}
                  />
                  <h3 style={featureHeaderStyle}>{feature.text}</h3>
                </div>
              );
            })}
          </div>
          <div
            style={{
              width: "100%",
              padding: "40px 0px 0px 0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <h4
              style={{
                color: "rgba(0,0,0,0.8)",
                textAlign: "center",
                marginBottom: 20,
                fontWeight: "bold"
              }}
            >
              More features are on the way!
            </h4>

            <Link to={"/upcoming"}>
              <Button size={"large"} type={"primary"}>
                Vote for features you want &rarr;
              </Button>
            </Link>
          </div>
        </Card>
      );
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 0
        }}
      >
        {renderHero()}

        <div style={{ marginTop: 30, padding: "0px 0px 0px 0px" }}>
          {renderInfo()}
        </div>

        <div style={{ marginTop: 30, padding: "0px 0px 0px 0px" }}>
          {renderOverview()}
        </div>

        <div style={{ marginTop: 30, padding: "0px 0px 0px 0px" }}>
          {renderBenefits()}
        </div>

        <div style={{ marginTop: 30 }}>
          {educators ? renderFeatures() : renderNewFeatures()}
        </div>

        <div style={{ marginTop: 30, padding: "0px 0px 0px 0px" }}>
          {renderUseCases()}
        </div>

        <UserAuthPage
          {...this.props}
          styles={styles}
          updateUser={user => this.props.updateUser(user)}
        />
      </div>
    );
  }
}
