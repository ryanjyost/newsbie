import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import TagCloud from "../../TagCloud";
import ReactGA from "react-ga";
import detectIt from "detect-it";
import Article from "../../Article";
import { Icon } from "react-icons-kit";
import { ic_search } from "react-icons-kit/md/ic_search";
import { iosCalendarOutline } from "react-icons-kit/ionicons/iosCalendarOutline";
import DatePicker from "react-datetime";
import "../../../../node_modules/react-datetime/css/react-datetime.css";
import moment from "moment";
import TimeAgo from "react-timeago";
import { XmlEntities } from "html-entities";
import Loader from "../../components/Loader";

//
import Button from "antd/lib/button";

export default class ArticleSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTags: [null],
      topics: [],
      batchOfTags: null,
      allTagBatches: [],
      records: [],
      batch: [],
      screenWidth: 0,
      sites: [],
      touchOnly: detectIt.deviceType === "touchOnly",

      allArticles: [],
      articles: [],
      currentTagFilter: null,
      searchInput: "",
      startDate: null,
      endDate: moment(),
      typeFilter: null
    };

    this.entities = new XmlEntities();
  }

  componentDidMount() {
    this.updateDimensions();

    if (!this.props.isSingleSource) {
      /*
	 * Recent Tags
	 * */
      axios
        .get("https://birds-eye-news-api.herokuapp.com/recent_tags")
        .then(res => {
          this.setState({
            batchOfTags: res.data.batches[0],
            allTagBatches: res.data.batches,
            topTags: res.data.topTags
          });
        })
        .catch(err => console.log(err));

      /*
		 * Articles
		 * */
      axios
        .get("https://birds-eye-news-api.herokuapp.com/today")
        .then(res => {
          let currentNews = shuffle(res.data.politicsArticles);

          let filteredPolitics = currentNews.filter(article => {
            return article.site.name.toLowerCase() !== "politico";
          });

          let currentOpinions = shuffle(res.data.opinionArticles);

          let filteredOpinions = currentOpinions.filter(article => {
            return article.site.name.toLowerCase() !== "cbsnews";
          });

          let shuffledCombined = shuffle([
            ...filteredPolitics,
            ...filteredOpinions
          ]);

          this.setState({
            sites: res.data.sites,
            allArticles: shuffledCombined,
            articles: shuffledCombined.slice(0, 100)
          });
        })
        .catch(err => console.log(err));
    } else {
      this.setState({
        articles: this.props.articles,
        allArticles: this.props.articles,
        topTags: this.props.tags
      });
    }

    // window.addEventListener(
    //   "resize",
    //   this.throttle(this.updateDimensions.bind(this), 200)
    // );

    // google analystics
    this.initReactGA();

    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });
  }

  initReactGA() {
    ReactGA.initialize("UA-97014671-5");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  handleUpdateStartDate(startDate) {
    let formattedStart = startDate.format("MM/DD/YYYY");
    let formattedEnd = this.state.endDate.format("MM/DD/YYYY");

    axios
      .get(
        `https://birds-eye-news-api.herokuapp.com/articles?start=${formattedStart}&end=${formattedEnd}`,
        {
          Accept: "application/json"
        }
      )
      .then(res => {
        this.setState({ articles: shuffle(res.data.articles) });
      })
      .catch(err => console.log(err));

    this.setState({
      startDate: startDate,
      currentTagFilter: null,
      searchInput: "",
      typeFilter: null
    });
  }

  handleUpdateEndDate(endDate) {
    let formattedStart = !this.state.startDate
      ? "01/01/1970"
      : this.state.startDate.format("MM/DD/YYYY");
    let formattedEnd = endDate.format("MM/DD/YYYY");

    axios
      .get(
        `https://birds-eye-news-api.herokuapp.com/articles?start=${formattedStart}&end=${formattedEnd}`,
        {
          Accept: "application/json"
        }
      )
      .then(res => {
        this.setState({ articles: shuffle(res.data.articles) });
      })
      .catch(err => console.log(err));

    this.setState({
      endDate: endDate,
      currentTagFilter: null,
      searchInput: "",
      typeFilter: null
    });
  }

  filterArticles(params) {
    this.setState({
      currentTagFilter: params.currentTagFilter,
      searchInput: params.searchInput,
      typeFilter: params.typeFilter
    });

    let articles = this.state.allArticles.filter(article => {
      let matchesTagFilter = params.currentTagFilter
        ? article.title
            .toLowerCase()
            .includes(params.currentTagFilter.term.toLowerCase()) ||
          article.summary
            .toLowerCase()
            .includes(params.currentTagFilter.term.toLowerCase())
        : true;

      let matchesSearchFilter = params.searchInput
        ? article.title
            .toLowerCase()
            .includes(params.searchInput.toLowerCase()) ||
          article.summary
            .toLowerCase()
            .includes(params.searchInput.toLowerCase())
        : true;

      let matchesTypeFilter = params.typeFilter
        ? article.category === params.typeFilter
        : true;
      return matchesTagFilter && matchesSearchFilter && matchesTypeFilter;
    });
    this.setState({ articles: articles.slice(0, 100) });
  }

  render() {
    const {
      currentTagFilter,
      searchInput,
      screenWidth,
      touchOnly,
      typeFilter
    } = this.state;

    const { isSingleSource } = this.props;

    const params = {
      currentTagFilter,
      searchInput,
      typeFilter
    };

    const renderDatePickerInput = (props, openCalendar, closeCalendar) => {
      let displayDate = props.value;
      if (props.value.length < 1) {
        displayDate = "Earlier";
      } else if (moment(props.value).isSame(moment(), "day")) {
        displayDate = "Today";
      } else {
        displayDate = moment(props.value).format("MM/DD/YYYY");
      }
      return (
        <div
          style={{
            borderBottom: "2px solid rgba(0,0,0,1)",
            cursor: "pointer",
            fontSize: 12,
            padding: "0px 10px 2px 10px",
            width: 80,
            textAlign: "center"
          }}
          onClick={() => openCalendar()}
        >
          {displayDate}
        </div>
      );
    };

    if (
      // !this.state.topTags[0] ||
      true
    ) {
      return (
        <div>
          <Loader
            loaderHeight={"100vh"}
            loadingMessage={"Loading recent articles..."}
          />
        </div>
      );
    }
    return (
      <div>
        <h1>hey</h1>
      </div>
    );
  }
}
