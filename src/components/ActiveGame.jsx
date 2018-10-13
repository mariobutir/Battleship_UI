import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {
    fetchGame,
    fetchPlayer,
    shotSalvo,
    turnOffAutopilot,
    turnOnAutopilot,
    updateGame,
} from "../actions";
import GameBoard from "./GameBoard";
import styled from "styled-components";
import getSelfBoard from "../utils/getSelfBoard";
import getOpponentBoard from "../utils/getOpponentBoard";
import {Button, Image, Loader} from "semantic-ui-react";
import shipLogo from "../images/battleship-logo.png";
import getChallenger from "../utils/getChallenger";
import getOpponent from "../utils/getOpponent";
import _ from 'lodash';
import {produce} from "immer";
import getPlayerTurn from "../utils/getPlayerTurn";
import {Link} from "react-router-dom";
import getWinner from "../utils/getWinner";
import getAttackersRemainingShips from "../utils/getAttackersRemainingShips";
import SockJS from "sockjs-client";

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
  align-items: center;
  margin: auto;
  width: 75px;
`;

class ActiveGame extends Component {
    state = {
        shots: [],
        shotsFired: false,
        firstSalvo: false
    };

    socket = null;
    progressInterval = null;

    ROOT_URL = process.env.REACT_APP_API_URL;

    initSocket = (gameId) => {
        const url = `${this.ROOT_URL}/game-status`;
        this.socket = new SockJS(url);

        this.socket.onopen = function () {
            console.log("socket open");
        };

        this.socket.onmessage = (e) => {
            console.log("websocket message");
            const result = JSON.parse(e.data);

            this.props.updateGame(result, gameId);

            if (document.getElementById('aboveProgressBar')) {
                if(this.props.opponent.name) {
                    document.getElementById('aboveProgressBar').innerHTML = _.capitalize(this.props.opponent.name) + ' will be attacking next...';
                }
            }

            if (document.getElementById('progressBar')) {
                document.getElementById('progressBar').style.width = '165px';
            }

            if (!this.props.winner) {
                setTimeout(() => {
                    if (document.getElementById('aboveProgressBar')) {
                        if(this.props.opponent.name) {
                            document.getElementById('aboveProgressBar').innerHTML = _.capitalize(this.props.opponent.name) + ' is preparing to fire...';
                        }
                    }
                    if (document.getElementById('progressBar')) {
                        document.getElementById('progressBar').style.width = '2px';
                    }
                    this.props.history.push(`/game/${gameId}/turn/${this.props.game.opponent.player_id}`);
                }, 2540);
            } else {
                this.closeSocket();
                this.props.history.push(`/game/${gameId}/turn/${this.props.winner}`);
            }
        };

        this.socket.onclose = function () {
            console.log("socket closed");
        };
    };

    closeSocket = () => {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    };

    componentDidMount() {
        this.props.fetchGame(this.props.match.params.playerTurn, this.props.match.params.gameId);
    }

    componentWillUnmount() {
        this.closeSocket();

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.challenger === undefined) {
            this.props.fetchPlayer(this.props.game.self.player_id);
        }

        if (this.props.opponent === undefined) {
            this.props.fetchPlayer(this.props.game.opponent.player_id);
        }

        if (this.props.game.self) {
            if ((this.props.game.self.autopilot && this.props.game.opponent.autopilot) && !this.socket) {
                this.initSocket(this.props.match.params.gameId);
                this.setState({
                    shots: [],
                    shotsFired: false
                });
            }

            if (!(this.props.game.self.autopilot) && this.socket) {
                this.closeSocket();
            }
        }

        if (prevProps.match.params.playerTurn !== this.props.match.params.playerTurn) {
            this.setState({
                shots: [],
                shotsFired: false
            });
            this.props.fetchGame(this.props.match.params.playerTurn, this.props.match.params.gameId);
        }

        if (this.props.game.opponent && this.props.game.opponent.autopilot && !_.isEqual(prevProps.opponentBoard, this.props.opponentBoard)) {
            this.setState({
                shots: [],
                shotsFired: false
            });
            this.props.fetchGame(this.props.match.params.playerTurn, this.props.match.params.gameId);
        }
    }

    onClickHandler = (a, b, add) => {
        if (add) {
            if (this.state.shots.length < this.props.attackerShips) {
                this.setState(
                    produce(state => {
                        state.shots.push([a, b]);
                    })
                );
            }
        } else {
            this.setState(
                produce(state => {
                    state.shots = state.shots.filter(value => !(value[0] === a && value[1] === b));
                })
            );
        }
    };

    onSubmit = () => {
        let temp = {salvo: []};
        this.state.shots.map((shot, index) => {
            temp.salvo[index] = shot[0] + 'x' + String.fromCharCode(shot[1] + 65);
        });
        this.props.shotSalvo(
            this.props.match.params.playerTurn,
            this.props.game ? this.props.game.opponent.id : null,
            this.props.match.params.gameId, temp,
            this.props.fetchGame
        );

        this.setState({
            shots: [],
            shotsFired: true,
            firstSalvo: false
        });
    };

    onFirstSalvoSubmit = () => {
        let temp = {salvo: []};
        this.state.shots.map((shot, index) => {
            temp.salvo[index] = shot[0] + 'x' + String.fromCharCode(shot[1] + 65);
        });
        this.props.shotSalvo(
            this.props.match.params.playerTurn,
            this.props.game ? this.props.game.opponent.id : null,
            this.props.match.params.gameId, temp,
            this.props.fetchGame
        );

        this.setState({
            shots: [],
            shotsFired: true,
            firstSalvo: true
        });
    };

    autopilotAttacking = () => {
        if (this.props.game) {
            if (!this.props.game.self.autopilot) {
                this.props.turnOnAutopilot(this.props.game.self.player_id, this.props.match.params.gameId);
            } else {
                this.props.turnOffAutopilot(this.props.game.self.player_id, this.props.match.params.gameId)
            }
        }
    };

    autopilotOpponent = () => {
        if (this.props.game) {
            if (!this.props.game.opponent.autopilot) {
                this.props.turnOnAutopilot(this.props.game.opponent.player_id, this.props.match.params.gameId);
            } else {
                this.props.turnOffAutopilot(this.props.game.opponent.player_id, this.props.match.params.gameId)
            }
        }
    };

    onNextPlayer = () => {
        this.props.history.push(`/game/${this.props.match.params.gameId}/turn/${this.props.game.opponent.player_id}`)
    };


    render() {
        const LoaderImage = <Loader active inline='centered'/>;
        return (
            <Container>
                <ButtonContainer>
                    {this.props.winner && this.props.opponent ?
                        <div style={{textAlign: 'center', maxHeight: '75px'}}>
                            <p style={{fontSize: 'large'}}><b>Game is
                                finished. {_.capitalize(
                                    !this.props.game.self ? null : (this.props.game.self.autopilot && this.props.game.opponent.autopilot) ? this.props.challenger.name : this.props.opponent.name
                                )} won!</b></p>
                            <Link to={'/player/list'}>
                                <Button basic color='blue'>Back to player list</Button>
                            </Link>
                        </div> :
                        !this.props.game.self ? null : (this.props.game.self.autopilot && this.props.game.opponent.autopilot) ? (
                                <div style={{textAlign: 'center', maxHeight: '75px'}}>
                                    <p style={{fontSize: 'medium'}}><b>Autopilots are playing!</b></p>
                                    <Button
                                        basic
                                        color='blue'
                                        type={'submit'}
                                        onClick={this.onFirstSalvoSubmit}
                                        disabled={!(this.state.shots.length <= this.props.attackerShips && this.state.shots.length > 0)}
                                    >Fire first salvo</Button>
                                    <p style={{textAlign: 'center', paddingTop: '20px'}}>Shots
                                        remaining: {this.props.attackerShips - this.state.shots.length}</p>
                                    <div style={{textAlign: 'center'}} id={'aboveProgressBar'}/>
                                    <div style={{
                                        height: '7px',
                                        width: '165px',
                                        border: '1px solid #8c8da2',
                                        borderRadius: '25px',
                                        margin: 'auto'
                                    }}><div id={'progressBar'}
                                         style={{
                                             margin: 'auto',
                                             height: '5px',
                                             width: '2px',
                                             transition: 'width 2.6s',
                                             background: 'DeepSkyBlue',
                                             borderRadius: '25px',
                                             border: '1px'
                                         }}
                                    /></div>
                                </div>) :
                            this.state.shotsFired ? (this.props.game.opponent.autopilot || this.props.firing ?
                                    <div style={{height: '75px'}}>{LoaderImage}</div>
                                    : <div>
                                        <Button
                                            basic
                                            color='blue'
                                            type={'submit'}
                                            style={{marginBottom: '39px'}}
                                            onClick={this.onNextPlayer}
                                        >Next turn!</Button>
                                        <Link to={'/player/list'}><Button basic type={'submit'}>Player
                                            list</Button></Link>
                                    </div>
                                )
                                : <div>
                                    <Button
                                        basic
                                        color='blue'
                                        type={'submit'}
                                        onClick={this.onSubmit}
                                        disabled={!(this.state.shots.length <= this.props.attackerShips && this.state.shots.length > 0)}
                                    >Fire salvo!</Button>
                                    <Link to={'/player/list'}><Button basic type={'submit'}>Player list</Button></Link>
                                    <p style={{textAlign: 'center', paddingTop: '20px'}}>Shots
                                        remaining: {this.props.attackerShips - this.state.shots.length}</p>
                                </div>
                    }
                </ButtonContainer>
                <BoardContainer>
                    <TitleContainer>
                        <h3>Attacking: {this.props.challenger ? _.capitalize(this.props.challenger.name) : null}</h3>
                        <GameBoard board={this.props.selfBoard}/>
                        <Button
                            id={'autopilotAttacking'}
                            basic
                            color={this.props.game.self ? (!this.props.game.self.autopilot ? 'blue' : null) : null}
                            type={'submit'}
                            onClick={this.autopilotAttacking}
                            style={{marginTop: '10px'}}
                            disabled={this.props.game.self ? (this.props.game.self.autopilot && this.props.game.opponent.autopilot) : false}
                            content={this.props.game.self ? (!this.props.game.self.autopilot ? 'Autopilot: turn on' : 'Autopilot: turn off') : null}
                        />
                    </TitleContainer>
                    <ImageContainer>
                        <Image src={shipLogo} size={'small'}/>
                    </ImageContainer>
                    <TitleContainer>
                        <h3>Opponent: {this.props.opponent ? _.capitalize(this.props.opponent.name) : null}</h3>
                        <GameBoard board={this.props.opponentBoard}
                                   onClick={this.onClickHandler}
                                   salvo={this.state.shots}/>
                        <Button id={'autopilotOpponent'}
                                basic
                                color={this.props.game.opponent ? (!this.props.game.opponent.autopilot ? 'blue' : null) : null}
                                type={'submit'}
                                onClick={this.autopilotOpponent}
                                style={{marginTop: '10px'}}
                                disabled={this.props.game.self ? (this.props.game.self.autopilot && this.props.game.opponent.autopilot) : false}
                                content={this.props.game.opponent ? (!this.props.game.opponent.autopilot ? 'Autopilot: turn on' : 'Autopilot: turn off') : null}
                        />
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
        game: state.game,
        winner: getWinner(state),
        attackerShips: getAttackersRemainingShips(state),
        firing: state.game.firing
    };
}

export default connect(mapStateToProps, {
    fetchGame,
    fetchPlayer,
    shotSalvo,
    turnOnAutopilot,
    turnOffAutopilot,
    updateGame,
})(ActiveGame);