import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import feedImg from '../../Images/feed.png';
import { Link } from "react-router-dom";
import AskQuestion from "../Question/AskQuestion";
import { connect } from 'react-redux';
import unfollow from '../../Images/unfollow.png';
import { getAllQuestions, getTopicQuestions } from '../../js/actions/question_actions';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            questions: [],
            isDefaultTopic : true,
            followedquestions:[]
        }
    }

    async componentDidMount() {
        let topicsArr = [];
        topicsArr = ["Technology", "Science"];
        localStorage.setItem("topics", topicsArr);
        localStorage.setItem("name", "Akhila");
        //if (localStorage.getItem("image") === null) {
            this.setState({ defaultImg: true });
        //}
        await this.props.getAllQuestions();
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions});

    }

    closeDiv = (event, index) => {
        console.log(index);

        let questionsArr = this.state.questions;
        console.log(questionsArr[index].question);
        questionsArr.splice(index, 1);
        this.setState({ questions: questionsArr });
    }

    handleTopicSelect = async (key) => {
        console.log(key);
        if(key === "first"){
            await this.props.getAllQuestions();
        }
        else{
            this.setState({isDefaultTopic: false});
            await this.props.getTopicQuestions(key);
        }
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions});
    }
   followquestion=(e,x)=>{
       console.log(localStorage.getItem("user_name"));
       console.log("hiphip",x);
    
       var data={
           follower_username:localStorage.getItem("user_name"),
           qid:x
       }
       axios.post("http://localhost:3001/quora/question/followquestion",data, localStorage.getItem('jwtToken'))
         
   }
   unfollowquestion=(e,x)=>{
    console.log(localStorage.getItem("user_name"));
    console.log("hophop",x);
    
    var data={
        follower_username:localStorage.getItem("user_name"),
        qid:x
    }
    axios.post("http://localhost:3001/quora/question/unfollowquestion",data, localStorage.getItem('jwtToken'))
      
}

    render() {
        let redirectVar = '';
        //need to enable after login
        /*if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }*/
        let topicsArr = ["Technology", "Science"];
        localStorage.setItem("topics", topicsArr);

        let topicsDiv = null;
        let topics = localStorage.getItem("topics");

        let questionsDiv = null;

        let userTopics = topics.split(",");
        console.log(userTopics);
        topicsDiv = userTopics.map((record, index) => {

            return (
                <Nav.Item>
                    <Nav.Link eventKey={record} className="left-tabs-feed">
                        <div className="label feed-label">{record}</div>
                    </Nav.Link>
                </Nav.Item>

            )
        });

       

       

        questionsDiv = this.state.questions.map((record, index) => {
            console.log(record);
            let ansdiv = null;
            if (record.answers.length>0) {
                let imgdiv = null;
                //if (record.answers.owner_profile_pic == null) {
                    imgdiv = <div className="questions-default-logo"></div>;
                //}

                if (record.answers[0].timestamp) {
                    /* let timestamp = new Date(record.answer.timestamp);
                     var date = timestamp.getDate();
                     var month = timestamp.getMonth(); 
                     var year = timestamp.getFullYear();
                     var time = timestamp.getTime();
     
                     var dateTime = date + "/" +(month + 1) + "/" + year;*/

                    var dateTime = record.answers[0].timestamp.replace("T", " ");
                    dateTime = dateTime.substring(0, dateTime.indexOf('.'));
                }

                ansdiv = (
                    <div style={{ marginTop: "0.3em" }}>
                        <div className="row">
                            <div className="col-1 answer-user-pic">
                                {imgdiv}
                            </div>
                            <div className="col-9">
                                <div className="row">
                                    <Link className="question-link" to={"/profile/" + record.user_id}>
                                        <div className="answer-user-profile">{record.answers[0].owner_name},</div>
                                    </Link>
                                    <div className="answer-user-profile">&nbsp;{record.answers[0].owner_tagline}</div>
                                </div>
                                <div className="row">
                                    <div className="answer-timestamp"><span>Answered&nbsp;</span>{dateTime}</div>
                                </div>

                            </div>

                        </div>
                        <div className="row answer-to-question">
                            {record.answers[0].answer}
                        </div>

                    </div>
                );
            }

            let questionFooterDiv = null;
            questionFooterDiv = (
                <div>
                    <div className="row" style={{ marginTop: "0.3em" }}>
                        <div className="question-footer-elem" style={{ marginLeft: "0.3em" }}>
                            <div className="answer-icon answer-icon-label">Answer</div>
                        </div>
                        <div className="question-footer-elem">
                            <div className="pass-icon answer-icon-label">Pass</div>
                        </div>
                        <div className="question-footer-elem" >
                        {record.followers.includes(localStorage.getItem("user_name")) ? <div id="unfollow-ques answer-icon-label" onClick={e=>this.unfollowquestion(e,record._id)}> <img src={unfollow} width="60" height="40" />{"  "}{(record.followers.length == 0)? "": record.followers.length}</div>:<div className="follow-icon answer-icon-label" onClick={e=>this.followquestion(e,record._id)}>Follow {(record.followers.length == 0)? "": record.followers.length}</div>}
                        </div>
                        <div className="question-footer-elem-share-icons" style={{ marginLeft: "18em" }}>
                            <div className="fb-icon answer-icon-hide">a</div>
                        </div>
                        <div className="question-footer-elem-share-icons">
                            <div className="twitter-icon answer-icon-hide">a</div>
                        </div>
                        <div className="question-footer-elem-share-icons">
                            <div className="share-icon answer-icon-hide">a</div>
                        </div>
                        <div className="question-footer-elem-share-icons">
                            <div className="dots-icon answer-icon-hide">a</div>
                        </div>

                    </div>
                </div>
            );


            return (
                <div className="card question-card">
                    <div className="card-body question-card-body">
                        <span className="pull-right clickable close-icon" data-effect="fadeOut" onClick={(event) => this.closeDiv(event, index)}><i class="fa fa-times"></i></span>
                        {this.state.isDefaultTopic ?
                        <p className="question-card-subtitle"> Answer . Topic you might like</p>
                        :
                        <p className="question-card-subtitle"> Answer . Topic you like</p>
                        }
                        <Link className="question-link" to={"/question/" + record._id}>
                            <span className="card-title question-card">{record.question}</span>
                        </Link>
                        {ansdiv}
                        {questionFooterDiv}
                    </div>
                </div>
            )
        });

        let tabPanesDiv = null;
        tabPanesDiv = userTopics.map((record, index) => {

            return (
                <Tab.Pane eventKey={record}>
                    <div id="accordion">
                        {questionsDiv}
                    </div>
                    </Tab.Pane>

            )
        });

        return (
            <div style={{ background: "#fafafa", height: "100vh" }}>
                {redirectVar}
                 <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleTopicSelect}>
                                    <Row>
                                        <Col sm={2}>
                                            <Nav variant="pills" className="flex-column feed-nav">
                                                <Nav.Item style={{ marginBottom: "-1em" }}>
                                                    <Nav.Link eventKey="first">
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={feedImg} alt="Feed" />
                                                            <div className="label feed-label">  Feed
                                                              </div>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {topicsDiv}
                                            </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                        <div className="card profile-card">
                                                            <div className="card-body profile-card-body">
                                                                {this.state.defaultImg &&
                                                                    <div className="row">
                                                                        <div className="profile-logo-home"></div>
                                                                        <div className="home-profie-name">{localStorage.getItem("name")}</div>
                                                                    </div>
                                                                }
                                                                <button className="btn" data-toggle="modal" data-target="#askQuestion">

                                                                    <span className="card-title profile-question-card">What is your question or link?</span>
                                                                </button>
                                                                <AskQuestion/>
                                                            </div>
                                                        </div>
                                                        {questionsDiv}
                                                    </div>
                                                </Tab.Pane>
                                                {tabPanesDiv}
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    questions : state.question.payload
});

export default connect(mapStateToProps, { getAllQuestions, getTopicQuestions})(Home);