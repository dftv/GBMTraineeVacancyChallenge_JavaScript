import React, { Component } from 'react';
import ContentBody from './components/contentBody';

import { ReactComponent as Logo } from './lib/logo/logo.svg';
import { ReactComponent as HouseDoorIcon } from './lib/icon/houseDoor.svg';
import { ReactComponent as ListIcon } from './lib/icon/list.svg';
import { ReactComponent as PeopleCircleIcon } from './lib/icon/peopleCircle.svg';
import { ReactComponent as CaretDownIcon } from './lib/icon/caretDown.svg';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      instantiateCreateContentBody: null,
    };

    this.CreateContentBody = this.CreateContentBody.bind(this);
  }

  CreateContentBody() {
    this.setState(state => ({
      instantiateCreateContentBody: <ContentBody />
    }));
  }

  render() {
    return (
      <div className="container flexRow">

        <div className="sidebar flexColumn">
          <div className='sidebarContainerLogo flexColumn'>
            <Logo className="sidebarLogo"/>
          </div>

          <div className="sidebarMenu flexColumn">
            <div className="sidebarTitle">
              Principal
            </div>
            <ul className="sidebarList">
              <li>
                <a className="sidebarListLink flexRow" href="">
                  <HouseDoorIcon className="sidebarListedIcon"/> Home
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="generalContainer flexColumn">
          <nav className="navbar flexRow">
            <a className="navbarIconLink flexRow" href="">
              <ListIcon className="navbarIcon"/>
            </a>
            <div className="userContainer flexRow">
              <PeopleCircleIcon className="userIcon"/>
              <span className="userStatus"></span>
              <div className="userLevel flexRow">
                <a className="userLevelLink flexRow" href="">
                  Admin <CaretDownIcon className="userLevelIcon"/>
                </a>
              </div>
            </div>
          </nav>
          <div className="content flexColumn">
            <div className="contentHeader flexRow">
              <div className="contentTitle">
                Vagões Cadastrados
              </div>
              <button className="searchApiButton" onClick={this.CreateContentBody}>Buscar vagões API</button>
            </div>
            {this.state.instantiateCreateContentBody}
          </div>
        </div>
      </div>
    );
  };
}

export default App;
