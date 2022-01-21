////requirements
import React, { Component } from 'react';
import Moment from 'moment';
import ReactDOM from 'react-dom';
import axios from 'axios';
import api from '../api/api';

class ContentBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wagons: [],
            observation: [],
            separateRailroad: [
                {
                    totalSojaRUMO: 0,
                    totalSojaMRS: 0,
                    totalSojaVLI: 0,
                    totalSoja: 0,
                },
                {
                    totalMilhoRUMO: 0,
                    totalMilhoMRS: 0,
                    totalMilhoVLI: 0,
                    totalMilho: 0,

                },
                {
                    totalRUMO: 0,
                    totalMRS: 0,
                    totalVLI: 0,
                    complete: false,
                }
            ],
            totalWeight: 0,
            isToggleOn: false,
            textarea: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleObservation = this.handleObservation.bind(this);
    }

    handleChange(event) {
        this.setState({textarea: event.target.value});
    }

    async componentDidMount() {
        const responseObservation = await api.get('/observation');
        this.setState({ observation: responseObservation.data });

        const responseWagons = await api.get('/wagons');
        this.setState({ wagons: responseWagons.data });
    }

    putAPI() {
        const { data } = axios({
            method: 'put',
            url: 'https://api.tot.apigbmtech.com/api/selective-process/observation',
            data: {
                description: this.state.textarea,
            },
            params: {
                authorization: '67c9d5c3887b64c33671bb25f681753a',
            },
        }).then(response => { });
    }

    contAll(wagons) {
        wagons.forEach(wagons => {
            this.state.totalWeight += parseInt(wagons.weight)

            if (wagons.product === 'Soja') {
                if (wagons.railroad === 'RUMO') {
                    this.state.separateRailroad[0].totalSojaRUMO += parseInt(wagons.weight);
                }else if (wagons.railroad === 'MRS') {
                    this.state.separateRailroad[0].totalSojaMRS += parseInt(wagons.weight);
                }else if (wagons.railroad === 'VLI') {
                    this.state.separateRailroad[0].totalSojaVLI += parseInt(wagons.weight);
                }
            }else if (wagons.product === 'Milho') {
                if (wagons.railroad === 'RUMO') {
                    this.state.separateRailroad[1].totalMilhoRUMO += parseInt(wagons.weight);
                }else if (wagons.railroad === 'MRS') {
                    this.state.separateRailroad[1].totalMilhoMRS += parseInt(wagons.weight);
                }else if (wagons.railroad === 'VLI') {
                    this.state.separateRailroad[1].totalMilhoVLI += parseInt(wagons.weight);
                }
            }
            this.state.separateRailroad[0].totalSoja = this.state.separateRailroad[0].totalSojaRUMO + this.state.separateRailroad[0].totalSojaMRS + this.state.separateRailroad[0].totalSojaVLI;
            this.state.separateRailroad[1].totalMilho = this.state.separateRailroad[1].totalMilhoRUMO + this.state.separateRailroad[1].totalMilhoMRS + this.state.separateRailroad[1].totalMilhoVLI;
    
            this.state.separateRailroad[2].totalRUMO = this.state.separateRailroad[0].totalSojaRUMO + this.state.separateRailroad[1].totalMilhoRUMO;
            this.state.separateRailroad[2].totalMRS = this.state.separateRailroad[0].totalSojaMRS + this.state.separateRailroad[1].totalMilhoMRS;
            this.state.separateRailroad[2].totalVLI = this.state.separateRailroad[0].totalSojaVLI + this.state.separateRailroad[1].totalMilhoVLI;
            this.state.separateRailroad[2].complete = true;   
        });
        
    }

    handleObservation() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
        }));
    }

    render() {
        const { wagons } = this.state;
        const { observation } = this.state;

        if(this.state.separateRailroad[2].complete == false) {
            this.contAll(wagons);
        }

        return(
            <div className="contentBody">
                <table className="contentTable">
                    <thead className="contentTableTitles">
                        <th>Placa</th>
                        <th>Ferrovia</th>
                        <th>Produto</th>
                        <th>Data/Hora Início Desc.</th>
                        <th>Data/Hora Fim Desc.</th>
                        <th>Peso destino</th>
                    </thead>
                    {wagons.map(wagons => (
                        <tbody className="contentTableResults">
                            <td>{wagons.plate}</td>
                            <td>
                                {wagons.railroad}
                            </td>
                            <td>{wagons.product}</td>
                            <td>
                                {new Intl.DateTimeFormat('pt-br', { 
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                }).format(new Date(wagons.downloadStartTime))}
                            </td>
                            <td>
                                {new Intl.DateTimeFormat('pt-br', { 
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                }).format(new Date(wagons.downloadEndTime))}
                            </td>
                            <td>
                                {(wagons.weight / 1000).toFixed(3)}
                            </td>
                        </tbody>
                    ))}
                    <tfoot>
                        <tr className="contentTableTotal">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Total</td>
                            <td>
                                {(this.state.totalWeight / 1000).toFixed(3)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="contentBodyBaseboard">
                    <div className="contentBodyBaseboardTitle">
                        Resumo de pesagens
                    </div>
                    <div className="tableGroup flexRow">
                        <table className="totalTable">
                            <thead className="totalTableTitles">
                                <th colSpan={4}>SOJA</th>
                            </thead>
                            <tbody className="totalTableTitles">
                                <td>RUMO</td>
                                <td>MRS</td>
                                <td>VLI</td>
                                <td className="bold">TOTAL</td>
                            </tbody>
                            <tbody className="totalTableTitles">
                                <td>{(this.state.separateRailroad[0].totalSojaRUMO / 1000).toFixed(3)}</td>
                                <td>{(this.state.separateRailroad[0].totalSojaMRS / 1000).toFixed(3)}</td>
                                <td>{(this.state.separateRailroad[0].totalSojaVLI / 1000).toFixed(3)}</td>
                                <td className="bold">{(this.state.separateRailroad[0].totalSoja / 1000).toFixed(3)}</td>
                            </tbody>
                        </table>
                        <table className="totalTable">
                            <thead className="totalTableTitles">
                                <th colSpan={4}>MILHO</th>
                            </thead>
                            <tbody className="totalTableTitles">
                                <td>RUMO</td>
                                <td>MRS</td>
                                <td>VLI</td>
                                <td className="bold">TOTAL</td>
                            </tbody>
                            <tbody className="totalTableTitles">
                                <td>{(this.state.separateRailroad[1].totalMilhoRUMO / 1000).toFixed(3)}</td>
                                <td>{(this.state.separateRailroad[1].totalMilhoMRS / 1000).toFixed(3)}</td>
                                <td>{(this.state.separateRailroad[1].totalMilhoVLI / 1000).toFixed(3)}</td>
                                <td className="bold">{(this.state.separateRailroad[1].totalMilho / 1000).toFixed(3)}</td>
                            </tbody>
                        </table>
                        <table className="totalTable">
                            <thead className="totalTableTitles">
                                <th colSpan={4}>TOTAL</th>
                            </thead>
                            <tbody className="totalTableTitles">
                                <td>RUMO</td>
                                <td>MRS</td>
                                <td>VLI</td>
                                <td className="bold">TOTAL</td>
                            </tbody>
                            <tbody className="totalTableTitles">
                                <td>{(this.state.separateRailroad[2].totalRUMO / 1000).toFixed(3)}</td>
                                <td>{(this.state.separateRailroad[2].totalMRS / 1000).toFixed(3)}</td>
                                <td>{(this.state.separateRailroad[2].totalVLI / 1000).toFixed(3)}</td>
                                <td className="bold">{(this.state.totalWeight / 1000).toFixed(3)}</td>
                            </tbody>
                        </table>
                    </div>
                    <div className="contentComment flexColumn">
                        <div className="flexRow">
                            <div className="commentTitle">
                                Observações
                            </div>
                            {this.state.isToggleOn ? <button onClick={this.handleObservation} className="cancelCommentButton" >Cancelar</button> : ''}
                            {this.state.isToggleOn ? <button className="editCommentButton" onClick={this.putAPI()}>Salvar</button> : <button className="editCommentButton" onClick={this.handleObservation}>Editar</button>}
                        </div>
                        
                        {this.state.isToggleOn ? <textarea className="commentText" value={this.state.textarea} onChange={this.handleChange}></textarea> : observation.map(observation => (
                                <textarea className="commentText" value={observation.observation} readOnly></textarea>
                            ))}
                    </div>

                </div>
            </div>
        );
    };
}

export default ContentBody;