import React from 'react';
import styled from "styled-components";

const TableContainer = styled.div`
  margin: 10px;
`;

const Cell = styled.td`
  width: 45px;
  height: 45px;
`;

const CellSelected = styled(Cell)`
  background-color: #35e735;
`;

const CellShip = styled(Cell)`
  background-color: deepskyblue;
`;

const CellMiss = styled(Cell)`
  background-color: #e7e7e7;
`;

const CellHit = styled(Cell)`
  background-color: orangered;
`;

const GameBoard = (props) =>
    <TableContainer>
        <table className="ui compact celled table">
            <tbody>
            {props.board.map((row, index) => <tr key={index}>
                {row.map((cell, rowIndex) => {
                    switch (cell) {
                        case '#':
                            return <CellShip key={rowIndex}/>;
                        case 'O':
                            return <CellMiss key={rowIndex}/>;
                        case 'X':
                            return <CellHit key={rowIndex}/>;
                        default:
                            if(props.onClick) {
                                let cell =  <Cell key={rowIndex} onClick={() => props.onClick(index, rowIndex, true)} />;
                                if(props.salvo){
                                    props.salvo.forEach(shot => {
                                        if(shot[0] === index && shot[1] === rowIndex) {
                                            cell = <CellSelected key={rowIndex} onClick={() => props.onClick(index, rowIndex, false)}/>
                                        }
                                    })
                                }
                                return cell;
                            }
                            return <Cell key={rowIndex}/>;
                    }
                })}
            </tr>)}
            </tbody>
        </table>
    </TableContainer>
;

export default GameBoard;