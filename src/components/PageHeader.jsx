import {Header, Image} from "semantic-ui-react";
import shipLogoLeft from "../images/battleship-logo.png";
import shipLogoRight from "../images/battleship-logo-mirrored.png";
import React from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
display: inline-block;
align-items: center;
vertical-align: middle;
padding-right: 8px;
`;

const TextContainer = styled.div`
display:inline-block;
vertical-align: middle;
margin-right: 78px;
margin-left: 70px;
`;

const PageHeader = () =>
    <Header textAlign={'center'}>
        <ImageContainer>
            <Image src={shipLogoRight} size={'tiny'}/>
        </ImageContainer>
        <TextContainer>
            <h1>Battleship&ensp;Game</h1>
        </TextContainer>
        <ImageContainer>
            <Image src={shipLogoLeft} size={'tiny'}/>
        </ImageContainer>
    </Header>
;

export default PageHeader;