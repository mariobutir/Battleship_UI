import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {fetchPlayers, fetchPlayerGameList} from "../actions";
import _ from 'lodash';
import {Image, Button, Accordion, Menu} from 'semantic-ui-react';
import {capitalize} from "lodash/string";
import randomName from "../utils/randomName";
import styled from 'styled-components';
import PlayerContent from "./PlayerContent";
import PageHeader from "./PageHeader";

const Container = styled.div`
    max-width: 1000px;
    padding-top: 20px;
    margin: auto;
`;

class PlayersIndex extends Component {
    state = {activeIndex: 0};

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        if (newIndex !== -1) {
            this.props.fetchPlayerGameList(newIndex);
        }
        this.setState({activeIndex: newIndex});
    };

    componentDidUpdate() {
        if (this.state.avatarMap === undefined && this.props.players) {
            const avatarMap = {};
            Object.keys(this.props.players).forEach(key => avatarMap[key] = randomName(['rachel', 'lindsay', 'matthew', 'mark', 'molly', 'lena'], key));
            this.setState({avatarMap});
        }
    }

    componentDidMount() {
        this.props.fetchPlayers();
    }

    renderPlayers() {
        const {activeIndex} = this.state;

        if (this.state.avatarMap === undefined) {
            return null;
        }

        return _.map(this.props.players, player => {
            const PlayerTitle = (
                <React.Fragment>
                    <Image
                        avatar
                        src={`https://react.semantic-ui.com/images/avatar/small/${this.state.avatarMap[player.id]}.png`}
                        style={{marginRight: '10px'}}
                    />
                    <b>{capitalize(player.name)}</b>
                </React.Fragment>
            );

            return (
                <Menu.Item key={player.id}>
                    <Accordion.Title
                        active={activeIndex === player.id}
                        index={player.id}
                        onClick={this.handleClick}
                        content={PlayerTitle}
                    />
                    <PlayerContent player={player} players={this.props.players} active={activeIndex}/>
                </Menu.Item>
            )
        })
    }

    render() {
        return (
            <Container>
                <PageHeader/>
                {!Object.keys(this.props.players).length ? <p><b>No players to show. Please, add a new one.</b></p> :
                    <Accordion as={Menu} vertical fluid>
                        {this.renderPlayers()}
                    </Accordion>
                }
                <Link to={'/player'}>
                    <Button basic color='blue'>Add player</Button>
                </Link>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        players: state.players,
    };
}

export default connect(mapStateToProps, {fetchPlayers, fetchPlayerGameList})(PlayersIndex);