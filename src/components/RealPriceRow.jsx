import React from 'react'
import { TableCell, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';


function RealPriceRow(props) {
  const item = props.item
  const tradeType = props.tradeType

  // Table style ----------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));


  return (
    <StyledTableRow>
      <TableCell padding='none' align='center' sx= {{paddingTop:0.6, paddingBottom:0.6, width: 200}}>{item.tradeDate}</TableCell>
      <TableCell padding='none' align='center' sx= {{paddingTop:0.6, paddingBottom:0.6, width: 200}}>{item.floor}</TableCell>
      {tradeType === 'A1' && <TableCell padding='none' align='center' sx= {{paddingTop:0.6, paddingBottom:0.6, width: 300}}>{(item.dealPrice/1000).toLocaleString()}</TableCell>}
      {tradeType === 'B1' && <TableCell padding='none' align='center' sx= {{paddingTop:0.6, paddingBottom:0.6, width: 300}}>{(item.deposit/1000).toLocaleString()}</TableCell>}
      {tradeType === 'B2' && <TableCell padding='none' align='center' sx= {{paddingTop:0.6, paddingBottom:0.6, width: 300}}>{(item.deposit/1000).toLocaleString()}</TableCell>}
      {tradeType === 'B2' && <TableCell padding='none' align='center' sx= {{paddingTop:0.6, paddingBottom:0.6, width: 300}}>{(item.monthlyRent/10000).toLocaleString()}</TableCell>}
    </StyledTableRow>
  )
}

export default RealPriceRow