import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Button } from '@mui/material';
import { Box } from '@mui/system';

function formatAsPercent(num) {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatAsUSD(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(parseInt(num.slice(0, -6), 10));
}

function FarmsList(props) {

  const [ yearnVaults, set_yearnVaults ] = React.useState([]);
  const onDepositClick = props.onDepositClick;

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://cache.yearn.finance/v1/chains/1/vaults/get");
      const vaults = await response.json();
      const filteredVaults = vaults.filter(vault => {
        return [
          "0xdCD90C7f6324cfa40d7169ef80b12031770B4325",
          "0xa258C4606Ca8206D8aA700cE2143D7db854D168c",
          "0xdA816459F1AB5631232FE5e97a05BBBb94970c95",
          "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE"
        ].includes(vault.address);
      });

      console.log(filteredVaults)

      set_yearnVaults(filteredVaults);
    }

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Icon</TableCell>
            <TableCell>Vault name</TableCell>
            <TableCell align="right">APY</TableCell>
            <TableCell align="right">Total Assets</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {yearnVaults.map((vault) => (
            <TableRow
              key={vault.address}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Avatar alt="Vault Icon" src={vault.metadata.displayIcon} />
              </TableCell>
              <TableCell component="th" scope="row">
                {vault.name}
              </TableCell>
              <TableCell align="right">
                {formatAsPercent(vault.metadata.apy.net_apy)}
              </TableCell>
              <TableCell align="right">
                {formatAsUSD(vault.underlyingTokenBalance.amountUsdc)}
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small" onClick={() => {onDepositClick(vault) }}>Deposit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default FarmsList;
