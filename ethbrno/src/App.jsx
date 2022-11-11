import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

import FarmsList from './components/FarmsList';
import FarmDeposit from './components/FarmDeposit';

import { Button, Drawer, Typography } from '@mui/material'

const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/607d2bcf8be74e139a27b5a85a1283d7'

const injected = injectedModule()

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: MAINNET_RPC_URL
    }
  ]
})

function App() {

  const [userWalletAddress, setUserWalletAddres] = useState();
  const [signer, set_signer] = useState();
  const [isDepositDialogOpen, set_isDepositDialogOpen] = useState(false);
  const [selectedVault, set_selectedVault] = useState();

  const onWalletConnectClick = async () => {
    const wallets = await onboard.connectWallet()

    console.log(wallets)

    if (wallets[0]) {
      // create an ethers provider with the last connected wallet provider
      const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')

      setUserWalletAddres(wallets[0].accounts[0].address)
    
      set_signer(ethersProvider.getSigner());
    }
  }

  let ConnectWalletBtn;
  if (!userWalletAddress) {
    ConnectWalletBtn = (
      <Button variant="contained" onClick={onWalletConnectClick}>Connect Wallet</Button>
    );
  }

  const onDepositClick = (vault) => {
    set_isDepositDialogOpen(true);
    set_selectedVault(vault);
  }

  const onFarmDeposit = async (data, to) => {
    // console.log(data, to);
    const tx = signer.sendTransaction({ data, to });
  }

  return (
    <div className="App">
      <Typography variant="h3">Save in DeFi</Typography>
      <Typography variant="h6">DeFi can offer higher rates than traditional banks because it doesn't require humans to operate.</Typography>

      {ConnectWalletBtn}

      <FarmsList onDepositClick={onDepositClick}></FarmsList>
      <Drawer
        anchor={"right"}
        open={isDepositDialogOpen}
        onClose={() => {set_isDepositDialogOpen(false)}}
        sx={{
          
        }}
      >
        <FarmDeposit vault={selectedVault} userWalletAddress={userWalletAddress} onDeposit={onFarmDeposit} />
      </Drawer>
    </div>
  )
}

export default App
