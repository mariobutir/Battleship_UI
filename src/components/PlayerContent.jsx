import {Image, Accordion, List, Button} from 'semantic-ui-react';
import idLogo from "../images/id.svg";
import mailLogo from "../images/mail.svg";
import gameLogo from "../images/game.svg";
import React from "react";
import styled from "styled-components";
import _ from 'lodash';
import {Link} from "react-router-dom";

const ImageContainer = styled.div`
    display: inline-block;
    align-items: center;
    vertical-align: middle;
    padding-right: 8px;
`;

const TextContainer = styled.div`
    display:inline-block;
    vertical-align: middle;
    padding-right: 20px;
    line-height: 1.6;
`;

const GameImage = styled(ImageContainer)`
  vertical-align: top;
  min-width: 38px;
`;

const GameContent = styled(TextContainer)`
  padding-top: 1px;
`;

const GameList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ButtonContainer = styled.div`
  height: 30px;
  width: 70px;
  display:inline-block;
  align-self: center;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const PlayerContent = ({player, players, active}) => (
    <Accordion.Content active={active === player.id} content={(
        <List>
            <List.Item>
                <ImageContainer>
                    <Image src={idLogo}/>
                </ImageContainer>
                <TextContainer>
                    <List.Content style={{paddingLeft: '6px'}}>{player.id}</List.Content>
                </TextContainer>
            </List.Item>
            <List.Item>
                <ImageContainer>
                    <Image src={mailLogo}/>
                </ImageContainer>
                <TextContainer>
                    <List.Content style={{paddingLeft: '6px'}}>{player.email}</List.Content>
                </TextContainer>
            </List.Item>
            <List.Item style={{display: 'flex'}}>
                <GameImage>
                    <Image src={gameLogo}/>
                </GameImage>
                <GameContent>
                    <List.Content>{player.games ?
                        <GameList>
                            {player.games.map(game => <TextContainer key={game.game_id} style={{minWidth: '151px'}}>
                                <b>Game {game.game_id}</b> <br/>
                                opponent: {_.capitalize(players[game.opponent_id].name)} <br/>
                                {
                                    game.status === 'IN_PROGRESS' ?
                                        <TextContainer style={{paddingBottom: '8px'}}>
                                            status: in progress<br/>
                                            <Link to={`/player/${active}/game/${game.game_id}`}>View game status</Link>
                                        </TextContainer> :
                                        <TextContainer style={{paddingBottom: '8px'}}>
                                            status: {_.toLower(game.status)}<br/>
                                            <Link to={`/player/${active}/game/${game.game_id}`}>View game status</Link>
                                        </TextContainer>
                                }
                            </TextContainer>)}
                            <ButtonContainer>
                                <Link to={`/game/challenge/${active}`}>
                                    <Button basic size={'mini'} color='blue'>Challenge!</Button>
                                </Link>
                            </ButtonContainer>
                        </GameList> :
                        <div>
                        <p>No games played</p>
                        <ButtonContainer>
                            <Link to={`/game/challenge/${active}`}>
                                <Button basic size={'mini'} color='blue'>Challenge!</Button>
                            </Link></ButtonContainer>
                        </div>
                    }</List.Content>
                </GameContent>
            </List.Item>
        </List>
    )}/>
);

export default PlayerContent;