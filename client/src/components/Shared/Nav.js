import React, {Component} from 'react';
import ENS from 'ethereum-ens';

import logo from '../../assets/logo.png';

import '../../layout/components/nav.sass';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      noProvider: false,
      testNetwork: false,
      ENSName: null
    }

    if(window.ethereum) {
      this.state.address = this.props.drizzleState.accounts[0];

      window.ethereum.on('accountsChanged', (accounts) => {
        this.props.drizzle.store.dispatch({type: 'ACCOUNTS_FETCHED', accounts});
        this.setState({address: accounts[0]});
      });

      this.ens = new ENS(this.props.drizzle.web3);
    }
  }

  componentDidMount = async () => {
    try {
      if(!this.props.drizzle.web3.givenProvider) {
        this.setState({address: null});
        this.setState({noProvider: true});
      } else {
        await this.setState({address: this.props.drizzleState.accounts[0]});
        this.setState({noProvider: false});
        this.getENSName();
      }
      if(this.props.drizzleState.web3.networkId !== 1) {
        this.setState({testNetwork: true});
      } else {
        this.setState({testNetwork: false})
      }
    } catch {
      this.setState({address: null});
      this.setState({noProvider: true});
    }
  }

  getNetwork = (id) => {
    const networks = {
      1: 'Mainnet',
      3: 'Ropsten',
      4: 'Rinkeby',
      5: 'Goerli',
      42: 'Kovan'
    }

    return networks[id];
  }

  getENSName = async () => {
    try {
      let name = await this.ens.reverse(this.state.address).name();
      if(this.state.address !== await this.ens.resolver(name).addr()) {
        name = null;
      } else {
        this.setState({ENSName: name});
      } 
    } catch {
      
    }
  }

  render() {
    if(this.state.testNetwork) {
      return (
        <nav className="nav-error">
          <p className="nav-error__error">
            Note: You are currently connected to the {this.getNetwork(this.props.drizzleState.web3.networkId)} testnet.
          </p>
          <div className="nav-error__content">
            <a href="/" className="nav__header">
              <img src={logo} alt="Trustless Fund" className="nav__logo" />
              Trustless Fund
            </a>
            <button className="nav__button">
              {this.state.ENSName ? `${this.state.ENSName}` :
                this.state.address ? 
                  `${this.state.address.slice(0, 4)}...${this.state.address.slice(this.state.address.length - 4, this.state.address.length)}` : 
                  'Connect Wallet'}
            </button>
          </div>
        </nav>
      );
    }

    if(this.state.noProvider) {
      return (
        <nav className="nav-error">
          <p className="nav-error__error">
            No web3 detected. Please download and connect to Metamask.
          </p>
          <div className="nav-error__content">
            <a href="/" className="nav__header">
              <img src={logo} alt="Trustless Fund" className="nav__logo" />
              Trustless Fund
            </a>
            <button className="nav__button">
              {this.state.ENSName ? `${this.state.ENSName}` :
                  this.state.address ? 
                    `${this.state.address.slice(0, 4)}...${this.state.address.slice(this.state.address.length - 4, this.state.address.length)}` : 
                    'Connect Wallet'}
            </button>
          </div>
        </nav>
      );
    }

    return (
      <nav className="nav">
        <a href="/" className="nav__header">
          <img src={logo} alt="Trustless Fund" className="nav__logo" />
          Trustless Fund
        </a>
        <button className="nav__button">
          {this.state.ENSName ? `${this.state.ENSName}` :
            this.state.address ? 
              `${this.state.address.slice(0, 4)}...${this.state.address.slice(this.state.address.length - 4, this.state.address.length)}` : 
              'Connect Wallet'}
        </button>
      </nav>
    );
  }
}

export default Nav;