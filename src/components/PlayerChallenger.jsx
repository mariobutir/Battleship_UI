import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {challengePlayer, fetchPlayers} from "../actions";
import PageHeader from "./PageHeader";
import {Button} from "semantic-ui-react";
import styled from "styled-components";
import _ from "lodash";
import {Link} from "react-router-dom";

const Container = styled.div`
    max-width: 700px;
    padding-top: 20px;
    margin: auto;
`;

class PlayerChallenger extends Component {
    state = {
        player_id: null
    };

    componentDidMount() {
        this.props.fetchPlayers();
    }

    handleSubmit() {
        this.props.challengePlayer(this.props.match.params.playerId, this.state, this.props.history.push);
    };

    renderPlayers() {
        return (
            _.map(this.props.players, player => {
                if (player.id === this.props.match.params.playerId) {
                    return null;
                } else {
                    return (
                        <div className="field" key={player.id}>
                            <div className="ui radio checkbox">
                                <input
                                    type="radio"
                                    name="player"
                                    checked={player.id === this.state.player_id}
                                    tabIndex="0"
                                    className="hidden"
                                    onChange={() => {
                                    }}
                                /> {console.log(this.state)}
                                <label
                                    onClick={() => this.setState({player_id: player.id})}>{_.capitalize(player.name)}</label>
                            </div>
                        </div>
                    )
                }
            })
        );
    }

    render() {
        return (
            <Container>
                <PageHeader/>
                <div className="ui form" style={{fontSize: 'large', marginTop: '50px'}}>
                    <div className="grouped fields">
                        <label htmlFor="player">Who is the challenger?</label>
                        {this.renderPlayers()}
                    </div>
                    <Button basic color='blue' disabled={!this.state.player_id} onClick={this.handleSubmit.bind(this)}>Start
                        game!</Button>
                    <Link to={'/player/list'}>
                        <Button basic>Cancel</Button>
                    </Link>
                </div>
            </Container>
        );
    };
}


function mapStateToProps(state) {
    return {
        players: state.players,
    };
}

export default connect(mapStateToProps, {fetchPlayers, challengePlayer})(PlayerChallenger);