import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {fetchGame, fetchPlayer} from "../actions";
import GameBoard from "./GameBoard";
import styled from "styled-components";
import getSelfBoard from "../utils/getSelfBoard";
import getOpponentBoard from "../utils/getOpponentBoard";
import {Button, Image} from "semantic-ui-react";
import shipLogo from "../images/battleship-logo.png";
import getChallenger from "../utils/getChallenger";
import getOpponent from "../utils/getOpponent";
import _ from 'lodash';
import {Link} from "react-router-dom";
import getPlayerTurn from "../utils/getPlayerTurn";

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding-top: 100px;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-content: center;
`;

const TitleContainer = styled.div`
  margin: auto;
  text-align: center;
`;

const ImageContainer = styled.div` 
  display: inline-block;
  align-items: center;
  vertical-align: middle;
  margin: auto;
  padding-left: 21px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 39px;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 150px;
  margin: auto;
  flex-direction: column;
`;

const LegendRow = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin: auto;
  width: 75px;
`;

class GameIndex extends Component {
    componentDidMount() {
        this.props.fetchGame(this.props.match.params.playerId, this.props.match.params.gameId);
    }

    componentDidUpdate() {
        if (this.props.challenger === undefined) {
            this.props.fetchPlayer(this.props.game.self.player_id);
        }

        if (this.props.opponent === undefined) {
            this.props.fetchPlayer(this.props.game.opponent.player_id);
        }
    }

    render() {
        if(!this.props.game.game){
            return null;
        }

        return (
            <Container>
                <ButtonContainer>
                    {
                        this.props.game.game.won ?
                            <div>
                                < Link to={'/player/list'}><Button basic type={'submit'}> Go back </Button></Link>
                            </div>:
                            <div>
                                <Link to={`/game/${this.props.match.params.gameId}/turn/${this.props.playerTurn}`}>
                                    <Button basic color='blue'>Join game!</Button>
                                </Link>
                                < Link to={'/player/list'}><Button basic type={'submit'}> Cancel </Button></Link>
                            </div>
                    }
                </ButtonContainer>
                <BoardContainer>
                    <TitleContainer>
                        <h3>Self: {this.props.challenger ? _.capitalize(this.props.challenger.name) : null}</h3>
                        <GameBoard board={this.props.selfBoard}/>
                    </TitleContainer>
                    <ImageContainer>
                        <Image src={shipLogo} size={'small'}/>
                    </ImageContainer>
                    <TitleContainer>
                        <h3>Opponent: {this.props.opponent ? _.capitalize(this.props.opponent.name) : null}</h3>
                        <GameBoard board={this.props.opponentBoard}/>
                    </TitleContainer>
                </BoardContainer>
                <LegendContainer>
                    <p style={{textAlign: 'center'}}><b>Legend:</b></p>
                    <LegendRow>
                        <div style={{backgroundColor: '#00BFFF', width: '15px', height: '15px'}}/>
                        <b>ship</b>
                    </LegendRow>
                    <LegendRow>
                        <div style={{backgroundColor: '#FF4500', color: 'white', width: '15px', height: '15px'}}/>
                        <b>hit</b>
                    </LegendRow>
                    <LegendRow>
                        <div style={{backgroundColor: '#E7E7E7', width: '15px', height: '15px'}}/>
                        <b>miss</b>
                    </LegendRow>
                </LegendContainer>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        selfBoard: getSelfBoard(state),
        opponentBoard: getOpponentBoard(state),
        challenger: getChallenger(state),
        opponent: getOpponent(state),
        playerTurn: getPlayerTurn(state),
        game: state.game
    };
}

export default connect(mapStateToProps, {fetchGame, fetchPlayer})(GameIndex)