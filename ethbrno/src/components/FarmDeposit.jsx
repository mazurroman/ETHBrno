import { Alert, Avatar, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { useState } from 'react';
import { getBalances, getTokenAllowance, quote } from "wido";

function FarmsDeposit(props) {

  const toVault = props.vault;
  const userWalletAddress = props.userWalletAddress;
  const onDepositClick = props.onDeposit;

  const [ userBalances, set_userBalances ] = useState([]);
  const [ fromToken, set_fromToken ] = useState([]);
  const [ isFromTokenApproved, set_isFromTokenApproved ] = useState(false);
  const [ depositQuote, set_depositQuote ] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const balances = await getBalances(
        userWalletAddress,
        [1]
      )

      console.log(balances);
      set_userBalances(balances);
    }

    fetchData();
  }, []);

  const onFromTokenClick = async (token) => {
    console.log(token)

    console.log("Fetching data")

    set_fromToken(token);
    set_depositQuote(null);

    const quoteResult = await quote({
      fromChainId: 1,
      fromToken: token.address,
      toChainId: 1,
      toToken: toVault.address,
      amount: token.balance,
      slippagePercentage: 0.01,
      user: "0x97b406229d93fe053bd0f59501bd42406e75bd73"
    })

    console.log(quoteResult)
    set_depositQuote(quoteResult);

    const isApproved = await getTokenAllowance({
      chainId: 1,
      tokenAddress: token.address,
      accountAddress: "0x97b406229d93fe053bd0f59501bd42406e75bd73"
    })

    console.log(isApproved);

    set_isFromTokenApproved(true)
  }

  const onDepositClickInternal = async () => {
    onDepositClick(depositQuote.data, depositQuote.to);
  }

  let depositQuoteSection;
  if (depositQuote !== null && depositQuote.isSupported === true) {
    depositQuoteSection = (
      <Box p={2}>
        <Alert severity="warning">
        You are just about to deposit ${depositQuote.fromTokenAmountUsdValue} {fromToken.symbol} to {toVault.name}
        </Alert>
        <Button disabled={isFromTokenApproved} sx={{mt:4, mr:2}} variant="contained">Approve</Button>
        <Button onClick={onDepositClickInternal} disabled={!isFromTokenApproved} sx={{mt:4}} variant="contained">Deposit</Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: "400px"
    }}>
      
      <Typography variant="h6" p={2}>Your wallet balances</Typography>

      <Box p={2}>
        <Alert severity="info">Select token you want to deposit into {toVault.name}</Alert>
      </Box>

      <List>
        {userBalances.slice(0, 3).map((userBalance => (
          <ListItem selected={userBalance.address === fromToken.address} key={userBalance.address} disablePadding>
            <ListItemButton onClick={() => onFromTokenClick(userBalance)}>
              <ListItemIcon>
                <Avatar src={userBalance.logoURI} />
              </ListItemIcon>
              <ListItemText primary={`$${userBalance.balanceUsdValue}`} secondary={`${userBalance.symbol}`} />
            </ListItemButton>
          </ListItem>
        )))}
      </List>

      {depositQuoteSection}
    </Box>
  )
}

export default FarmsDeposit;
